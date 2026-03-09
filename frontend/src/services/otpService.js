// services/otpService.js
// Send and verify OTP via the backend API.

import api from './api.js'

// ── Send OTP during signup (user doesn't exist yet) ───
export async function sendOTP(email, name = 'User', role = 'buyer') {
  try {
    const { data } = await api.post('/otp/send-signup', { email, name, role })
    return { success: true, message: data.message }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to send OTP' }
  }
}

// ── Send OTP for logged-in users ──────────────────────
export async function sendOTPLoggedIn(email, role = 'buyer') {
  try {
    const { data } = await api.post('/otp/send', { email, role })
    return { success: true, message: data.message }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to send OTP' }
  }
}

// ── Verify OTP ────────────────────────────────────────
export async function verifyOTP(email, otp, role = 'buyer') {
  try {
    const { data } = await api.post('/otp/verify', { email, otp, role })
    return { success: true, message: data.message }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Invalid OTP' }
  }
}