// routes/searchRoutes.js
import express from 'express'
import { searchProducts, searchShops, getAllShops, getAllProducts } from '../controllers/searchController.js'

const router = express.Router()
router.get('/products',     searchProducts)
router.get('/shops',        searchShops)
router.get('/all-shops',    getAllShops)
router.get('/all-products', getAllProducts)
export default router