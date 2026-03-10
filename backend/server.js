import dotenv from 'dotenv'
dotenv.config()

import express      from 'express'
import cors         from 'cors'
import path         from 'path'
import { fileURLToPath } from 'url'
import connectDB    from './config/db.js'
import authRoutes   from './routes/authRoutes.js'
import otpRoutes    from './routes/otpRoutes.js'
import productRoutes from './routes/productRoutes.js'
import storeRoutes  from './routes/storeRoutes.js'
import errorHandler from './middleware/errorMiddleware.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

connectDB()

const app  = express()
const PORT = process.env.PORT || 5000

// ── Middleware ────────────────────────────────────────
app.use(cors({
    origin:      process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── Serve uploaded files as static ───────────────────
// Images and videos will be accessible via URL like:
// http://localhost:5000/uploads/products/filename.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ── Routes ────────────────────────────────────────────
app.get('/api', (req, res) => {
    res.json({ success: true, message: '🪨 Marbvelous API is running' })
})

app.use('/api/auth',     authRoutes)
app.use('/api/otp',      otpRoutes)
app.use('/api/products', productRoutes)
app.use('/api/store',    storeRoutes)

// ── Global Error Handler ──────────────────────────────
app.use(errorHandler)

// ── Start Server ──────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Marbvelous server running on http://localhost:${PORT}`)
})