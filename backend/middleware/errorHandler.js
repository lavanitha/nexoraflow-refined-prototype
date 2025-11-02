// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(`[${req.id || 'unknown'}] Error:`, {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Default error response
  let error = {
    success: false,
    error: 'Internal server error',
    requestId: req.id || 'unknown'
  };

  // Handle specific error types
  if (err.name === 'ValidationError') {
    error.error = 'Validation failed';
    error.details = err.message;
    return res.status(400).json(error);
  }

  if (err.name === 'UnauthorizedError') {
    error.error = 'Unauthorized access';
    return res.status(401).json(error);
  }

  if (err.name === 'ForbiddenError') {
    error.error = 'Forbidden access';
    return res.status(403).json(error);
  }

  if (err.name === 'NotFoundError') {
    error.error = 'Resource not found';
    return res.status(404).json(error);
  }

  // Handle Gemini API errors (for future integration)
  if (err.name === 'GeminiAPIError') {
    error.error = 'AI service temporarily unavailable';
    error.message = 'Please try again later';
    return res.status(503).json(error);
  }

  // Include error message in development
  if (process.env.NODE_ENV === 'development') {
    error.message = err.message;
    error.stack = err.stack;
  }

  res.status(err.status || 500).json(error);
};

// 404 handler
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.url}`,
    requestId: req.id || 'unknown'
  });
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler
};