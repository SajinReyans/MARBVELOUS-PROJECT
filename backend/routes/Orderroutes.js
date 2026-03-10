// routes/orderRoutes.js
import express from 'express'
import { placeOrder, getBuyerOrders, getSellerOrders, updateOrderStatus, getSellerRevenue, cancelOrderByBuyer } from '../controllers/orderController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()
router.post('/',              protect, placeOrder)
router.get('/my',             protect, getBuyerOrders)
router.get('/seller',         protect, getSellerOrders)
router.get('/revenue',        protect, getSellerRevenue)
router.put('/:id/status',     protect, updateOrderStatus)
router.post('/:id/cancel',    protect, cancelOrderByBuyer)
export default router