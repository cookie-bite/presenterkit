const { genRandom } = require('../utils/core.utils')
const { db } = require('../api')

const cooldown = 2 * 60 * 1000

exports.handleSendMessage = async (req, ws, sendRoom) => {
  console.log(`[${ws.username}-${ws.userID}] \x1b[33m${req.quest.label}\x1b[0m`)

  const event = await db.events.findOneAsync({ eventID: req.eventID })

  if (event.config.forwarding.is) {
    const newQueue = { id: genRandom(8), userID: ws.userID, author: ws.username, color: req.quest.color, label: req.quest.label }
    await db.events.updateAsync({ eventID: req.eventID }, { $push: { queue: newQueue } })

    sendRoom(req.eventID, 'admin', { command: 'SEND_MSG', quest: newQueue, user: { id: ws.userID, name: ws.username } })
  } else {
    const newQuest = { id: genRandom(8), userID: ws.userID, username: ws.username, color: req.quest.color, label: req.quest.label, effect: true }
    await db.events.updateAsync({ eventID: req.eventID }, { $push: { quests: newQuest } })

    sendRoom(req.eventID, 'user', { command: 'SEND_USERS', quest: newQuest, user: { id: ws.userID, name: ws.username } })
  }
}

exports.handleSendUsers = async (req, ws, sendRoom) => {
  console.log(`[${ws.username}-${ws.userID}] \x1b[33m${req.quest.label}\x1b[0m`)

  const event = await db.events.findOneAsync({ eventID: req.eventID })
  event.queue.splice(req.quest.index, 1)
  await db.events.updateAsync({ eventID: req.eventID }, { $set: { queue: event.queue } })

  const newQuest = { id: req.id, userID: ws.userID, username: ws.username, color: req.quest.color, label: req.quest.label, effect: true }
  await db.events.updateAsync({ eventID: req.eventID }, { $push: { quests: newQuest } })

  sendRoom(req.eventID, 'user', { command: 'SEND_USERS', quest: newQuest, user: { id: ws.userID, name: ws.username } })
  sendRoom(req.eventID, 'admin', { command: 'UPDT_QUE', queue: event.queue })
}

exports.handleCoolDownUser = async (req, sendUser, sendRoom) => {
  const event = await db.events.findOneAsync({ eventID: req.eventID })
  event.queue = event.queue.filter(msg => msg.userID !== req.userID)
  await db.events.updateAsync({ eventID: req.eventID }, { $set: { queue: event.queue } })

  sendUser(req.eventID, req.userID, { command: 'CLDW_USER', cooldown: Date.now() + cooldown })
  sendRoom(req.eventID, 'admin', { command: 'UPDT_QUE', queue: event.queue })
}

exports.handleSendTyping = async (req, ws, sendRoom) => {
  sendRoom(req.eventID, 'user', { command: 'SEND_TYP', isTyping: req.isTyping, color: req.color, userID: ws.userID, username: ws.username })
}

exports.handleShareAction = async (req, ws, sendRoom) => {
  await db.events.updateAsync({ eventID: req.eventID }, { $set: { shares: req.shares } })
  let userShares = req.shares.filter(s => s.isShared)

  if (req.action !== 'save') sendRoom(req.eventID, 'user', { command: 'SHR_ACT', action: req.action, userID: ws.userID, shares: userShares, activeShare: req?.activeShare })
  sendRoom(req.eventID, 'admin', { command: 'SHR_ACT', action: 'save', userID: ws.userID, shares: req.shares })
}
