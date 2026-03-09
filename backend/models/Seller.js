// models/Seller.js
// MongoDB schema for Seller accounts.
// Covers all fields from Phase 1 seller signup form.

import mongoose from 'mongoose'
import bcrypt   from 'bcryptjs'

const businessAddressSchema = new mongoose.Schema({
  shopAddress: { type: String, default: '' },
  city:        { type: String, default: '' },
  state:       { type: String, default: '' },
  pincode:     { type: String, default: '' },
  country:     { type: String, default: 'India' },
})

const bankSchema = new mongoose.Schema({
  accountHolder: { type: String, default: '' },
  bankName:      { type: String, default: '' },
  accountNumber: { type: String, default: '' },
  ifsc:          { type: String, default: '' },
  accountType:   {
    type:    String,
    enum:    ['Savings', 'Current', ''],
    default: '',
  },
})

const sellerSchema = new mongoose.Schema(
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
      type:      String,
      required:  [true, 'Password is required'],
      minlength: 6,
      select:    false,
    },

    // ── OTP ──
    otp:          { type: String,  select: false },
    otpExpiresAt: { type: Date,    select: false },
    isVerified:   { type: Boolean, default: false },

    // ── Business Details ──
    businessName: { type: String, default: '' },
    businessType: {
      type:    String,
      enum:    ['Individual', 'Proprietorship', 'Partnership', 'LLP', 'Private Limited Company', ''],
      default: '',
    },
    businessAddress: { type: businessAddressSchema, default: () => ({}) },

    // ── Identity / KYC ──
    pan:          { type: String, default: '' },
    aadhaar:      { type: String, default: '', select: false }, // sensitive
    gst:          { type: String, default: '' },

    // Document upload paths (stored after file upload)
    gstCertPath:    { type: String, default: '' },
    addressProofPath: { type: String, default: '' },
    bizRegCertPath: { type: String, default: '' },

    // ── Bank Details ──
    bank: { type: bankSchema, default: () => ({}) },

    // ── Store Details ──
    storeName:  { type: String, default: '' },
    categories: {
      type:    [String],
      enum:    ['Tiles', 'Marbles', 'Faucets', 'Sinks', 'Plumbing Tools'],
      default: [],
    },

    // ── Status ──
    role:           { type: String, default: 'seller' },
    accountStatus:  {
      type:    String,
      enum:    ['pending', 'approved', 'rejected'],
      default: 'pending', // admin reviews seller accounts
    },
  },
  { timestamps: true }
)

// Hash password before saving
sellerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Method to compare passwords
sellerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const Seller = mongoose.model('Seller', sellerSchema)
export default Seller
