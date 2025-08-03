const { WebSocket, WebSocketServer } = require('ws')
const { server } = require('./api')

const { handleJoinRoom, handleSetUser, handleSetAdmin, handleUserDisconnect } = require('./services/user.service')
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

const handlePong = (ws) => {
  console.log(`[${ws.username}-${ws.userID}] [${(new Date(Date.now())).toLocaleString('en-GB').split(' ')[1]}] \x1b[33mPONG is received\x1b[0m`)
  ws.isAlive = true
}

wss.on('connection', async (ws) => {
  ws.isAlive = true

  ws.on('message', async (msg) => {
    const req = JSON.parse(msg)

    if (req.command === 'JOIN_ROOM') { await handleJoinRoom(req, ws, sendRoom) }
    else if (req.command === 'SET_USER') { await handleSetUser(req, ws, sendRoom) }
    else if (req.command === 'SET_STTS') { await handleSetAdmin(req, wss, sendUser, sendRoom) }
    else if (req.command === 'SEND_MSG') { await handleSendMessage(req, ws, sendRoom) }
    else if (req.command === 'SEND_USERS') { await handleSendUsers(req, ws, sendRoom) }
    else if (req.command === 'CLDW_USER') { await handleCoolDownUser(req, sendUser, sendRoom) }
    else if (req.command === 'DISP_LBL') { await handleDisplayLabel(req, sendRoom) }
    else if (req.command === 'SHR_ACT') { await handleShareAction(req, ws, sendRoom) }
    else if (req.command === 'SEND_TYP') { await handleSendTyping(req, ws, sendRoom) }
    else if (req.command === 'SET_CNFG') { await handleSetConfig(req, sendRoom) }
    else if (req.command === 'UPDT_SLDS') { await handleUpdateSlides(req, sendRoom) }

    else if (req.command === 'UPDT_DISP') { await handleUpdateDisplay(req, sendRoom) }
    else if (req.command === 'SHARE_DISP') { await handleShareDisplay(req, sendRoom) }

    if (req.command === 'PONG') { handlePong(ws) }
  })

  ws.on('close', async () => handleUserDisconnect(ws, sendRoom))

  ws.on('error', console.error)
})

wss.on('close', () => clearInterval(interval))
wss.on('error', console.error)