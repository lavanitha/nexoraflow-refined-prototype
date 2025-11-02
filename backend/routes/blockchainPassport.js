const express = require('express');
const router = express.Router();
const {
  getRecordsHandler,
  verifyRecordHandler,
  exportPassportHandler,
} = require('../controllers/blockchainPassportController');
const { RateLimiter } = require('../utils/rateLimiter');

const passportLimiter = new RateLimiter(60 * 1000, 20);

router.get('/records', passportLimiter.middleware(), getRecordsHandler);
router.post('/verify', passportLimiter.middleware(), verifyRecordHandler);
router.get('/export', passportLimiter.middleware(), exportPassportHandler);

module.exports = router;

