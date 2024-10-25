const Joi = require('joi')


// Auth

exports.signup = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(), // Joi.string().pattern(new RegExp(/^(((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])))(?=.{8,15})/)).message({ 'string.pattern.base': 'Password is not valid' }),
    color: Joi.string().required()
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

exports.initDisplay = Joi.object({
    eventID: Joi.number().integer().required(),
    displayID: Joi.number().integer()
})