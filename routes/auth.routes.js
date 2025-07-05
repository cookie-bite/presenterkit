const router = require('express').Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const joiSchema = require('../utils/joi.utils')
const { mailSender } = require('../utils/resend.utils')
const { collection } = require('../api')
const { ObjectId } = require('mongodb')

require('dotenv/config')

module.exports = router



const genAcsToken = (payload) => { return jwt.sign(payload, process.env.ACS_TKN_SCT, { expiresIn: process.env.ACS_TKN_EXP }) }
const genRfsToken = (payload) => { return jwt.sign(payload, process.env.RFS_TKN_SCT, { expiresIn: process.env.RFS_TKN_EXP }) }



router.post('/signup/initiate', async (req, res) => {
  const { username, email, password, color } = req.body

  const { error } = joiSchema.signupInitiate.validate(req.body)
  if (error) return res.status(400).json({ success: false, error: 'Invalid credentials' })

  const user = await collection('users').findOne({ email })
  if (user) return res.status(400).json({ success: false, error: 'This email is already registered' })

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const hash = await argon2.hash(password + process.env.PEPPER, { type: argon2.argon2id, memoryCost: 15360, timeCost: 2 })
    await collection('pending_users').updateOne({ email }, { $set: { username, email, password: hash, color, otp, createdAt: new Date() }}, { upsert: true })
    await mailSender(email, 'Your Confirmation Code', `Your confirmation code is ${otp}`)
    res.status(200).json({ success: true, info: 'Confirmation code sent to your email.' })
  } catch (err) { res.status(500).json({ success: false, err: err }) }
})



router.post('/signup/confirm', async (req, res) => {
  const { email, otp } = req.body

  const { error } = joiSchema.signupConfirm.validate(req.body)
  if (error) return res.status(400).json({ success: false, error: 'Invalid credentials' })

  const pending = await collection('pending_users').findOne({ email, otp })
  if (!pending) return res.status(400).json({ success: false, error: 'Invalid confirmation code or email' })

  const user = await collection('users').findOne({ email })
  if (user) return res.status(400).json({ success: false, error: 'This email is already registered' })

  try {
    const newUser = await collection('users').insertOne({ username: pending.username, email: pending.email, password: pending.password, color: pending.color, refreshToken: [], events: [] })
    await collection('pending_users').deleteOne({ email })
    const accessToken = genAcsToken({ sub: newUser.insertedId })
    const refreshToken = genRfsToken({ sub: newUser.insertedId })
    await collection('users').updateOne({ _id: newUser.insertedId }, { $push: { refreshToken } })
    res.status(200).json({ success: true, accessToken, refreshToken })
  } catch (err) { res.status(500).json({ success: false, err: err }) }
})



router.post('/signin', async (req, res) => {
    const { email, password } = req.body
    const { error } = joiSchema.signin.validate(req.body)
    if (error) return res.status(400).json({ success: false, error: 'Invalid email or password' })

    const user = await collection('users').findOne({ email })
    if (!user) return res.status(400).json({ success: false, error: 'Invalid email or password' })

    const isMatch = await argon2.verify(user.password, password + process.env.PEPPER)
    if (!isMatch) return res.status(400).json({ success: false, error: 'Invalid email or password' })

    try {
        const accessToken = genAcsToken({ sub: user._id })
        const refreshToken = genRfsToken({ sub: user._id })
        collection('users').updateOne({ _id: user._id }, { $push: { refreshToken } })
        res.json({ success: true, accessToken, refreshToken })
    } catch (err) { res.status(500).json({ success: false }) }
})



router.post('/forgot/email', async (req, res) => {
    const { error } = joiSchema.forgotEmail.validate(req.body)
    if (error) return res.status(400).json({ success: false, error: error.details[0].message })

    const user = await collection('users').findOne({ email: req.body.email })
    if (!user) return res.status(400).json({ success: false, error: 'User not found' })

    try {
        const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString()
        collection('users').updateOne({ email: req.body.email }, { $set: { 'confirmation.code': confirmationCode } })
        await mailSender(req.body.email, 'Confirmation Code', `Your confirmation code is ${confirmationCode}`)
        res.json({ success: true, info: 'Confirmation code has been sent to your email.' })
    } catch (err) { return res.status(401).json({ success: false }) }
})



router.post('/forgot/password', async (req, res) => {
    const { error } = joiSchema.forgotPass.validate(req.body)
    if (error) return res.status(400).json({ success: false, error: error.details[0].message })

    const user = await collection('users').findOne({ email })
    if (!user) return res.status(400).json({ success: false, error: 'User not found' })

    const validPass = await argon2.verify(user.password, req.body.password + process.env.PEPPER)
    if (validPass) return res.status(400).json({ success: false, error: 'New password should be different from old one' })

    if (user.confirmation.token !== req.body.confirmationToken) return res.status(400).json({ error: 'Confirmation token is incorrect' })

    try {
        const hash = await argon2.hash(req.body.password + process.env.PEPPER, { type: argon2.argon2id, memoryCost: 15360, timeCost: 2 })
        collection('users').findOne({ email: req.body.email }, { $set: { password: hash, confirmation: {} } })
        res.json({ success: true, info: 'Password has been changed successfully.' })
    } catch (err) { return res.status(500).json({ success: false }) }
})



router.post('/confirmation', async (req, res) => {
    const { error } = joiSchema.confirm.validate(req.body)
    if (error) return res.status(400).json({ success: false, error: error.details[0].message })

    const user = await collection('users').findOne({ email: req.body.email })
    if (!user) return res.status(400).json({ success: false, error: 'User not found' })

    const confCode = req.body.code.replace(/\s/g, '')
    if (user.confirmation.code !== confCode) return res.status(409).json({ success: false, error: 'Code is incorrect' })

    try {
        const confirmationToken = crypto.randomBytes(8).toString('hex')
        collection('users').findOne({ email: req.body.email }, { $set: { confirmation: { token: confirmationToken } } })
        res.json({ success: true, confirmationToken, info: 'Email has been confirmed successfully.' })
    } catch (err) { return res.status(500).json({ success: false }) }
})



router.post('/refresh', async (req, res) => {
    const refreshToken = req.body.token
    if (!refreshToken) return res.status(401).json({ success: false, error: 'Refresh token required' })

    try {
        const payload = jwt.verify(refreshToken, process.env.RFS_TKN_SCT)
        const accessToken = genAcsToken({ sub: payload.sub })
        res.json({ success: true, accessToken })
    } catch (err) { return res.status(401).json({ success: false }) }
})



router.delete('/signout', async (req, res) => {
    const refreshToken = req.body.token
    if (!refreshToken) return res.status(401).json({ success: false, error: 'Refresh token required' })

    try {
        const payload = jwt.verify(refreshToken, process.env.RFS_TKN_SCT)
        const user = await collection('users').findOne({ _id: new ObjectId(payload.sub) })
        if (!user.refreshToken.includes(refreshToken)) return res.status(400).json({ success: false, error: 'Invalid refresh token' })
        const refreshTokens = user.refreshToken.filter(token => token !== refreshToken)
        collection('users').updateOne({ _id: user._id }, { $set: { refreshToken: refreshTokens } })
        res.json({ success: true })
    } catch (err) { return res.status(401).json({ success: false }) }
})