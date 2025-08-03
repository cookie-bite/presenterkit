const { db } = require('../api')


exports.handleDisplayLabel = async (req, sendRoom) => {
  console.log(`Display quest: \x1b[33m[${req.display.author ? req.display.author : 'Author'}] ${req.display.quest}\x1b[0m`)

  await db.events.updateAsync({ eventID: req.eventID }, { $set: { display: req.display } })

  // if (req.display.author) quests[req.index].effect = false

  sendRoom(req.eventID, 'user', { command: 'DISP_LBL', display: req.display, index: req.index })
  sendRoom(req.eventID, 'admin', { command: 'DISP_LBL', display: req.display, index: req.index })
}

exports.handleSetConfig = async (req, sendRoom) => {
  if (req.config.name === 'forwarding') await db.events.updateAsync({ eventID: req.eventID }, { $set: { config: { forwarding: { is: req.config.is } } } })

  sendRoom(req.eventID, 'admin', { command: 'UPDT_CNFG', name: req.config.name, updateTo: { is: req.config.is } })
}
