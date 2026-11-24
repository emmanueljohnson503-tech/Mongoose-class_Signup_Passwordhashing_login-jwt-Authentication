const { BrevoClient } = require('@getbrevo/brevo')
// require('dotenv').config()

const client = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY
})

console.log(process.env.BREVO_API_KEY )

const sendEmail = async ( content ) => {
    try{
        console.log(content)
        const response = await client.transactionalEmails.sendTransacEmail({
            sender: {
                name: "Facebook Clone",
                email: process.env.EMAIL
            },
            to: [{
                name: content.name,
                email: content.email
            }],
            subject: content.subject,
            htmlContent: content.htmlContent
        })
        console.log('Email sent successfully: ', response.messageId)
    } catch (error) {
        console.log('Error sending email: ', error.message)
    }
}

module.exports = sendEmail