// routes/otpRoutes.js
// OTP endpoints for sending and verifying email OTPs.

import express from 'express'
import { sendOTP, sendSignupOTP, verifyOTP } from '../controllers/otpController.js'

const router = express.Router()

router.post('/send',        sendOTP)       // for logged-in users
router.post('/send-signup', sendSignupOTP) // for new users during signup
router.post('/verify',      verifyOTP)     // verify OTP

export default router