const router = require('express').Router()
const Datastore = require('@seald-io/nedb')
const jwt = require('jsonwebtoken')

const { collection, db } = require('../api')
const { authUser } = require('../middlewares/user.middlewares')
const { genRandom } = require('../utils/core.utils')
const joiSchema = require('../utils/joi.utils')


require('dotenv/config')

module.exports = router



router.post('/verify', async (req, res) => {
    const { eventID } = req.body

    const { error } = joiSchema.verifyEvent.validate(req.body)
    if (error) return res.status(400).json({ success: false, error: error.details[0].message })

    try {
        const dbEvent = await collection('events').findOne({ eventID }, { projection: { _id: 0 } })
        if (!dbEvent) return res.status(404).json({ success: false, status: { code: 'NONEXIST', title: 'Event is not exist', subtitle: 'Either link is incorrect or event deleted' }, err: 'Event does not exist.' })

        let event = await db.events.findOneAsync({ eventID })

        if (!event) {
            try {
                const payload = jwt.verify(req.headers.authorization.split(' ')[1], process.env.ACS_TKN_SCT)
                
                if (dbEvent.presenter.id === payload.sub) {
                    await db.events.insertAsync(dbEvent)
                    db[`event-${eventID}`] = new Datastore()
                } else {
                    return res.status(403).json({ success: false, status: { code: 'UNOPENED', title: 'Event is not started', subtitle: 'You can join after event start' }, err: 'Event is not open.' })
                }
            } catch (err) {
                return res.status(403).json({ success: false, status: { code: 'UNOPENED', title: 'Event is not started', subtitle: 'You can join after event start' }, err: 'Event is not open.' })
            }
        }


        res.status(200).json({ success: true, status: { code: 'OPEN' }, event })
    } catch (err) { res.status(500).json({ success: false, err: err }) }
})



router.post('/create', authUser, async (req, res) => {
    const { name } = req.body

    const { error } = joiSchema.createEvent.validate(req.body)
    if (error) return res.status(400).json({ success: false, error: error.details[0].message })

    try {
        const eventID = genRandom(4, 10)

        const event = {
            eventID,
            name,
            presenter: { id: req.user.id }, // color and username
            queue: [],
            quests: [],
            displays: [],
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