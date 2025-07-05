const router = require('express').Router()

const { collection } = require('../api')
const { authUser } = require('../middlewares/user.middlewares')

require('dotenv/config')

module.exports = router



router.get('/data', authUser, async (req, res) => {
  try {
    const user = await collection('users').findOne({ _id: req.user._id }, { projection: { _id: 0 } })
    res.status(200).json({ success: true, user })
  } catch (err) { res.status(500).json({ success: false, err: err }) }
})