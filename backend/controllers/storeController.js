// controllers/storeController.js
// Manages seller store profile — create, update, get.
// Public endpoint for buyers to view a store.

import Store   from '../models/Store.js'
import Product from '../models/Product.js'
import fs      from 'fs'

// ── Get My Store ──────────────────────────────────────
// GET /api/store/my
export const getMyStore = async (req, res) => {
    try {
        let store = await Store.findOne({ seller: req.user.id })

        // Auto-create empty store if doesn't exist yet
        if (!store) {
            store = await Store.create({ seller: req.user.id })
        }

        res.status(200).json({ success: true, store })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// ── Update My Store ───────────────────────────────────
// PUT /api/store/my
export const updateMyStore = async (req, res) => {
    try {
        const {
            storeName, tagline, description,
            contactEmail, contactPhone, whatsapp, website,
            street, city, state, pincode, country, landmark,
            lat, lng,
            categories,
        } = req.body

        let store = await Store.findOne({ seller: req.user.id })
        if (!store) store = new Store({ seller: req.user.id })

        // Update fields
        if (storeName    !== undefined) store.storeName    = storeName
        if (tagline      !== undefined) store.tagline      = tagline
        if (description  !== undefined) store.description  = description
        if (contactEmail !== undefined) store.contactEmail = contactEmail
        if (contactPhone !== undefined) store.contactPhone = contactPhone
        if (whatsapp     !== undefined) store.whatsapp     = whatsapp
        if (website      !== undefined) store.website      = website

        // Address
        if (street   !== undefined) store.address.street   = street
        if (city     !== undefined) store.address.city     = city
        if (state    !== undefined) store.address.state    = state
        if (pincode  !== undefined) store.address.pincode  = pincode
        if (country  !== undefined) store.address.country  = country
        if (landmark !== undefined) store.address.landmark = landmark

        // Location
        if (lat !== undefined) store.location.lat = Number(lat)
        if (lng !== undefined) store.location.lng = Number(lng)

        // Categories
        if (categories) {
            store.categories = typeof categories === 'string'
                ? JSON.parse(categories)
                : categories
        }

        // Logo upload
        if (req.file) {
            // Delete old logo if exists
            if (store.logo && fs.existsSync(store.logo)) fs.unlinkSync(store.logo)
            store.logo = req.file.path
        }

        await store.save()
        res.status(200).json({ success: true, store })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// ── Get Public Store by Slug ──────────────────────────
// GET /api/store/:slug  (public — buyers can view)
export const getPublicStore = async (req, res) => {
    try {
        const store = await Store.findOne({ slug: req.params.slug })
            .populate('seller', 'fullName email')

        if (!store) return res.status(404).json({ success: false, message: 'Store not found' })

        // Get store products
        const products = await Product.find({ seller: store.seller._id, isActive: true })
            .sort({ createdAt: -1 })

        res.status(200).json({ success: true, store, products })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}