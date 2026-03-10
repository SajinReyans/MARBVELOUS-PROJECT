// controllers/searchController.js
// Handles search for products and shops.
// Supports filtering by category, price range, discount, location.

import Product from '../models/Product.js'
import Store   from '../models/Store.js'

// ── Search Products ───────────────────────────────────
// GET /api/search/products?q=&category=&minPrice=&maxPrice=&minDiscount=&city=&lat=&lng=&radius=
export const searchProducts = async (req, res) => {
    try {
        const {
            q, category, minPrice, maxPrice,
            minDiscount, city, sort,
        } = req.query

        const filter = { isActive: true }

        // Text search
        if (q) filter.name = { $regex: q, $options: 'i' }

        // Category
        if (category && category !== 'All') filter.category = category

        // Price range
        if (minPrice || maxPrice) {
            filter.discountedPrice = {}
            if (minPrice) filter.discountedPrice.$gte = Number(minPrice)
            if (maxPrice) filter.discountedPrice.$lte = Number(maxPrice)
        }

        // Discount filter
        if (minDiscount) filter.discount = { $gte: Number(minDiscount) }

        let products = await Product.find(filter)
            .populate('seller', 'fullName email')
            .lean()

        // Filter by city if provided (match seller's store city)
        if (city) {
            const stores = await Store.find({
                'address.city': { $regex: city, $options: 'i' }
            }).select('seller')
            const sellerIds = stores.map(s => s.seller.toString())
            products = products.filter(p => sellerIds.includes(p.seller._id.toString()))
        }

        // Attach store info to each product
        const sellerIds = [...new Set(products.map(p => p.seller._id.toString()))]
        const stores    = await Store.find({ seller: { $in: sellerIds } }).lean()
        const storeMap  = {}
        stores.forEach(s => { storeMap[s.seller.toString()] = s })
        products = products.map(p => ({
            ...p,
            store: storeMap[p.seller._id.toString()] || null,
        }))

        // Sort
        if (sort === 'price_asc')     products.sort((a, b) => a.discountedPrice - b.discountedPrice)
        if (sort === 'price_desc')    products.sort((a, b) => b.discountedPrice - a.discountedPrice)
        if (sort === 'discount_desc') products.sort((a, b) => b.discount - a.discount)
        if (sort === 'newest')        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        res.status(200).json({ success: true, products })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// ── Search Shops ──────────────────────────────────────
// GET /api/search/shops?q=&city=&category=
export const searchShops = async (req, res) => {
    try {
        const { q, city, category } = req.query

        const filter = {}
        if (q)        filter.storeName   = { $regex: q,        $options: 'i' }
        if (city)     filter['address.city'] = { $regex: city, $options: 'i' }
        if (category && category !== 'All') filter.categories = category

        const stores = await Store.find(filter)
            .populate('seller', 'fullName email')
            .lean()

        // Attach product count
        const result = await Promise.all(stores.map(async store => {
            const productCount = await Product.countDocuments({ seller: store.seller._id, isActive: true })
            return { ...store, productCount }
        }))

        res.status(200).json({ success: true, shops: result })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// ── Get All Shops (for buyer dashboard) ──────────────
// GET /api/search/all-shops
export const getAllShops = async (req, res) => {
    try {
        const stores = await Store.find({ storeName: { $ne: '' } })
            .populate('seller', 'fullName email')
            .lean()

        const result = await Promise.all(stores.map(async store => {
            const products     = await Product.find({ seller: store.seller._id, isActive: true }).lean()
            return { ...store, products, productCount: products.length }
        }))

        res.status(200).json({ success: true, shops: result })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// ── Get All Products (for buyer dashboard) ────────────
// GET /api/search/all-products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ isActive: true })
            .populate('seller', 'fullName email')
            .sort({ createdAt: -1 })
            .lean()

        const sellerIds = [...new Set(products.map(p => p.seller._id.toString()))]
        const stores    = await Store.find({ seller: { $in: sellerIds } }).lean()
        const storeMap  = {}
        stores.forEach(s => { storeMap[s.seller.toString()] = s })

        const result = products.map(p => ({
            ...p,
            store: storeMap[p.seller._id.toString()] || null,
        }))

        res.status(200).json({ success: true, products: result })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}