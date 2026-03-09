// services/authService.js
// All authentication API calls — signup, login, get current user.
// Used by LoginPage, BuyerSignupPage, SellerSignupPage.

import api from './api.js'

// ── Save user session to localStorage ────────────────
function saveSession(token, user) {
  localStorage.setItem('marbvelous_token', token)
  localStorage.setItem('marbvelous_user',  JSON.stringify(user))
}

// ── Clear session (logout) ────────────────────────────
export function logout() {
  localStorage.removeItem('marbvelous_token')
  localStorage.removeItem('marbvelous_user')
}

// ── Get current logged-in user from localStorage ──────
export function getCurrentUser() {
  const user = localStorage.getItem('marbvelous_user')
  return user ? JSON.parse(user) : null
}

// ── Check if user is logged in ────────────────────────
export function isLoggedIn() {
  return !!localStorage.getItem('marbvelous_token')
}

// ── Buyer Signup ──────────────────────────────────────
export async function buyerSignup(formData) {
  try {
    const { data } = await api.post('/auth/buyer/signup', {
      fullName: formData.fullName,
      mobile:   formData.mobile,
      email:    formData.email,
      password: formData.password,
      gender:   formData.gender,
      dob:      formData.dob,
      address: {
        fullAddress: formData.fullAddress,
        houseNo:     formData.houseNo,
        street:      formData.street,
        city:        formData.city,
        state:       formData.state,
        pincode:     formData.pincode,
        country:     formData.country,
        landmark:    formData.landmark,
      },
      payment: {
        debitCard:  formData.debitCard,
        creditCard: formData.creditCard,
        cardHolder: formData.cardHolder,
        expiry:     formData.expiry,
        upi:        formData.upi,
      },
    })
    saveSession(data.token, data.user)
    return { success: true, user: data.user }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Signup failed' }
  }
}

// ── Seller Signup ─────────────────────────────────────
export async function sellerSignup(formData) {
  try {
    const { data } = await api.post('/auth/seller/signup', {
      fullName: formData.fullName,
      mobile:   formData.mobile,
      email:    formData.email,
      password: formData.password,
      businessName:    formData.businessName,
      businessType:    formData.businessType,
      businessAddress: {
        shopAddress: formData.shopAddress,
        city:        formData.bizCity,
        state:       formData.bizState,
        pincode:     formData.bizPincode,
        country:     formData.bizCountry,
      },
      pan:     formData.pan,
      aadhaar: formData.aadhaar,
      gst:     formData.gst,
      bank: {
        accountHolder: formData.accountHolder,
        bankName:      formData.bankName,
        accountNumber: formData.accountNumber,
        ifsc:          formData.ifsc,
        accountType:   formData.accountType,
      },
      storeName:  formData.storeName,
      categories: formData.categories,
    })
    saveSession(data.token, data.user)
    return { success: true, user: data.user }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Signup failed' }
  }
}

// ── Buyer Login ───────────────────────────────────────
export async function buyerLogin(identifier, password) {
  try {
    const { data } = await api.post('/auth/buyer/login', { identifier, password })
    saveSession(data.token, data.user)
    return { success: true, user: data.user }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Login failed' }
  }
}

// ── Seller Login ──────────────────────────────────────
export async function sellerLogin(identifier, password) {
  try {
    const { data } = await api.post('/auth/seller/login', { identifier, password })
    saveSession(data.token, data.user)
    return { success: true, user: data.user }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Login failed' }
  }
}

// ── Get Current User from Backend ────────────────────
export async function getMe() {
  try {
    const { data } = await api.get('/auth/me')
    return { success: true, user: data.user }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to fetch user' }
  }
}
