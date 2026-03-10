// testCreateSeller.js
// Run this file to create a test seller account in the database.
// Uses the actual Seller model so login works correctly.
// Usage: node testCreateSeller.js
// Login: email: testseller@marbvelous.com / password: test123456

import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import Seller   from './models/Seller.js'

// ── Connect to MongoDB ────────────────────────────────
await mongoose.connect(process.env.MONGO_URI)
console.log('✅ Connected to MongoDB')

try {
    // Delete existing test seller if any so we start fresh
    await Seller.deleteOne({ email: 'testseller@marbvelous.com' })
    console.log('🗑️  Cleared any existing test seller')

    // Create using the real Seller model
    // Password will be auto-hashed by the pre-save hook in Seller.js
    const seller = await Seller.create({
        fullName:     'Test Seller',
        mobile:       '9000000001',
        email:        'testseller@marbvelous.com',
        password:     'test123456',
        businessName: 'Test Tiles Co.',
        businessType: 'Proprietorship',
        pan:          'ABCDE1234F',
        aadhaar:      '123456789012',
        gst:          '22AAAAA0000A1Z5',
        storeName:    'Test Marble Store',
        categories:   ['Tiles', 'Marbles'],
        accountStatus:'pending',
        role:         'seller',
        isVerified:   true,
    })

    console.log('✅ Test seller created! ID:', seller._id)
    console.log('\n──────────────────────────────────────')
    console.log('  LOGIN CREDENTIALS')
    console.log('──────────────────────────────────────')
    console.log('  Role     : Seller')
    console.log('  Email    : testseller@marbvelous.com')
    console.log('  Password : test123456')
    console.log('  Status   : pending (under review)')
    console.log('──────────────────────────────────────\n')

} catch (err) {
    console.error('❌ Error creating seller:', err.message)
}

await mongoose.disconnect()
console.log('🔌 Disconnected from MongoDB')