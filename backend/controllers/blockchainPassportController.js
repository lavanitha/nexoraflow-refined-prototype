const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const PASSPORT_FILE = path.join(DATA_DIR, 'blockchain-passport.json');

(async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (e) {}
})();

/**
 * GET /api/blockchain-passport/records
 * Get skill records
 */
const getRecordsHandler = async (req, res) => {
  try {
    const records = await loadRecords();
    res.json({
      success: true,
      records,
    });
  } catch (error) {
    console.error('[Get Records Error]:', error.message);
    res.json({
      success: true,
      records: [],
    });
  }
};

/**
 * POST /api/blockchain-passport/verify
 * Verify/register a skill record
 */
const verifyRecordHandler = async (req, res) => {
  try {
    const { title, issuer, level, certificate } = req.body;

    if (!title || !issuer) {
      return res.status(400).json({
        success: false,
        message: 'Title and issuer required',
      });
    }

    // Generate blockchain-like transaction hash
    const txHash = generateTxHash(title, issuer, level);
    
    const record = {
      id: Date.now().toString(),
      title,
      issuer,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      levelBadge: level || 'INTERMEDIATE',
      status: 'Verified',
      txHash,
      verifiedAt: new Date().toISOString(),
      certificate: certificate || null,
    };

    // Save record
    const records = await loadRecords();
    records.push(record);
    await saveRecords(records);

    res.json({
      success: true,
      record,
    });
  } catch (error) {
    console.error('[Verify Record Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Verification failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * POST /api/blockchain-passport/export
 * Export passport as JSON/QR
 */
const exportPassportHandler = async (req, res) => {
  try {
    const { format = 'json' } = req.query;
    const records = await loadRecords();

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=skill-passport.json');
      return res.json({
        passport: {
          version: '1.0',
          records,
          exportedAt: new Date().toISOString(),
        },
      });
    }

    // For QR code, return data that can be encoded
    res.json({
      success: true,
      qrData: JSON.stringify({
        passport: records,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('[Export Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Export failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

function generateTxHash(title, issuer, level) {
  const data = `${title}-${issuer}-${level || 'INTERMEDIATE'}-${Date.now()}`;
  return '0x' + crypto.createHash('sha256').update(data).digest('hex').substring(0, 64);
}

async function loadRecords() {
  try {
    const data = await fs.readFile(PASSPORT_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

async function saveRecords(records) {
  await fs.writeFile(PASSPORT_FILE, JSON.stringify(records, null, 2));
}

module.exports = {
  getRecordsHandler,
  verifyRecordHandler,
  exportPassportHandler,
};

