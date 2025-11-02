const express = require('express');
const router = express.Router();
const { getTrendsHandler, subscribeHandler } = require('../controllers/trendFeedController');
const { RateLimiter } = require('../utils/rateLimiter');

const trendLimiter = new RateLimiter(60 * 1000, 20);

router.get('/trends', trendLimiter.middleware(), getTrendsHandler);
router.post('/subscribe', trendLimiter.middleware(), subscribeHandler);

module.exports = router;

