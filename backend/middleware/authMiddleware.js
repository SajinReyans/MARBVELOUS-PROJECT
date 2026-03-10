// middleware/authMiddleware.js
// Protects routes by verifying JWT.
// Uses the role stored IN the token to look up the correct collection.
// Exposes req.user.id as a plain string so all controllers work correctly.

import jwt    from 'jsonwebtoken'
import Buyer  from '../models/Buyer.js'
import Seller from '../models/Seller.js'

const protect = async (req, res, next) => {
  try {
    // ── Get token ──────────────────────────────────────
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' })
    }

    const token = authHeader.split(' ')[1]

    // ── Verify and decode ──────────────────────────────
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // decoded = { id: '...', role: 'seller' | 'buyer', iat, exp }

    // ── Look up correct collection using role ──────────
    let user = null

    if (decoded.role === 'seller') {
      user = await Seller.findById(decoded.id).select('-password')
    } else {
      user = await Buyer.findById(decoded.id).select('-password')
    }

    // Fallback: try other collection if role was missing from old tokens
    if (!user) {
      user = await Buyer.findById(decoded.id).select('-password')
      if (!user) user = await Seller.findById(decoded.id).select('-password')
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' })
    }

    // ── Attach to request ──────────────────────────────
    // IMPORTANT: expose .id as a plain string
    // Mongoose documents have ._id (ObjectId) but controllers use req.user.id
    req.user    = user
    req.user.id = user._id.toString()

    next()
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' })
  }
}

export default protect