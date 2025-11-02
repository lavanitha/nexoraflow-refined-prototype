/**
 * Simple in-memory rate limiter per IP
 */
class RateLimiter {
  constructor(windowMs, maxRequests) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.requests = new Map(); // ip -> { count, resetTime }
  }

  middleware() {
    return (req, res, next) => {
      if (req.path === '/api/compare/health') {
        return next(); // Skip for health checks
      }

      const ip = req.ip || req.connection.remoteAddress || 'unknown';
      const now = Date.now();
      const record = this.requests.get(ip);

      // Clean expired records
      if (record && now > record.resetTime) {
        this.requests.delete(ip);
      }

      // Check or initialize
      if (!this.requests.has(ip)) {
        this.requests.set(ip, { count: 1, resetTime: now + this.windowMs });
        return next();
      }

      const current = this.requests.get(ip);
      if (current.count >= this.maxRequests) {
        return res.status(429).json({
          success: false,
          message: 'Too many requests from this IP, please try again later.',
          retryAfter: Math.ceil((current.resetTime - now) / 1000),
        });
      }

      current.count++;
      next();
    };
  }

  getStats() {
    let totalRequests = 0;
    let uniqueIPs = 0;
    for (const [ip, record] of this.requests.entries()) {
      if (Date.now() <= record.resetTime) {
        totalRequests += record.count;
        uniqueIPs++;
      }
    }
    return { totalRequests, uniqueIPs };
  }
}

// Default: 30 requests per hour per IP
const defaultLimiter = new RateLimiter(60 * 60 * 1000, process.env.RATE_LIMIT_PER_HOUR || 30);

module.exports = { RateLimiter, defaultLimiter };

