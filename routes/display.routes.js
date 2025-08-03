const router = require('express').Router()

const { collection } = require('../api')
const { sendRoom } = require('../wss')
const { genRandom } = require('../utils/core.utils')
const joiSchema = require('../utils/joi.utils')


require('dotenv/config')

module.exports = router



router.post('/create', async (req, res) => {
  const { eventID, label, slide } = req.body

  const { error } = joiSchema.createDisplay.validate(req.body)
  if (error) return res.status(400).json({ success: false, error: error.details[0].message })

  try {
    const newDisplay = { id: genRandom(4, 10), label, slide: { name: slide.name, pageCount: slide.pageCount, page: 1 } }
    await collection('events').updateOne({ eventID }, { $push: { displays: newDisplay } })

    const event = await collection('events').findOne({ eventID })
    sendRoom(eventID, 'user', { command: 'UPDT_DISPS', displays: event.displays })
    res.json({ success: true, message: 'Display created', display: newDisplay })
  } catch (err) { res.status(500).json({ success: false, err: err }) }
})



router.post('/init', async (req, res) => {
  const { eventID, displayID } = req.body

  const { error } = joiSchema.updateDisplay.validate(req.body)
  if (error) return res.status(400).json({ success: false, error: error.details[0].message })

  try {
    const event = await collection('events').findOne({ eventID })
    const display = event.displays.filter(d => d.id === displayID)[0]

    res.json({ success: true, message: 'Display initiated', display })
  } catch (err) { res.status(500).json({ success: false, err: err }) }
})



router.delete('/close', async (req, res) => {
  const { eventID, displayID } = req.body

  const { error } = joiSchema.updateDisplay.validate(req.body)
  if (error) return res.status(400).json({ success: false, error: error.details[0].message })

  try {
    const event = await collection('events').findOne({ eventID })

    if (displayID === event.activeDisplay.id) {
      await collection('events').updateOne({ eventID }, { $set: { activeDisplay: { id: '', slide: {} } } })
      sendRoom(eventID, 'user', { command: 'SHARE_DISP', displayID, state: false, slide: {} })
    }

    const displays = event.displays.filter(d => d.id !== displayID)
    await collection('events').updateOne({ eventID }, { $set: { displays } })

    sendRoom(eventID, 'user', { command: 'UPDT_DISPS', displays })
    sendRoom(eventID, 'user', { command: 'CLOS_DISP', displayID })
    res.json({ success: true, message: 'Display closed' })
  } catch (err) { res.status(500).json({ success: false, err: err }) }
})