const express = require('express');
const router = express.Router();
const {
  getAchievementsHandler,
  saveAchievementHandler,
  exportAchievementsHandler,
} = require('../controllers/achievementController');
const { RateLimiter } = require('../utils/rateLimiter');

const achievementLimiter = new RateLimiter(60 * 1000, 30);

router.get('/', achievementLimiter.middleware(), getAchievementsHandler);
router.post('/', achievementLimiter.middleware(), saveAchievementHandler);
router.get('/export', achievementLimiter.middleware(), exportAchievementsHandler);

module.exports = router;

