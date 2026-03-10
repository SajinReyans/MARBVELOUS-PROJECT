// routes/cartRoutes.js
import express from 'express'
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()
router.get('/',              protect, getCart)
router.post('/add',          protect, addToCart)
router.put('/update',        protect, updateCartItem)
router.delete('/item/:productId', protect, removeFromCart)
router.delete('/clear',      protect, clearCart)
export default router