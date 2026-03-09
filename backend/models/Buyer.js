// models/Buyer.js
// MongoDB schema for Customer (Buyer) accounts.
// Covers all fields from Phase 1 buyer signup form.

import mongoose from 'mongoose'
import bcrypt   from 'bcryptjs'

const addressSchema = new mongoose.Schema({
  fullAddress: { type: String, default: '' },
  houseNo:     { type: String, default: '' },
  street:      { type: String, default: '' },
  city:        { type: String, default: '' },
  state:       { type: String, default: '' },
  pincode:     { type: String, default: '' },
  country:     { type: String, default: 'India' },
  landmark:    { type: String, default: '' },
})

const paymentSchema = new mongoose.Schema({
  debitCard:   { type: String, default: '' },
  creditCard:  { type: String, default: '' },
  cardHolder:  { type: String, default: '' },
  expiry:      { type: String, default: '' },
  upiId:       { type: String, default: '' },
  // NOTE: CVV is never stored — PCI compliance
})

const buyerSchema = new mongoose.Schema(
  {
    // ── Account ──
    fullName: {
      type:     String,
      required: [true, 'Full name is required'],
      trim:     true,
    },
    mobile: {
      type:     String,
      required: [true, 'Mobile number is required'],
      unique:   true,
      trim:     true,
    },
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
    },
    password: {
      type:     String,
      required: [true, 'Password is required'],
      minlength: 6,
      select:   false, // never return password in queries
    },

    // ── OTP ──
    otp:          { type: String,  select: false },
    otpExpiresAt: { type: Date,    select: false },
    isVerified:   { type: Boolean, default: false },

    // ── Profile ──
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say', ''],
      default: '',
    },
    dob: { type: Date, default: null },

    // ── Address ──
    address: { type: addressSchema, default: () => ({}) },

    // ── Payment (optional, encrypted in production) ──
    payment: { type: paymentSchema, default: () => ({}) },

    // ── Role ──
    role: { type: String, default: 'buyer' },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
)

// Hash password before saving
buyerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Method to compare entered password with hashed password
buyerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const Buyer = mongoose.model('Buyer', buyerSchema)
export default Buyer
