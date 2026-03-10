import dotenv from 'dotenv'
dotenv.config()

import express       from 'express'
import cors          from 'cors'
import path          from 'path'
import { fileURLToPath } from 'url'
import connectDB     from './config/db.js'
import authRoutes    from './routes/authRoutes.js'
import otpRoutes     from './routes/otpRoutes.js'
import productRoutes from './routes/productRoutes.js'
import storeRoutes   from './routes/storeRoutes.js'
import searchRoutes  from './routes/searchRoutes.js'
import cartRoutes    from './routes/cartRoutes.js'
import orderRoutes   from './routes/orderRoutes.js'
import errorHandler  from './middleware/errorMiddleware.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

connectDB()

const app  = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/api', (req, res) => res.json({ success: true, message: '🪨 Marbvelous API is running' }))
app.use('/api/auth',    authRoutes)
app.use('/api/otp',     otpRoutes)
app.use('/api/products', productRoutes)
app.use('/api/store',   storeRoutes)
app.use('/api/search',  searchRoutes)
app.use('/api/cart',    cartRoutes)
app.use('/api/orders',  orderRoutes)
app.use(errorHandler)

app.listen(PORT, () => console.log(`🚀 Marbvelous server running on http://localhost:${PORT}`))