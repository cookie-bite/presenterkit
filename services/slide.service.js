const { db } = require('../api')


exports.handleUpdateSlides = async (req, sendRoom) => {
  await db.events.updateAsync({ eventID: req.eventID }, { $set: { slides: req.slides } })

  sendRoom(req.eventID, 'user', { command: 'UPDT_SLDS', slides: req.slides })
}