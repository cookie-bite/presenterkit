const Joi = require('joi')


// Auth

exports.signupInitiate = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(), // Joi.string().pattern(new RegExp(/^(((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])))(?=.{8,15})/)).message({ 'string.pattern.base': 'Password is not valid' }),
  color: Joi.string().required()
})

exports.signupConfirm = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required() // Joi.string().pattern(/^\d{6}$/).message('OTP must be a 6-digit code').required()
})


exports.signin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(), // Joi.string().pattern(new RegExp(/^(((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])))(?=.{8,15})/)).message({ 'string.pattern.base': 'Password is not valid' }),
})


exports.forgotEmail = Joi.object({
  email: Joi.string().email().required()
})


exports.forgotPass = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(), // Joi.string().pattern(new RegExp(/^(((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])))(?=.{8,15})/)).message({ 'string.pattern.base': 'Password is not valid' }),
  confirmationToken: Joi.string().required()
})


exports.confirm = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().pattern(new RegExp(/^(\d\s*){6}$/)).message({ 'string.pattern.base': 'Code is not valid' })
})



// Event

exports.createEvent = Joi.object({
  name: Joi.string().required()
})

exports.verifyEvent = Joi.object({
  eventID: Joi.number().integer().required()
})



// Display

exports.createDisplay = Joi.object({
  eventID: Joi.number().integer().required(),
  label: Joi.string().required()
}).options({ allowUnknown: true })

exports.updateDisplay = Joi.object({
  eventID: Joi.number().integer().required(),
  displayID: Joi.number().integer()
})