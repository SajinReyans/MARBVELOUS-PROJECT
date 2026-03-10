// controllers/productController.js
// CRUD operations for seller products.

import Product from '../models/Product.js'
import Store   from '../models/Store.js'
import fs      from 'fs'

// ── Add Product ───────────────────────────────────────
// POST /api/products
export const addProduct = async (req, res) => {
    try {
        const {
            name, description, category,
            price, discount,
            stock,
            freeDelivery, deliveryCost,
        } = req.body

        // Get uploaded files
        const files    = req.files || {}
        const images   = files.images ? files.images.map(f => f.path) : []
        const videoArr = files.video  ? files.video                   : []
        const video    = videoArr.length > 0 ? videoArr[0].path : ''

        const product = await Product.create({
            seller:       req.user.id,
            name,
            description:  description  || '',
            category,
            price:        Number(price),
            discount:     Number(discount || 0),
            stock:        Number(stock || 0),
            freeDelivery: freeDelivery === 'true' || freeDelivery === true,
            deliveryCost: Number(deliveryCost || 0),
            images,
            video,
        })

        // Update store product count
        await Store.findOneAndUpdate(
            { seller: req.user.id },
            { $inc: { totalProducts: 1 } }
        )

        res.status(201).json({ success: true, product })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// ── Get My Products ───────────────────────────────────
// GET /api/products/my
export const getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({ seller: req.user.id }).sort({ createdAt: -1 })
        res.status(200).json({ success: true, products })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// ── Get Single Product ────────────────────────────────
// GET /api/products/:id
export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('seller', 'fullName email')
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
        res.status(200).json({ success: true, product })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// ── Update Product ────────────────────────────────────
// PUT /api/products/:id
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
        if (product.seller.toString() !== req.user.id)
            return res.status(403).json({ success: false, message: 'Not authorized' })

        const {
            name, description, category,
            price, discount, stock,
            freeDelivery, deliveryCost,
        } = req.body

        if (name)        product.name        = name
        if (description !== undefined) product.description = description
        if (category)    product.category    = category
        if (price)       product.price       = Number(price)
        if (discount !== undefined) product.discount = Number(discount)
        if (stock !== undefined)    product.stock    = Number(stock)
        if (freeDelivery !== undefined) product.freeDelivery = freeDelivery === 'true' || freeDelivery === true
        if (deliveryCost !== undefined) product.deliveryCost = Number(deliveryCost)

        // Handle new image uploads
        const files = req.files || {}
        if (files.images && files.images.length > 0) {
            product.images = [...product.images, ...files.images.map(f => f.path)]
        }
        if (files.video && files.video.length > 0) {
            product.video = files.video[0].path
        }

        await product.save()
        res.status(200).json({ success: true, product })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// ── Delete Product ────────────────────────────────────
// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
        if (product.seller.toString() !== req.user.id)
            return res.status(403).json({ success: false, message: 'Not authorized' })

        await product.deleteOne()

        // Update store product count
        await Store.findOneAndUpdate(
            { seller: req.user.id },
            { $inc: { totalProducts: -1 } }
        )

        res.status(200).json({ success: true, message: 'Product deleted' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// ── Delete Single Image from Product ─────────────────
// DELETE /api/products/:id/image
export const deleteProductImage = async (req, res) => {
    try {
        const { imagePath } = req.body
        const product = await Product.findById(req.params.id)
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
        if (product.seller.toString() !== req.user.id)
            return res.status(403).json({ success: false, message: 'Not authorized' })

        product.images = product.images.filter(img => img !== imagePath)
        await product.save()

        // Delete file from disk
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath)

        res.status(200).json({ success: true, product })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}