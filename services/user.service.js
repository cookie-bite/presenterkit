const { ObjectId } = require('mongodb')
const jwt = require('jsonwebtoken')
const { genColor, genRandom } = require('../utils/core.utils')
const { collection } = require('../api')


exports.handleJoinRoom = async (req, ws, sendRoom) => {
  const { eventID, userID, displayID, token } = req
  ws.eventID = eventID
  ws.displayID = displayID

  let event = await collection('events').findOne({ eventID })

  let user = {
    eventID,
    userID: genRandom(8, 10),
    username: 'In lobby',
    color: genColor(),
    isActive: true,
    isInLobby: true,
    isPresenter: false,
    isAdmin: false,
    adminKey: ''
  }

  if (userID) {
    // Try to find the user in MongoDB eventUsers collection
    const eventUser = await collection('eventUsers').findOne({ eventID, userID })
    if (eventUser) {
      user = eventUser
      user.isActive = true
      await collection('eventUsers').updateOne(
        { eventID, userID },
        { $set: { isActive: true } }
      )
    } else {
      // If not found, create a new user document
      user.userID = userID
      await collection('eventUsers').insertOne(user)
    }
  } else {
    // If no userID provided, create a new user document
    await collection('eventUsers').insertOne(user)
  }

  try {
    const payload = jwt.verify(token, process.env.ACS_TKN_SCT)
    if (event.presenter.id === payload.sub) {
      const presenter = await collection('users').findOne({ _id: new ObjectId(payload.sub) })
      user.username = presenter.username
      user.color = presenter.color
      user.isInLobby = false
      user.isPresenter = true
      user.isAdmin = true
      user.adminKey = genRandom(16)
      await collection('eventUsers').updateOne(
        { eventID, userID },
        {
          $set: {
            username: user.username,
            color: user.color,
            isInLobby: false,
            isPresenter: true,
            isAdmin: true,
            adminKey: user.adminKey
          }
        }
      )
    }
  } catch (err) {
    // console.log(err)
  }

  ws.userID = user.userID
  ws.username = user.username
  ws.isAdmin = user.isAdmin

  // Get all users for this event
  const userList = await collection('eventUsers').find({ eventID }).toArray()
  const userShares = event.shares.filter(s => s.isShared)
  const roomActivity = { user: { id: user.userID, name: user.username }, activity: (user.isPresenter || !user.isInLobby) ? 'joined' : 'in lobby' }
  await collection('events').updateOne({ eventID }, { $set: { roomActivity } })

  ws.send(JSON.stringify({
    command: 'INIT_USER',
    user: { id: ws.userID, name: user.username, color: user.color, isPresenter: user.isPresenter, isInLobby: user.isInLobby },
    eventID,
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

  sendRoom(eventID, 'user', { command: 'ROOM_ACTY', roomActivity, userList })
  sendRoom(eventID, 'admin', { command: 'UPDT_STTS', userList })
}

exports.handleSetUser = async (req, ws, sendRoom) => {
  const { eventID, username, token } = req
  let event = await collection('events').findOne({ eventID })

  const user = await collection('eventUsers').findOne({ eventID, userID: ws.userID })
  console.log('[SET_USER] handleSetUser:', req)
  if (!user) return // Error handling for user

  await collection('eventUsers').updateOne({ eventID, userID: ws.userID }, { $set: { isInLobby: !user.isInLobby, username } })

  try {
    const payload = jwt.verify(token, process.env.ACS_TKN_SCT)
    if (event.presenter.id === payload.sub) {
      await collection('users').updateOne({ _id: new ObjectId(payload.sub) }, { $set: { username } })
    }
  } catch (err) {
    // Error handling for token verification
  }

  const userList = await collection('eventUsers').find({ eventID }).toArray()
  const roomActivity = { user: { id: ws.userID, name: username }, activity: req.roomActivity }
  await collection('events').updateOne({ eventID }, { $set: { roomActivity } })

  ws.username = username

  sendRoom(eventID, 'user', { command: 'ROOM_ACTY', roomActivity, userList })
  sendRoom(eventID, 'admin', { command: 'UPDT_STTS', userList })
}

exports.handleSetAdmin = async (req, wss, sendUser, sendRoom) => {
  const { eventID, userID, isAdmin } = req
  let userShares = []

  const event = await collection('events').findOne({ eventID })

  wss.clients.forEach((client) => {
    if (client.userID === userID) {
      if (isAdmin) {
        client.isAdmin = true
        userShares = event.shares
      } else {
        client.isAdmin = false
        userShares = event.shares.filter(s => s.isShared)
      }
    }
  })

  const adminKey = isAdmin ? genRandom(16) : ''
  await collection('eventUsers').updateOne({ eventID, userID }, { $set: { adminKey, isAdmin: isAdmin } })

  const userList = await collection('eventUsers').find({ eventID }).toArray()

  sendUser(eventID, userID, { command: 'SET_STTS', queue: event.queue, display: event.display, config: event.config, shares: userShares, isAdmin, adminKey })
  sendRoom(eventID, 'admin', { command: 'UPDT_STTS', userList })
}

exports.handleUserDisconnect = async (ws, sendRoom) => {
  const { eventID, userID, displayID, username } = ws
  console.log('[WS Close] eventID:', eventID)


  if (displayID) {
    const event = await collection('events').findOne({ eventID })

    if (displayID === event.activeDisplay.id) {
      await collection('events').updateOne({ eventID }, { $set: { activeDisplay: { id: '', slide: {} } } })
      sendRoom(eventID, 'user', { command: 'SHARE_DISP', displayID: displayID, state: false, slide: {} })
    }

    event.displays = event.displays.filter((d) => d.id !== displayID)
    await collection('events').updateOne({ eventID }, { $set: { displays: event.displays } })

    return sendRoom(eventID, 'user', { command: 'UPDT_DISPS', displays: event.displays })
  }

  const userList = await collection('eventUsers').find({ eventID }).toArray()

  if (userList.length > 0) {
    await collection('eventUsers').updateOne({ eventID, userID }, { $set: { isActive: false } })

    const activeUsers = await collection('eventUsers').find({ eventID, isActive: true }).toArray()
    const userList = await collection('eventUsers').find({ eventID }).toArray()

    const roomActivity = { user: { id: userID, name: username }, activity: 'left' }
    await collection('events').updateOne({ eventID }, { $set: { roomActivity } })


    if (activeUsers.length === 0) {
      const event = await collection('events').findOne({ eventID }, { projection: { _id: 0 } })
      event.activeDisplay = { id: '', slide: {} }
      event.displays = []
      await collection('events').replaceOne({ eventID }, event)
      await collection('eventUsers').deleteMany({ eventID })
    }


    sendRoom(eventID, 'user', { command: 'ROOM_ACTY', roomActivity, userList })
    sendRoom(eventID, 'admin', { command: 'UPDT_STTS', userList })
  }
}
