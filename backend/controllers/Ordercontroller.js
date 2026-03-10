// controllers/orderController.js
// Place orders, manage order status (seller), track orders (buyer).
// Stock reduces on order placement. Revenue updates on payment received.

import Order   from '../models/Order.js'
import Cart    from '../models/Cart.js'
import Product from '../models/Product.js'
import Store   from '../models/Store.js'

// ── Place Order ───────────────────────────────────────
// POST /api/orders
export const placeOrder = async (req, res) => {
    try {
        const { deliveryAddress, paymentMethod, items } = req.body
        // items: [{ productId, quantity }]

        if (!items || items.length === 0)
            return res.status(400).json({ success: false, message: 'No items in order' })

        // Group items by seller
        const sellerMap = {}
        for (const item of items) {
            const product = await Product.findById(item.productId)
            if (!product || !product.isActive)
                return res.status(400).json({ success: false, message: `Product not found: ${item.productId}` })
            if (product.stock < item.quantity)
                return res.status(400).json({ success: false, message: `Not enough stock for: ${product.name}` })

            const sid = product.seller.toString()
            if (!sellerMap[sid]) sellerMap[sid] = { seller: sid, items: [], deliveryCost: 0 }
            sellerMap[sid].items.push({ product, quantity: item.quantity })

            // Use max delivery cost per seller (if any item has paid delivery)
            if (!product.freeDelivery) {
                sellerMap[sid].deliveryCost = Math.max(sellerMap[sid].deliveryCost, product.deliveryCost)
            }
        }

        const createdOrders = []

        for (const sid of Object.keys(sellerMap)) {
            const group  = sellerMap[sid]
            let subtotal = 0
            const orderItems = []

            for (const { product, quantity } of group.items) {
                subtotal += product.discountedPrice * quantity
                orderItems.push({
                    product:  product._id,
                    name:     product.name,
                    image:    product.images?.[0] || '',
                    quantity,
                    price:    product.discountedPrice,
                })

                // Reduce stock immediately
                product.stock -= quantity
                await product.save()
            }

            const order = await Order.create({
                buyer:           req.user.id,
                seller:          sid,
                items:           orderItems,
                subtotal,
                deliveryCost:    group.deliveryCost,
                totalAmount:     subtotal + group.deliveryCost,
                deliveryAddress,
                paymentMethod,
                paymentStatus:   paymentMethod === 'online' ? 'paid' : 'pending',
                paidAt:          paymentMethod === 'online' ? new Date() : null,
                revenueCredited: paymentMethod === 'online',
                status:          'placed',
            })

            // If online payment — credit revenue to store immediately
            if (paymentMethod === 'online') {
                await creditRevenue(sid, subtotal + group.deliveryCost)
            }

            createdOrders.push(order)
        }

        // Clear those items from cart
        const productIds = items.map(i => i.productId)
        const cart = await Cart.findOne({ buyer: req.user.id })
        if (cart) {
            cart.items = cart.items.filter(i => !productIds.includes(i.product.toString()))
            await cart.save()
        }

        res.status(201).json({ success: true, orders: createdOrders })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// ── Get Buyer Orders ──────────────────────────────────
// GET /api/orders/my
export const getBuyerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user.id })
            .populate('seller', 'fullName email')
            .sort({ createdAt: -1 })
        res.status(200).json({ success: true, orders })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// ── Get Seller Orders ─────────────────────────────────
// GET /api/orders/seller
export const getSellerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ seller: req.user.id })
            .populate('buyer', 'fullName email mobile')
            .sort({ createdAt: -1 })
        res.status(200).json({ success: true, orders })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// ── Update Order Status (Seller) ──────────────────────
// PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body
        const validStatuses = ['placed', 'processing', 'packing', 'on_the_way', 'delivered', 'cancelled']
        if (!validStatuses.includes(status))
            return res.status(400).json({ success: false, message: 'Invalid status' })

        const order = await Order.findById(req.params.id)
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' })
        if (order.seller.toString() !== req.user.id)
            return res.status(403).json({ success: false, message: 'Not authorized' })

        const prev = order.status
        order.status = status

        // If COD and delivered → credit revenue
        if (
            order.paymentMethod === 'cod' &&
            status === 'delivered' &&
            !order.revenueCredited
        ) {
            order.paymentStatus   = 'paid'
            order.paidAt          = new Date()
            order.revenueCredited = true
            await creditRevenue(req.user.id, order.totalAmount)
        }

        // If cancelled and stock was reduced → restore stock
        if (status === 'cancelled' && prev !== 'cancelled') {
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } })
            }
        }

        await order.save()
        res.status(200).json({ success: true, order })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// ── Cancel Order (Buyer) ──────────────────────────────
// POST /api/orders/:id/cancel
// Buyer can cancel only when status is 'placed' or 'processing'
// Once seller sets 'packing' — order is locked and cannot be cancelled
export const cancelOrderByBuyer = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
        if (!order)
            return res.status(404).json({ success: false, message: 'Order not found' })

        // Only the buyer who placed this order can cancel it
        if (order.buyer.toString() !== req.user.id)
            return res.status(403).json({ success: false, message: 'Not authorized' })

        // Already cancelled or delivered
        if (order.status === 'cancelled')
            return res.status(400).json({ success: false, message: 'Order is already cancelled' })
        if (order.status === 'delivered')
            return res.status(400).json({ success: false, message: 'Delivered orders cannot be cancelled' })

        // LOCKED statuses — seller has started packing or dispatched
        const lockedStatuses = ['packing', 'on_the_way']
        if (lockedStatuses.includes(order.status))
            return res.status(400).json({
                success: false,
                message: 'Order cannot be cancelled — seller has already started packing your order',
            })

        // Allowed to cancel: 'placed' or 'processing'
        order.status = 'cancelled'
        await order.save()

        // Restore stock for each item
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } })
        }

        res.status(200).json({ success: true, message: 'Order cancelled successfully', order })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// ── Get Seller Revenue (current month) ───────────────
// GET /api/orders/revenue
export const getSellerRevenue = async (req, res) => {
    try {
        const now   = new Date()
        const month = now.getMonth() + 1
        const year  = now.getFullYear()

        const orders = await Order.find({
            seller:          req.user.id,
            revenueCredited: true,
            revenueMonth:    month,
            revenueYear:     year,
        })

        const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0)
        const total   = await Order.countDocuments({ seller: req.user.id, status: { $ne: 'cancelled' } })

        res.status(200).json({ success: true, revenue, totalOrders: total, month, year })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// ── Internal: Credit Revenue to Store ────────────────
async function creditRevenue(sellerId, amount) {
    // Store revenue is calculated live from orders — no need to store separately
    // This function is a hook for future use (e.g. notifications)
}