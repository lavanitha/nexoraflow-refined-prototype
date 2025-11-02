const express = require('express');
const router = express.Router();
const {
  startSessionHandler,
  getSessionsHandler,
  createGoalHandler,
  getGoalsHandler,
  assessmentHandler,
} = require('../controllers/resilienceCoachController');
const { RateLimiter } = require('../utils/rateLimiter');

const coachLimiter = new RateLimiter(60 * 1000, 10);

router.post('/session', coachLimiter.middleware(), startSessionHandler);
router.get('/sessions', coachLimiter.middleware(), getSessionsHandler);
router.post('/goals', coachLimiter.middleware(), createGoalHandler);
router.get('/goals', coachLimiter.middleware(), getGoalsHandler);
router.post('/assessment', coachLimiter.middleware(), assessmentHandler);

module.exports = router;

