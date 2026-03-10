// models/Store.js
// Store profile for each seller.
// One store per seller — stores name, logo, description,
// contact details, address and location.

import mongoose from 'mongoose'

const storeSchema = new mongoose.Schema(
    {
        // ── Seller Reference (one store per seller) ──
        seller: {
            type:     mongoose.Schema.Types.ObjectId,
            ref:      'Seller',
            required: true,
            unique:   true,
        },

        // ── Store Identity ──
        storeName: {
            type:    String,
            default: '',
            trim:    true,
        },
        tagline: {
            type:    String,
            default: '',
            trim:    true,
        },
        description: {
            type:    String,
            default: '',
            trim:    true,
        },
        logo: {
            type:    String, // file path
            default: '',
        },

        // ── Contact Details ──
        contactEmail: { type: String, default: '' },
        contactPhone: { type: String, default: '' },
        whatsapp:     { type: String, default: '' },
        website:      { type: String, default: '' },

        // ── Shop Address ──
        address: {
            street:   { type: String, default: '' },
            city:     { type: String, default: '' },
            state:    { type: String, default: '' },
            pincode:  { type: String, default: '' },
            country:  { type: String, default: 'India' },
            landmark: { type: String, default: '' },
        },

        // ── Location (for map display) ──
        location: {
            lat: { type: Number, default: null },
            lng: { type: Number, default: null },
        },

        // ── Categories sold ──
        categories: {
            type:    [String],
            enum:    ['Tiles', 'Marbles', 'Faucets', 'Sinks', 'Plumbing Tools', 'Other'],
            default: [],
        },

        // ── Public profile slug (for sharing) ──
        // e.g. /store/test-marble-store
        slug: {
            type:   String,
            unique: true,
            sparse: true,
        },

        // ── Stats (updated automatically) ──
        totalProducts: { type: Number, default: 0 },
    },
    { timestamps: true }
)

// Auto-generate slug from storeName
storeSchema.pre('save', function (next) {
    if (this.isModified('storeName') && this.storeName) {
        this.slug = this.storeName
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-') + '-' + this.seller.toString().slice(-4)
    }
    next()
})

const Store = mongoose.model('Store', storeSchema)
export default Store