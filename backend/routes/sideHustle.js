const express = require('express');
const router = express.Router();
const { generateIdeasHandler } = require('../controllers/sideHustleController');
const { RateLimiter } = require('../utils/rateLimiter');

// Create a more restrictive rate limiter for side hustle generation (30 req/min)
const sideHustleLimiter = new RateLimiter(60 * 1000, 30);

// Main endpoint with rate limiting
router.post('/', sideHustleLimiter.middleware(), generateIdeasHandler);

module.exports = router;

