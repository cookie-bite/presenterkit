const jwt = require('jsonwebtoken')
const { ObjectId } = require('mongodb')

require('dotenv/config')



exports.authUser = (req, res, next) => {
    try {
        const payload = jwt.verify(req.headers.authorization.split(' ')[1], process.env.ACS_TKN_SCT)

        req.user = {}
        req.user.id = payload.sub
        req.user._id = new ObjectId(payload.sub)
        
        next()
    } catch (err) { res.status(401).json({ success: false, err: err }) }
}