// models/Product.js
// Product schema for Marbvelous marketplace.
// Each product belongs to a seller.
// Supports multiple images, one video, discounts, delivery info.

import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
    {
        // ── Seller Reference ──
        seller: {
            type:     mongoose.Schema.Types.ObjectId,
            ref:      'Seller',
            required: true,
        },

        // ── Basic Info ──
        name: {
            type:     String,
            required: [true, 'Product name is required'],
            trim:     true,
        },
        description: {
            type:    String,
            default: '',
            trim:    true,
        },
        category: {
            type: String,
            enum: ['Tiles', 'Marbles', 'Faucets', 'Sinks', 'Plumbing Tools', 'Other'],
            required: [true, 'Category is required'],
        },

        // ── Pricing ──
        price: {
            type:     Number,
            required: [true, 'Price is required'],
            min:      0,
        },
        discount: {
            type:    Number, // percentage e.g. 20 means 20% off
            default: 0,
            min:     0,
            max:     100,
        },
        discountedPrice: {
            type:    Number,
            default: 0,
        },

        // ── Stock ──
        stock: {
            type:    Number,
            default: 0,
            min:     0,
        },

        // ── Delivery ──
        freeDelivery: {
            type:    Boolean,
            default: false,
        },
        deliveryCost: {
            type:    Number,
            default: 0,
            min:     0,
        },

        // ── Media ──
        images: [{ type: String }], // array of file paths
        video:  { type: String, default: '' }, // single video file path

        // ── Status ──
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
)

// Auto-calculate discounted price before saving
productSchema.pre('save', function (next) {
    if (this.discount > 0) {
        this.discountedPrice = Math.round(this.price - (this.price * this.discount / 100))
    } else {
        this.discountedPrice = this.price
    }
    next()
})

const Product = mongoose.model('Product', productSchema)
export default Product