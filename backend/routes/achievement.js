const express = require('express');
const router = express.Router();

// GET /api/achievement - Get achievement data
router.get('/', async (req, res) => {
  try {
    const achievementData = {
      badges: [
        { id: 1, name: 'First Steps', description: 'Completed your first learning module', earned: true, earnedDate: '2024-01-15' },
        { id: 2, name: 'Community Builder', description: 'Made 10 community connections', earned: true, earnedDate: '2024-01-20' },
        { id: 3, name: 'Learning Streak', description: 'Maintained a 7-day learning streak', earned: false, progress: 5 },
        { id: 4, name: 'Mentor', description: 'Helped 5 community members', earned: false, progress: 2 }
      ],
      stats: {
        totalPoints: 1250,
        level: 5,
        nextLevelPoints: 1500,
        rank: 42,
        totalUsers: 1000
      },
      recentAchievements: [
        { id: 1, name: 'Quick Learner', earnedDate: '2024-01-25', points: 100 },
        { id: 2, name: 'Community Helper', earnedDate: '2024-01-23', points: 75 }
      ]
    };

    res.json({
      success: true,
      data: achievementData,
      requestId: req.id
    });
  } catch (error) {
    console.error(`[${req.id}] Achievement error:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch achievement data',
      requestId: req.id
    });
  }
});

module.exports = router;