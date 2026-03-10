// routes/storeRoutes.js

import express from 'express'
import {
    getMyStore,
    updateMyStore,
    getPublicStore,
} from '../controllers/storeController.js'
import protect              from '../middleware/authMiddleware.js'
import { uploadStoreLogo }  from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.get('/my',      protect, getMyStore)
router.put('/my',      protect, uploadStoreLogo, updateMyStore)
router.get('/:slug',   getPublicStore) // public

export default router