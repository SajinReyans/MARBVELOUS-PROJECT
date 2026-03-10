// controllers/cartController.js
// Add, update, remove cart items. Get cart.

import Cart    from '../models/Cart.js'
import Product from '../models/Product.js'

// ── Get Cart ──────────────────────────────────────────
export const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ buyer: req.user.id })
            .populate({ path: 'items.product', select: 'name images discountedPrice price discount freeDelivery deliveryCost stock isActive seller' })
            .populate({ path: 'items.seller', select: 'fullName' })

        if (!cart) cart = await Cart.create({ buyer: req.user.id, items: [] })
        res.status(200).json({ success: true, cart })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// ── Add to Cart ───────────────────────────────────────
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body

        const product = await Product.findById(productId)
        if (!product || !product.isActive)
            return res.status(404).json({ success: false, message: 'Product not found' })
        if (product.stock < quantity)
            return res.status(400).json({ success: false, message: 'Not enough stock' })

        let cart = await Cart.findOne({ buyer: req.user.id })
        if (!cart) cart = new Cart({ buyer: req.user.id, items: [] })

        const existingIndex = cart.items.findIndex(
            i => i.product.toString() === productId
        )

        if (existingIndex > -1) {
            cart.items[existingIndex].quantity += Number(quantity)
        } else {
            cart.items.push({
                product:    productId,
                seller:     product.seller,
                quantity:   Number(quantity),
                priceAtAdd: product.discountedPrice,
            })
        }

        await cart.save()
        res.status(200).json({ success: true, message: 'Added to cart' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// ── Update Cart Item Quantity ─────────────────────────
export const updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body

        const cart = await Cart.findOne({ buyer: req.user.id })
        if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' })

        const item = cart.items.find(i => i.product.toString() === productId)
        if (!item) return res.status(404).json({ success: false, message: 'Item not in cart' })

        if (quantity <= 0) {
            cart.items = cart.items.filter(i => i.product.toString() !== productId)
        } else {
            item.quantity = quantity
        }

        await cart.save()
        res.status(200).json({ success: true, message: 'Cart updated' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// ── Remove from Cart ──────────────────────────────────
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params

        const cart = await Cart.findOne({ buyer: req.user.id })
        if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' })

        cart.items = cart.items.filter(i => i.product.toString() !== productId)
        await cart.save()
        res.status(200).json({ success: true, message: 'Item removed' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// ── Clear Cart ────────────────────────────────────────
export const clearCart = async (req, res) => {
    try {
        await Cart.findOneAndUpdate({ buyer: req.user.id }, { items: [] })
        res.status(200).json({ success: true, message: 'Cart cleared' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}