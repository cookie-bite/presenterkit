const router = require('express').Router()

const { db } = require('../api')
const { genRandom } = require('../utils/core.utils')
const joiSchema = require('../utils/joi.utils')


require('dotenv/config')

module.exports = router



router.post('/create', async (req, res) => {
    const { eventID, label, slide } = req.body

    const { error } = joiSchema.createDisplay.validate(req.body)
    if (error) return res.status(400).json({ success: false, error: error.details[0].message })

    try {
        const newDisplay = { id: genRandom(4, 10), label, slide }
        await db.events.updateAsync({ eventID }, { $push: { displays: newDisplay } })

        res.json({ success: true, message: 'Display created', display: newDisplay })
    } catch (err) { res.status(500).json({ success: false, err: err }) }
})