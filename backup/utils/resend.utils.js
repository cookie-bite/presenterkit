const { Resend } = require('resend')

require('dotenv/config')

const resend = new Resend(process.env.RESEND_API_KEY)


module.exports.mailSender = async (receiver, subject, text) => {
  const { data, error } = await resend.emails.send({
    from: 'PresenterKit <no-reply@email.presenterkit.app>',
    to: receiver,
    subject: subject || ' Password Reset',
    html: text || `Hello ${receiver},\n\n You are receiving this email because you (or someone else) have requested the reset of the password for your account.`,
  })

  if (error) {
    console.log('Email could not send:', error)
  }

  console.log('Email received successfully by:', data)
  return data
}