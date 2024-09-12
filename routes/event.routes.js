const router = require('express').Router()
const Datastore = require('@seald-io/nedb')

const { db, collection } = require('../api')
const { authUser } = require('../middlewares/user.middlewares')
const { genRandom } = require('../utils/core.utils')
const joiSchema = require('../utils/joi.utils')


require('dotenv/config')

module.exports = router



router.post('/create', authUser, async (req, res) => {
    const { name } = req.body

    const { error } = joiSchema.createEvent.validate(req.body)
    if (error) return res.status(400).json({ success: false, error: error.details[0].message })

    try {
        const eventID = genRandom(4, 10)

        const event = {
            eventID,
            name,
            presenter: { id: req.user.id },
            queue: [],
            quests: [],
            slides: [],
            activeSlide: {},
            shares: [{ body: '', urls: [{ link: '', icon: 'link-o', color: '#0A84FF' }], isShared: false }],
            roomActivity: { user: { id: '', name: '' }, activity: '' },
            display: { quest: 'Welcome to Event', author: '' },
            config: { forwarding: { is: false } }
        }

        await db.events.insertAsync(event)
        await collection('events').insertOne(event)
        await collection('users').updateOne({ _id: req.user._id }, { $push: { events: { eventID, name } } })

        db[`event-${eventID}`] = new Datastore()

        res.status(200).json({ success: true, event: { id: eventID, name } })
    } catch (err) { res.status(500).json({ success: false, err: err }) }
})



router.delete('/delete', authUser, async (req, res) => {
    const { eventID } = req.body

    try {
        const event = await collection('events').findOne({ eventID })
        if (!event) return res.status(404).json({ success: false, err: 'Event doesn\'t exist.' })

        if (event.presenter.id !== req.user.id) return res.status(403).json({ success: false, err: 'Access denied.' })

        await collection('events').deleteOne({ eventID })

        const user = await collection('users').findOne({ _id: req.user._id })
        const newEvents = user.events.filter((e) => e.eventID !== eventID)
        
        await collection('users').updateOne({ _id: req.user._id }, { $set: { events: newEvents } })

        res.status(200).json({ success: true, message: 'Event deleted successfully.' })
    } catch (err) { res.status(500).json({ success: false, err: err }) }
})