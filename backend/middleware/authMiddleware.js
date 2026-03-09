// middleware/authMiddleware.js
// Protects routes by verifying the JWT token in the request header.
// Usage: add `protect` as middleware to any route that needs login.
// Example: router.get('/profile', protect, getProfile)

import jwt    from 'jsonwebtoken'
import Buyer  from '../models/Buyer.js'
import Seller from '../models/Seller.js'

const protect = async (req, res, next) => {
  let token

  // Check for token in Authorization header: "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized. Please login.' })
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach user to request
    const Model   = decoded.role === 'seller' ? Seller : Buyer
    req.user      = await Model.findById(decoded.id)

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' })
    }

    next()
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token. Please login again.' })
  }
}

export default protect
