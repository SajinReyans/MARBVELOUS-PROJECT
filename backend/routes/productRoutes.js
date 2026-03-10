// routes/productRoutes.js

import express from 'express'
import {
    addProduct,
    getMyProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    deleteProductImage,
} from '../controllers/productController.js'
import protect                from '../middleware/authMiddleware.js'
import { uploadProductMedia } from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.post('/',              protect, uploadProductMedia, addProduct)
router.get('/my',             protect, getMyProducts)
router.get('/:id',            getProduct)
router.put('/:id',            protect, uploadProductMedia, updateProduct)
router.delete('/:id',         protect, deleteProduct)
router.delete('/:id/image',   protect, deleteProductImage)

export default router