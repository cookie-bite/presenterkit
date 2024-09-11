const router = require('express').Router()
const Datastore = require('@seald-io/nedb')
const jwt = require('jsonwebtoken')

const { db } = require('../api')
const { genRandom } = require('../utils/core.utils')

const joiSchema = require('../utils/joi.utils')

require('dotenv/config')



router.post('/create', async (req, res) => {
    const { name } = req.body

    const { error } = joiSchema.createEvent.validate(req.body)
    console.log(error)
    if (error) return res.status(400).json({ success: false, error: error.details[0].message })

    try {
        const payload = jwt.verify(req.headers.authorization.split(' ')[1], process.env.ACS_TKN_SCT)
        const eventID = genRandom(4, 10)

        await db.events.insertAsync({
            eventID,
            name: name,
            presenter: { id: payload.sub },
            queue: [],
            quests: [],
            slides: [],
            activeSlide: {},
            shares: [{ body: '', urls: [{ link: '', icon: 'link-o', color: '#0A84FF' }], isShared: false }],
            roomActivity: { user: { id: '', name: '' }, activity: '' },
            display: { quest: 'Welcome to Event', author: '' },
            config: { forwarding: { is: false } }
        })

        db[`event-${eventID}`] = new Datastore()

        res.status(200).json({ success: true, event: { id: eventID, name } })
    } catch (err) { console.log(err); res.status(502).json({ success: false, err: err }) }
})



module.exports = router