// controllers/otpController.js
// Sends and verifies OTP via EMAIL using Gmail.
// OTP is stored in the database against the user's record.

import Buyer            from '../models/Buyer.js'
import Seller           from '../models/Seller.js'
import { sendOTPEmail } from '../services/emailService.js'

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Get OTP expiry time (10 minutes from now)
function getOTPExpiry() {
  const mins = parseInt(process.env.OTP_EXPIRES_IN) || 10
  return new Date(Date.now() + mins * 60 * 1000)
}

// ── Send OTP ──────────────────────────────────────────
// POST /api/otp/send
// Body: { email, name, role }
export const sendOTP = async (req, res) => {
  try {
    const { email, name = 'User', role = 'buyer' } = req.body

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' })
    }

    const otp       = generateOTP()
    const expiresAt = getOTPExpiry()

    // Save OTP to user record if they exist
    const Model = role === 'seller' ? Seller : Buyer
    await Model.findOneAndUpdate(
        { email },
        { otp, otpExpiresAt: expiresAt },
        { upsert: false }
    )

    // Send OTP email
    await sendOTPEmail({ to: email, name, otp })

    res.status(200).json({
      success: true,
      message: `OTP sent to ${email}`,
    })
  } catch (error) {
    console.error('Send OTP error:', error)
    res.status(500).json({ success: false, message: 'Failed to send OTP. Please try again.' })
  }
}

// ── Send OTP During Signup (user doesn't exist yet) ───
// POST /api/otp/send-signup
// Body: { email, name }
// Stores OTP temporarily in memory for pre-signup verification
const signupOTPStore = new Map() // temporary in-memory store

export const sendSignupOTP = async (req, res) => {
  try {
    const { email, name = 'User' } = req.body

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' })
    }

    const otp       = generateOTP()
    const expiresAt = getOTPExpiry()

    // Store OTP in memory temporarily
    signupOTPStore.set(email, { otp, expiresAt, name })

    // Send OTP email
    await sendOTPEmail({ to: email, name, otp })

    res.status(200).json({
      success: true,
      message: `OTP sent to ${email}`,
    })
  } catch (error) {
    console.error('Send signup OTP error:', error)
    res.status(500).json({ success: false, message: 'Failed to send OTP. Please try again.' })
  }
}

// ── Verify OTP ────────────────────────────────────────
// POST /api/otp/verify
// Body: { email, otp, role }
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp, role = 'buyer' } = req.body

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' })
    }

    // First check in-memory store (for signup flow)
    if (signupOTPStore.has(email)) {
      const stored = signupOTPStore.get(email)

      if (stored.otp !== otp) {
        return res.status(400).json({ success: false, message: 'Invalid OTP' })
      }
      if (stored.expiresAt < new Date()) {
        signupOTPStore.delete(email)
        return res.status(400).json({ success: false, message: 'OTP expired. Please request a new one.' })
      }

      signupOTPStore.delete(email) // clear after use
      return res.status(200).json({ success: true, message: 'OTP verified successfully' })
    }

    // Otherwise check database (for login flow)
    const Model = role === 'seller' ? Seller : Buyer
    const user  = await Model.findOne({ email }).select('+otp +otpExpiresAt')

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' })
    }
    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP expired. Please request a new one.' })
    }

    // Clear OTP and mark verified
    user.isVerified   = true
    user.otp          = undefined
    user.otpExpiresAt = undefined
    await user.save()

    res.status(200).json({ success: true, message: 'OTP verified successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}