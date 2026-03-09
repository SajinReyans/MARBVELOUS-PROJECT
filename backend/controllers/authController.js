// controllers/authController.js
// Handles signup and login for Buyers and Sellers.
// Sends welcome emails after successful signup.

import jwt    from 'jsonwebtoken'
import Buyer  from '../models/Buyer.js'
import Seller from '../models/Seller.js'
import { sendBuyerWelcomeEmail, sendSellerWelcomeEmail } from '../services/emailService.js'

// ── Generate JWT Token ────────────────────────────────
function generateToken(id, role) {
  return jwt.sign(
      { id, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

function sendTokenResponse(user, statusCode, res) {
  const token = generateToken(user._id, user.role)
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id:       user._id,
      fullName: user.fullName,
      email:    user.email,
      mobile:   user.mobile,
      role:     user.role,
    },
  })
}

// ── BUYER SIGNUP ──────────────────────────────────────
// POST /api/auth/buyer/signup
export const buyerSignup = async (req, res) => {
  try {
    const { fullName, mobile, email, password, gender, dob, address, payment } = req.body

    // Check if buyer already exists
    const existing = await Buyer.findOne({ $or: [{ email }, { mobile }] })
    if (existing) {
      return res.status(400).json({
        success: false,
        message: existing.email === email ? 'Email already registered' : 'Mobile number already registered',
      })
    }

    // Create buyer
    const buyer = await Buyer.create({
      fullName, mobile, email, password,
      gender:  gender || '',
      dob:     dob    || null,
      address: address || {},
      payment: {
        debitCard:  payment?.debitCard  || '',
        creditCard: payment?.creditCard || '',
        cardHolder: payment?.cardHolder || '',
        expiry:     payment?.expiry     || '',
        upiId:      payment?.upi        || '',
      },
    })

    // Send welcome email (don't block response if it fails)
    sendBuyerWelcomeEmail({ to: email, name: fullName }).catch(err =>
        console.error('Welcome email failed:', err.message)
    )

    sendTokenResponse(buyer, 201, res)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ── SELLER SIGNUP ─────────────────────────────────────
// POST /api/auth/seller/signup
export const sellerSignup = async (req, res) => {
  try {
    const {
      fullName, mobile, email, password,
      businessName, businessType, businessAddress,
      pan, aadhaar, gst, bank,
      storeName, categories,
    } = req.body

    const existing = await Seller.findOne({ $or: [{ email }, { mobile }] })
    if (existing) {
      return res.status(400).json({
        success: false,
        message: existing.email === email ? 'Email already registered' : 'Mobile number already registered',
      })
    }

    const seller = await Seller.create({
      fullName, mobile, email, password,
      businessName:    businessName    || '',
      businessType:    businessType    || '',
      businessAddress: businessAddress || {},
      pan:     pan     || '',
      aadhaar: aadhaar || '',
      gst:     gst     || '',
      bank:    bank    || {},
      storeName:     storeName  || '',
      categories:    categories || [],
      accountStatus: 'pending',
    })

    // Send welcome email
    sendSellerWelcomeEmail({
      to:        email,
      name:      fullName,
      storeName: storeName || 'Your Store',
    }).catch(err => console.error('Welcome email failed:', err.message))

    sendTokenResponse(seller, 201, res)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ── BUYER LOGIN ───────────────────────────────────────
// POST /api/auth/buyer/login
export const buyerLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email/mobile and password' })
    }

    const buyer = await Buyer.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    }).select('+password')

    if (!buyer || !(await buyer.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    sendTokenResponse(buyer, 200, res)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ── SELLER LOGIN ──────────────────────────────────────
// POST /api/auth/seller/login
export const sellerLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email/mobile and password' })
    }

    const seller = await Seller.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    }).select('+password')

    if (!seller || !(await seller.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    if (seller.accountStatus === 'rejected') {
      return res.status(403).json({ success: false, message: 'Your seller account has been rejected. Please contact support.' })
    }

    sendTokenResponse(seller, 200, res)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ── GET CURRENT USER ──────────────────────────────────
// GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const Model = req.user.role === 'seller' ? Seller : Buyer
    const user  = await Model.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.status(200).json({ success: true, user })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}