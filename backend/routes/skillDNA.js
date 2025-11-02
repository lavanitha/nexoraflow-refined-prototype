const express = require('express');
const router = express.Router();
const { getProfileHandler, simulateHandler, embeddingsHandler } = require('../controllers/skillDNAController');
const { RateLimiter } = require('../utils/rateLimiter');

// Create rate limiter for skill DNA (20 req/min)
const skillDNALimiter = new RateLimiter(60 * 1000, 20);

// Profile endpoint
router.get('/profile', skillDNALimiter.middleware(), getProfileHandler);

// Simulate endpoint
router.post('/simulate', skillDNALimiter.middleware(), simulateHandler);

// Embeddings endpoint (optional)
router.post('/embeddings', skillDNALimiter.middleware(), embeddingsHandler);

module.exports = router;

