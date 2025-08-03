const { WebSocket, WebSocketServer } = require('ws')

const { collection, db, server } = require('./api')

const { handleJoinRoom, handleSetUser, handleSetAdmin } = require('./services/user.service')
const { handleSendMessage, handleSendUsers, handleCoolDownUser, handleShareAction, handleSendTyping } = require('./services/message.service')
const { handleDisplayLabel, handleSetConfig } = require('./services/event.service')
const { handleUpdateSlides } = require('./services/slide.service')
const { handleUpdateDisplay, handleShareDisplay } = require('./services/display.service')

require('dotenv/config')

// MARK: Constants
const wss = new WebSocketServer({ server })

// MARK: Functions
const sendRoom = (eventID, room, obj) => {
  wss.clients.forEach((client) => {
    if ((client.eventID === eventID) && (client.readyState === WebSocket.OPEN)) {
      if (room === 'admin' && !client.isAdmin) return
      client.send(JSON.stringify(obj))
    }
  })
}

const sendUser = (eventID, userID, obj) => {
  wss.clients.forEach((client) => {
    if ((client.eventID === eventID) && (client.userID === userID)) {
      client.send(JSON.stringify(obj))
    }
  })
}

// MARK: Exports
module.exports = { sendRoom, sendUser }

// MARK: Websocket
const interval = setInterval(() => {
  wss.clients.forEach((client) => {
    if (client.isAlive === false && client.readyState === WebSocket.OPEN) return client.terminate()

    client.isAlive = false
    if (client.readyState) client.send(JSON.stringify({ command: 'PING' }))
  })
}, 10000)

wss.on('connection', async (ws) => {
  ws.isAlive = true

  ws.on('message', async (msg) => {
    const req = JSON.parse(msg)
    console.log({ req })

    if (req.command === 'JOIN_ROOM') {
      await handleJoinRoom(req, ws, sendRoom)
    } else if (req.command === 'SET_USER') {
      await handleSetUser(req, ws, sendRoom)
    } else if (req.command === 'SET_STTS') {
      await handleSetAdmin(req, wss, sendUser, sendRoom)
    } else if (req.command === 'SEND_MSG') {
      await handleSendMessage(req, ws, sendRoom)
    } else if (req.command === 'SEND_USERS') {
      await handleSendUsers(req, ws, sendRoom)
    } else if (req.command === 'CLDW_USER') {
      await handleCoolDownUser(req, sendUser, sendRoom)
    } else if (req.command === 'DISP_LBL') {
      await handleDisplayLabel(req, sendRoom)
    } else if (req.command === 'SHR_ACT') {
      await handleShareAction(req, ws, sendRoom)
    } else if (req.command === 'SEND_TYP') {
      await handleSendTyping(req, ws, sendRoom)
    } else if (req.command === 'SET_CNFG') {
      await handleSetConfig(req, sendRoom)
    } else if (req.command === 'UPDT_SLDS') {
      await handleUpdateSlides(req, sendRoom)
    }

    if (req.command === 'UPDT_DISP') {
      await handleUpdateDisplay(req, sendRoom)
    } else if (req.command === 'SHARE_DISP') {
      await handleShareDisplay(req, sendRoom)
    }

    if (req.command === 'PONG') {
      console.log(`[${ws.username}-${ws.userID}] [${(new Date(Date.now())).toLocaleString('en-GB').split(' ')[1]}] \x1b[33mPONG is received\x1b[0m`)
      ws.isAlive = true
    }
  })

  ws.on('close', async () => {
    console.log('[WS Close] ws.eventID:', ws.eventID)
    console.log('[WS Close] event is in NeDB:', db[`event-${ws.eventID}`] ? 'yes' : 'no')


    if (ws.displayID) {
      const event = await db.events.findOneAsync({ eventID: ws.eventID })

      if (ws.displayID === event.activeDisplay.id) {
        await db.events.updateAsync({ eventID: ws.eventID }, { $set: { activeDisplay: { id: '', slide: {} } } })
        sendRoom(ws.eventID, 'user', { command: 'SHARE_DISP', displayID: ws.displayID, state: false, slide: {} })
      }

      event.displays = event.displays.filter((d) => d.id !== ws.displayID)
      await db.events.updateAsync({ eventID: ws.eventID }, { $set: { displays: event.displays } })

      return sendRoom(ws.eventID, 'user', { command: 'UPDT_DISPS', displays: event.displays })
    }

    if (db[`event-${ws.eventID}`]) {
      await db[`event-${ws.eventID}`].updateAsync({ userID: ws.userID }, { $set: { isActive: false } })
      const activeUsers = await db[`event-${ws.eventID}`].findAsync({ isActive: true })
      const userList = await db[`event-${ws.eventID}`].findAsync({})

      const roomActivity = { user: { id: ws.userID, name: ws.username }, activity: 'left' }
      await db.events.updateAsync({ eventID: ws.eventID }, { $set: { roomActivity } })


      if (activeUsers.length === 0) {
        const event = await db.events.findOneAsync({ eventID: ws.eventID }, { _id: 0 })
        event.activeDisplay = { id: '', slide: {} }
        event.displays = []
        await collection('events').replaceOne({ eventID: ws.eventID }, event)
        await db.events.removeAsync({ eventID: ws.eventID })
        delete db[`event-${ws.eventID}`]
      }


      sendRoom(ws.eventID, 'user', { command: 'ROOM_ACTY', roomActivity, userList })
      sendRoom(ws.eventID, 'admin', { command: 'UPDT_STTS', userList })
    }
  })

  ws.on('error', console.error)
})

wss.on('close', () => clearInterval(interval))
wss.on('error', console.error)