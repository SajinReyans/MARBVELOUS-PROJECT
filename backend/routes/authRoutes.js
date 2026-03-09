// routes/authRoutes.js
// All authentication endpoints for buyers and sellers.

import express from 'express'
import {
  buyerSignup,
  sellerSignup,
  buyerLogin,
  sellerLogin,
  getMe,
} from '../controllers/authController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

// ── Buyer ──
router.post('/buyer/signup', buyerSignup)
router.post('/buyer/login',  buyerLogin)

// ── Seller ──
router.post('/seller/signup', sellerSignup)
router.post('/seller/login',  sellerLogin)

// ── Current logged-in user (protected) ──
router.get('/me', protect, getMe)

export default router
