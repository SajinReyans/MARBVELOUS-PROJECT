// models/Order.js
// Order schema — created when buyer places an order.
// Each order belongs to one seller (orders are per-seller).
// Tracks status, payment, and delivery details.

import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
    product:    { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name:       { type: String, required: true },
    image:      { type: String, default: '' },
    quantity:   { type: Number, required: true, min: 1 },
    price:      { type: Number, required: true }, // price at time of order
})

const orderSchema = new mongoose.Schema(
    {
        // ── Parties ──
        buyer: {
            type:     mongoose.Schema.Types.ObjectId,
            ref:      'Buyer',
            required: true,
        },
        seller: {
            type:     mongoose.Schema.Types.ObjectId,
            ref:      'Seller',
            required: true,
        },

        // ── Items ──
        items: [orderItemSchema],

        // ── Pricing ──
        subtotal:      { type: Number, required: true },
        deliveryCost:  { type: Number, default: 0 },
        totalAmount:   { type: Number, required: true },

        // ── Delivery Address ──
        deliveryAddress: {
            fullName:  { type: String, default: '' },
            phone:     { type: String, default: '' },
            street:    { type: String, default: '' },
            city:      { type: String, default: '' },
            state:     { type: String, default: '' },
            pincode:   { type: String, default: '' },
            country:   { type: String, default: 'India' },
        },

        // ── Payment ──
        paymentMethod: {
            type: String,
            enum: ['cod', 'online'],
            required: true,
        },
        paymentStatus: {
            type:    String,
            enum:    ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending',
        },
        paidAt: { type: Date, default: null },

        // ── Order Status ──
        // Seller manages this status
        status: {
            type:    String,
            enum:    ['placed', 'processing', 'packing', 'on_the_way', 'delivered', 'cancelled'],
            default: 'placed',
        },

        // ── Revenue credited flag ──
        // Set to true once payment is received (COD on delivery, online on payment)
        revenueCredited: { type: Boolean, default: false },

        // ── Month/Year for revenue reset ──
        revenueMonth: { type: Number }, // 1-12
        revenueYear:  { type: Number },
    },
    { timestamps: true }
)

// Set revenue month/year on creation
orderSchema.pre('save', function (next) {
    if (this.isNew) {
        const now = new Date()
        this.revenueMonth = now.getMonth() + 1
        this.revenueYear  = now.getFullYear()
    }
    next()
})

const Order = mongoose.model('Order', orderSchema)
export default Order