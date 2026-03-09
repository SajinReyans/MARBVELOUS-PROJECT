// services/otpService.js
// Send and verify OTP via the backend API.
// Used by OtpInput component and signup/login pages.

import api from './api.js'

// ── Send OTP ──────────────────────────────────────────
// Sends an OTP to the given mobile number.
export async function sendOTP(mobile, role = 'buyer') {
  try {
    const { data } = await api.post('/otp/send', { mobile, role })
    return { success: true, message: data.message }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to send OTP' }
  }
}

// ── Verify OTP ────────────────────────────────────────
// Verifies the OTP entered by the user.
export async function verifyOTP(mobile, otp, role = 'buyer') {
  try {
    const { data } = await api.post('/otp/verify', { mobile, otp, role })
    return { success: true, message: data.message }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Invalid OTP' }
  }
}
