const { ObjectId } = require('mongodb')
const Datastore = require('@seald-io/nedb')
const jwt = require('jsonwebtoken')
const { genColor, genRandom } = require('../utils/core.utils')
const { collection, db } = require('../api')


exports.handleJoinRoom = async (req, ws, sendRoom) => {
  ws.eventID = req.eventID
  ws.displayID = req.displayID

  let event = await db.events.findOneAsync({ eventID: req.eventID })

  let user = {
    userID: genRandom(8, 10),
    username: 'In lobby',
    color: genColor(),
    isActive: true,
    isInLobby: true,
    isPresenter: false,
    isAdmin: false,
    adminKey: ''
  }

  if (req.userID) {
    // TODO: When last person try to reconnect after disconnecting, the event will be deleted from NeDB
    console.log('[JOIN_ROOM] eventID:', req.userID, db.hasOwnProperty(`event-${req.eventID}`), event ? 'Event exists' : 'Event does not exist')

    // IMPROVE: Restore event
    if (!db.hasOwnProperty(`event-${req.eventID}`)) {
      const dbEvent = await collection('events').findOne({ eventID: req.eventID }, { projection: { _id: 0 } })
      await db.events.insertAsync(dbEvent)
      db[`event-${req.eventID}`] = new Datastore()
    }

    const newUser = await db[`event-${req.eventID}`].findOneAsync({ userID: req.userID })
    if (newUser) {
      user = newUser
      user.isActive = true
      await db[`event-${req.eventID}`].updateAsync({ userID: req.userID }, { $set: { isActive: true } })
    }
  }

  try {
    const payload = jwt.verify(req.token, process.env.ACS_TKN_SCT)
    if (event.presenter.id === payload.sub) {
      const presenter = await collection('users').findOne({ _id: new ObjectId(payload.sub) })

      user.username = presenter.username
      user.color = presenter.color
      user.isInLobby = false
      user.isPresenter = true
      user.isAdmin = true
      user.adminKey = genRandom(16)
    }
  } catch (err) {
    // console.log(err)
  }

  ws.userID = user.userID
  ws.username = user.username
  ws.isAdmin = user.isAdmin

  console.log('[JOIN_ROOM] finally() eventID:', req.userID, db.hasOwnProperty(`event-${req.eventID}`), event ? 'Event exists' : 'Event does not exist')
  // IMPROVE: Restore event
  if (!db[`event-${req.eventID}`] || !event) {
    const dbEvent = await collection('events').findOne({ eventID: req.eventID }, { projection: { _id: 0 } })
    await db.events.insertAsync(dbEvent)
    event = dbEvent
    db[`event-${req.eventID}`] = new Datastore()
  }

  await db[`event-${req.eventID}`].updateAsync({ userID: user.userID }, user, { upsert: true })

  const userShares = event.shares.filter(s => s.isShared)
  const userList = await db[`event-${req.eventID}`].findAsync({})
  const roomActivity = { user: { id: user.userID, name: user.username }, activity: (user.isPresenter || !user.isInLobby) ? 'joined' : 'in lobby' }
  await db.events.updateAsync({ eventID: req.eventID }, { $set: { roomActivity } })

  ws.send(JSON.stringify({
    command: 'INIT_USER',
    user: { id: ws.userID, name: user.username, color: user.color, isPresenter: user.isPresenter, isInLobby: user.isInLobby },
    eventID: req.eventID,
    queue: user.isPresenter ? event.queue : [],
    quests: event.quests,
    displays: event.displays,
    slides: event.slides,
    activeDisplay: event.activeDisplay,
    shares: user.isPresenter ? event.shares : userShares,
    roomActivity,
    display: event.display,
    config: event.config
  }))

  sendRoom(req.eventID, 'user', { command: 'ROOM_ACTY', roomActivity, userList })
  sendRoom(req.eventID, 'admin', { command: 'UPDT_STTS', userList })
}

exports.handleSetUser = async (req, ws, sendRoom) => {
  let event = await db.events.findOneAsync({ eventID: req.eventID })

  const user = await db[`event-${req.eventID}`].findOneAsync({ userID: ws.userID })
  await db[`event-${req.eventID}`].updateAsync({ userID: ws.userID }, { $set: { isInLobby: !user.isInLobby, username: req.username } })

  try {
    const payload = jwt.verify(req.token, process.env.ACS_TKN_SCT)
    if (event.presenter.id === payload.sub) {
      await collection('users').updateOne({ _id: new ObjectId(payload.sub) }, { $set: { username: req.username } })
    }
  } catch (err) {
    // Error handling for token verification
  }

  const userList = await db[`event-${req.eventID}`].findAsync({})
  const roomActivity = { user: { id: ws.userID, name: req.username }, activity: req.roomActivity }
  await db.events.updateAsync({ eventID: req.eventID }, { $set: { roomActivity } })

  ws.username = req.username

  sendRoom(req.eventID, 'user', { command: 'ROOM_ACTY', roomActivity, userList })
  sendRoom(req.eventID, 'admin', { command: 'UPDT_STTS', userList })
}

exports.handleSetAdmin = async (req, wss, sendUser, sendRoom) => {
  let userShares = []

  const event = await db.events.findOneAsync({ eventID: req.eventID })

  wss.clients.forEach((client) => {
    if (client.userID === req.userID) {
      if (req.isAdmin) {
        client.isAdmin = true
        userShares = event.shares
      } else {
        client.isAdmin = false
        userShares = event.shares.filter(s => s.isShared)
      }
    }
  })

  const adminKey = req.isAdmin ? genRandom(16) : ''
  await db[`event-${req.eventID}`].updateAsync({ userID: req.userID }, { $set: { adminKey, isAdmin: req.isAdmin } })

  const userList = await db[`event-${req.eventID}`].findAsync({})

  sendUser(req.eventID, req.userID, { command: 'SET_STTS', queue: event.queue, display: event.display, config: event.config, shares: userShares, isAdmin: req.isAdmin, adminKey })
  sendRoom(req.eventID, 'admin', { command: 'UPDT_STTS', userList })
}
