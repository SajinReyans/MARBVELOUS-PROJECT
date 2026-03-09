import dotenv from 'dotenv'
dotenv.config() // ← must be first, before everything else

import express      from 'express'
import cors         from 'cors'
import connectDB    from './config/db.js'
import authRoutes   from './routes/authRoutes.js'
import otpRoutes    from './routes/otpRoutes.js'
import errorHandler from './middleware/errorMiddleware.js'

// Connect to MongoDB
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

// ── Routes ────────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({ success: true, message: '🪨 Marbvelous API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/otp',  otpRoutes)

// ── Global Error Handler ──────────────────────────────
app.use(errorHandler)

// ── Start Server ──────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Marbvelous server running on http://localhost:${PORT}`)
})