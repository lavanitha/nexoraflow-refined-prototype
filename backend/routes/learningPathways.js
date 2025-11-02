const express = require('express');
const router = express.Router();
const {
  getPathwaysHandler,
  generatePathwayHandler,
  generateMicroLearnHandler,
} = require('../controllers/learningPathwaysController');
const { RateLimiter } = require('../utils/rateLimiter');

const pathwaysLimiter = new RateLimiter(60 * 1000, 15);

router.get('/', pathwaysLimiter.middleware(), getPathwaysHandler);
router.post('/generate', pathwaysLimiter.middleware(), generatePathwayHandler);
router.post('/micro-learn', pathwaysLimiter.middleware(), generateMicroLearnHandler);

module.exports = router;

