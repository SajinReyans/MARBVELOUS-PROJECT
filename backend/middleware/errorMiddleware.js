// middleware/errorMiddleware.js
// Global error handler — catches all errors thrown in controllers.
// Must be the LAST middleware added in server.js.

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message    = err.message || 'Internal Server Error'

  // Mongoose: bad ObjectId (e.g. invalid MongoDB ID format)
  if (err.name === 'CastError') {
    statusCode = 404
    message    = 'Resource not found'
  }

  // Mongoose: duplicate key (e.g. email already exists)
  if (err.code === 11000) {
    statusCode = 400
    const field = Object.keys(err.keyValue)[0]
    message    = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
  }

  // Mongoose: validation error
  if (err.name === 'ValidationError') {
    statusCode = 400
    message    = Object.values(err.errors).map(e => e.message).join(', ')
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError')  { statusCode = 401; message = 'Invalid token' }
  if (err.name === 'TokenExpiredError')  { statusCode = 401; message = 'Token expired. Please login again.' }

  res.status(statusCode).json({
    success: false,
    message,
    // Only show stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

export default errorHandler
