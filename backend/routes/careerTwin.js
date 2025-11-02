const express = require('express');
const router = express.Router();
const { simulateHandler, historyHandler, jobsHandler } = require('../controllers/careerTwinController');
const { defaultLimiter } = require('../utils/rateLimiter');

// Main simulation endpoint with rate limiting
router.post('/simulate', defaultLimiter.middleware(), simulateHandler);

// History endpoints (requires MONGO_URI)
router.get('/history', historyHandler);
router.post('/history', historyHandler);

// Jobs enrichment endpoint (requires RAPIDAPI_KEY)
router.get('/jobs', jobsHandler);

module.exports = router;

