const express = require('express');
const router = express.Router();
const { projectEvolutionHandler, exportProjectionHandler } = require('../controllers/predictiveEvolutionController');
const { RateLimiter } = require('../utils/rateLimiter');

const evolutionLimiter = new RateLimiter(60 * 1000, 15);

router.post('/project', evolutionLimiter.middleware(), projectEvolutionHandler);
router.post('/export', evolutionLimiter.middleware(), exportProjectionHandler);

module.exports = router;

