// services/authService.js
// All authentication API calls — signup, login, get current user.
// Seller signup uses FormData to support file uploads.

import api from './api.js'

// ── Save user session ─────────────────────────────────
function saveSession(token, user) {
  localStorage.setItem('marbvelous_token', token)
  localStorage.setItem('marbvelous_user',  JSON.stringify(user))
}

export function logout() {
  localStorage.removeItem('marbvelous_token')
  localStorage.removeItem('marbvelous_user')
}

export function getCurrentUser() {
  const user = localStorage.getItem('marbvelous_user')
  return user ? JSON.parse(user) : null
}

export function isLoggedIn() {
  return !!localStorage.getItem('marbvelous_token')
}

// Returns the redirect path based on role
export function getRedirectPath(role) {
  return role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard'
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
        // CVV never sent to backend
      },
    })
    saveSession(data.token, data.user)
    return { success: true, user: data.user, role: data.user.role }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Signup failed' }
  }
}

// ── Seller Signup (uses FormData for file uploads) ────
export async function sellerSignup(formData) {
  try {
    const fd = new FormData()

    fd.append('fullName',     formData.fullName)
    fd.append('mobile',       formData.mobile)
    fd.append('email',        formData.email)
    fd.append('password',     formData.password)
    fd.append('businessName', formData.businessName)
    fd.append('businessType', formData.businessType)
    fd.append('pan',          formData.pan)
    fd.append('aadhaar',      formData.aadhaar)
    fd.append('gst',          formData.gst)
    fd.append('storeName',    formData.storeName)

    fd.append('businessAddress', JSON.stringify({
      shopAddress: formData.shopAddress,
      city:        formData.bizCity,
      state:       formData.bizState,
      pincode:     formData.bizPincode,
      country:     formData.bizCountry,
    }))
    fd.append('bank', JSON.stringify({
      accountHolder: formData.accountHolder,
      bankName:      formData.bankName,
      accountNumber: formData.accountNumber,
      ifsc:          formData.ifsc,
      accountType:   formData.accountType,
    }))
    fd.append('categories', JSON.stringify(formData.categories))

    if (formData.gstCert)      fd.append('gstCert',      formData.gstCert)
    if (formData.addressProof) fd.append('addressProof', formData.addressProof)
    if (formData.bizRegCert)   fd.append('bizRegCert',   formData.bizRegCert)

    const { data } = await api.post('/auth/seller/signup', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    saveSession(data.token, data.user)
    return { success: true, user: data.user, role: data.user.role }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Signup failed' }
  }
}

// ── Buyer Login ───────────────────────────────────────
export async function buyerLogin(identifier, password) {
  try {
    const { data } = await api.post('/auth/buyer/login', { identifier, password })
    saveSession(data.token, data.user)
    return { success: true, user: data.user, role: data.user.role }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Login failed' }
  }
}

// ── Seller Login ──────────────────────────────────────
export async function sellerLogin(identifier, password) {
  try {
    const { data } = await api.post('/auth/seller/login', { identifier, password })
    saveSession(data.token, data.user)
    return { success: true, user: data.user, role: data.user.role }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Login failed' }
  }
}

// ── Get Current User ──────────────────────────────────
export async function getMe() {
  try {
    const { data } = await api.get('/auth/me')
    return { success: true, user: data.user }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to fetch user' }
  }
}