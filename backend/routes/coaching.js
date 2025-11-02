const express = require('express');
const router = express.Router();

// GET /api/coaching - Get coaching data
router.get('/', async (req, res) => {
  try {
    const coachingData = {
      sessions: [
        {
          id: 1,
          title: 'Stress Management Techniques',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          duration: 30,
          type: 'resilience',
          completed: true
        },
        {
          id: 2,
          title: 'Goal Setting Workshop',
          date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          duration: 45,
          type: 'achievement',
          completed: false
        }
      ],
      progress: {
        resilienceScore: 75,
        improvementAreas: ['Time Management', 'Stress Response'],
        strengths: ['Problem Solving', 'Adaptability'],
        weeklyProgress: 8
      },
      recommendations: [
        {
          id: 1,
          title: 'Daily Mindfulness Practice',
          description: 'Start with 5-minute daily meditation sessions',
          priority: 'high'
        },
        {
          id: 2,
          title: 'Resilience Journal',
          description: 'Track your daily challenges and how you overcome them',
          priority: 'medium'
        }
      ]
    };

    res.json({
      success: true,
      data: coachingData,
      requestId: req.id
    });
  } catch (error) {
    console.error(`[${req.id}] Coaching error:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch coaching data',
      requestId: req.id
    });
  }
});

module.exports = router;