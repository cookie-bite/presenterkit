const { genRandom } = require('../utils/core.utils')
const { collection } = require('../api')

const cooldown = 2 * 60 * 1000

exports.handleSendMessage = async (req, ws, sendRoom) => {
  const { eventID, quest } = req
  console.log(`[${ws.username}-${ws.userID}] \x1b[33m${quest.label}\x1b[0m`)

  const event = await collection('events').findOne({ eventID })

  if (event.config.forwarding.is) {
    const newQueue = { id: genRandom(8), userID: ws.userID, author: ws.username, color: quest.color, label: quest.label }
    await collection('events').updateOne({ eventID }, { $push: { queue: newQueue } })

    sendRoom(eventID, 'admin', { command: 'SEND_MSG', quest: newQueue, user: { id: ws.userID, name: ws.username } })
  } else {
    const newQuest = { id: genRandom(8), userID: ws.userID, username: ws.username, color: quest.color, label: quest.label, effect: true }
    await collection('events').updateOne({ eventID }, { $push: { quests: newQuest } })

    sendRoom(eventID, 'user', { command: 'SEND_USERS', quest: newQuest, user: { id: ws.userID, name: ws.username } })
  }
}

exports.handleSendUsers = async (req, ws, sendRoom) => {
  const { eventID, quest } = req
  console.log(`[${ws.username}-${ws.userID}] \x1b[33m${quest.label}\x1b[0m`)

  const event = await collection('events').findOne({ eventID })
  event.queue.splice(quest.index, 1)
  await collection('events').updateOne({ eventID }, { $set: { queue: event.queue } })

  const newQuest = { id: req.id, userID: ws.userID, username: ws.username, color: quest.color, label: quest.label, effect: true }
  await collection('events').updateOne({ eventID }, { $push: { quests: newQuest } })

  sendRoom(req.eventID, 'user', { command: 'SEND_USERS', quest: newQuest, user: { id: ws.userID, name: ws.username } })
  sendRoom(req.eventID, 'admin', { command: 'UPDT_QUE', queue: event.queue })
}

exports.handleCoolDownUser = async (req, sendUser, sendRoom) => {
  const { eventID, userID } = req

  const event = await collection('events').findOne({ eventID })
  event.queue = event.queue.filter(msg => msg.userID !== userID)
  await collection('events').updateOne({ eventID }, { $set: { queue: event.queue } })

  sendUser(eventID, userID, { command: 'CLDW_USER', cooldown: Date.now() + cooldown })
  sendRoom(eventID, 'admin', { command: 'UPDT_QUE', queue: event.queue })
}

exports.handleSendTyping = async (req, ws, sendRoom) => {
  sendRoom(req.eventID, 'user', { command: 'SEND_TYP', isTyping: req.isTyping, color: req.color, userID: ws.userID, username: ws.username })
}

exports.handleShareAction = async (req, ws, sendRoom) => {
  const { eventID, shares, action } = req

  await collection('events').updateOne({ eventID }, { $set: { shares } })
  let userShares = shares.filter(s => s.isShared)

  if (action !== 'save') sendRoom(eventID, 'user', { command: 'SHR_ACT', action, userID: ws.userID, shares: userShares, activeShare: req?.activeShare })
  sendRoom(eventID, 'admin', { command: 'SHR_ACT', action: 'save', userID: ws.userID, shares })
}
