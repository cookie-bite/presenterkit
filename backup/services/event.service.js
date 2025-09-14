const { collection } = require('../api')


exports.handleDisplayLabel = async (req, sendRoom) => {
  const { eventID, display, index } = req
  console.log(`Display quest: \x1b[33m[${display.author ? display.author : 'Author'}] ${display.quest}\x1b[0m`)

  await collection('events').updateOne(
    { eventID },
    { $set: { display } }
  )

  // if (req.display.author) quests[req.index].effect = false

  sendRoom(eventID, 'user', { command: 'DISP_LBL', display, index })
  sendRoom(eventID, 'admin', { command: 'DISP_LBL', display, index })
}

exports.handleSetConfig = async (req, sendRoom) => {
  const { eventID, config } = req

  if (config.name === 'forwarding') await collection('events').updateOne({ eventID }, { $set: { config: { forwarding: { is: config.is } } } })

  sendRoom(eventID, 'admin', { command: 'UPDT_CNFG', name: config.name, updateTo: { is: config.is } })
}
