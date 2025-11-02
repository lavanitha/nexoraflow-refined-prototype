const express = require('express');
const router = express.Router();
const { compareCareersHandler, saveComparisonHandler, getHistoryHandler, healthCheckHandler } = require('../controllers/compareController');
const { defaultLimiter } = require('../utils/rateLimiter');

// Main comparison endpoint with rate limiting
router.post('/compare', defaultLimiter.middleware(), compareCareersHandler);

// Optional DB endpoints
router.post('/save-comparison', saveComparisonHandler);
router.get('/history', getHistoryHandler);

// Health check (no rate limiting)
router.get('/compare/health', healthCheckHandler);

module.exports = router;

