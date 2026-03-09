import dotenv from 'dotenv'
dotenv.config()

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

console.log('API Key:', process.env.RESEND_API_KEY)

const result = await resend.emails.send({
    from:    'onboarding@resend.dev',
    to:      'sajin2917@gmail.com',
    subject: 'Marbvelous Test',
    html:    '<h1>Test email working!</h1>',
})

console.log('Result:', result)