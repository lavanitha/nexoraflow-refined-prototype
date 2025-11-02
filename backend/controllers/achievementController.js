const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const ACHIEVEMENTS_FILE = path.join(DATA_DIR, 'achievements.json');

// Ensure data directory exists
(async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (e) {
    // Directory might already exist
  }
})();

/**
 * GET /api/achievements
 * Get user achievements
 */
const getAchievementsHandler = async (req, res) => {
  try {
    const achievements = await loadAchievements();
    res.json({
      success: true,
      achievements,
    });
  } catch (error) {
    console.error('[Get Achievements Error]:', error.message);
    res.json({
      success: true,
      achievements: [],
    });
  }
};

/**
 * POST /api/achievements
 * Save or update achievement
 */
const saveAchievementHandler = async (req, res) => {
  try {
    const { achievement } = req.body;

    if (!achievement || !achievement.id) {
      return res.status(400).json({
        success: false,
        message: 'Achievement data with id required',
      });
    }

    const achievements = await loadAchievements();
    const index = achievements.findIndex(a => a.id === achievement.id);
    
    if (index >= 0) {
      achievements[index] = { ...achievements[index], ...achievement };
    } else {
      achievements.push({
        ...achievement,
        earnedAt: achievement.earnedAt || new Date().toISOString(),
      });
    }

    await saveAchievements(achievements);

    res.json({
      success: true,
      achievement: achievements[index >= 0 ? index : achievements.length - 1],
    });
  } catch (error) {
    console.error('[Save Achievement Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to save achievement',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * POST /api/achievements/export
 * Export achievements as JSON/CSV
 */
const exportAchievementsHandler = async (req, res) => {
  try {
    const { format = 'json' } = req.query;
    const achievements = await loadAchievements();

    if (format === 'csv') {
      const csv = [
        'ID,Title,Category,Earned At,Points,Description',
        ...achievements.map(a => 
          `"${a.id}","${a.title}","${a.category || ''}","${a.earnedAt || ''}","${a.points || 0}","${(a.description || '').replace(/"/g, '""')}"`
        ),
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=achievements.csv');
      return res.send(csv);
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=achievements.json');
    res.json(achievements);
  } catch (error) {
    console.error('[Export Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Export failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

async function loadAchievements() {
  try {
    const data = await fs.readFile(ACHIEVEMENTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

async function saveAchievements(achievements) {
  await fs.writeFile(ACHIEVEMENTS_FILE, JSON.stringify(achievements, null, 2));
}

module.exports = {
  getAchievementsHandler,
  saveAchievementHandler,
  exportAchievementsHandler,
};

