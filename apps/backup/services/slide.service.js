const { collection } = require('../api')


exports.handleUpdateSlides = async (req, sendRoom) => {
  const { eventID, slides } = req

  await collection('events').updateOne({ eventID }, { $set: { slides } })

  sendRoom(eventID, 'user', { command: 'UPDT_SLDS', slides })
}