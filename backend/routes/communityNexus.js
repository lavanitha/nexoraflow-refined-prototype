const express = require('express');
const router = express.Router();
const {
  searchOpportunitiesHandler,
  getMarketplaceHandler,
} = require('../controllers/communityNexusController');
const { RateLimiter } = require('../utils/rateLimiter');

const communityLimiter = new RateLimiter(60 * 1000, 20);

router.get('/opportunities', communityLimiter.middleware(), searchOpportunitiesHandler);
router.get('/marketplace', communityLimiter.middleware(), getMarketplaceHandler);

module.exports = router;

