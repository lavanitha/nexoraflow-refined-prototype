const express = require('express');
const router = express.Router();

// GET /api/dashboard - Get dashboard overview data
router.get('/', async (req, res) => {
  try {
    // Placeholder for dashboard data
    const dashboardData = {
      metrics: {
        totalProgress: 75,
        activeGoals: 5,
        completedTasks: 23,
        communityConnections: 12,
        learningHours: 45,
        achievementPoints: 1250
      },
      recentActivity: [
        { 
          id: 1, 
          type: 'achievement', 
          message: 'Completed learning module: React Fundamentals', 
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          icon: '🏆'
        },
        { 
          id: 2, 
          type: 'community', 
          message: 'New connection made with Sarah Johnson', 
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          icon: '👥'
        },
        { 
          id: 3, 
          type: 'coaching', 
          message: 'Resilience coaching session completed', 
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          icon: '🧠'
        },
        { 
          id: 4, 
          type: 'hustle', 
          message: 'New side hustle opportunity discovered', 
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          icon: '💼'
        }
      ],
      quickActions: [
        { id: 1, title: 'Continue Learning Path', description: 'Resume your current course', action: '/learning', icon: '📚' },
        { id: 2, title: 'Check Achievements', description: 'View your latest badges', action: '/achievements', icon: '🏅' },
        { id: 3, title: 'Connect with Community', description: 'Find new connections', action: '/community', icon: '🌐' },
        { id: 4, title: 'Get AI Coaching', description: 'Start a coaching session', action: '/coaching', icon: '🤖' }
      ],
      recommendations: [
        { 
          id: 1, 
          type: 'learning', 
          title: 'Advanced React Patterns', 
          description: 'Based on your recent progress in React Fundamentals',
          confidence: 0.92
        },
        { 
          id: 2, 
          type: 'community', 
          title: 'Join Frontend Developers Group', 
          description: 'Connect with developers in your field',
          confidence: 0.87
        }
      ]
    };

    res.json({
      success: true,
      data: dashboardData,
      requestId: req.id
    });
  } catch (error) {
    console.error(`[${req.id}] Dashboard error:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data',
      requestId: req.id
    });
  }
});

// GET /api/dashboard/metrics - Get specific metrics
router.get('/metrics', async (req, res) => {
  try {
    const metrics = {
      totalProgress: 75,
      activeGoals: 5,
      completedTasks: 23,
      communityConnections: 12,
      learningHours: 45,
      achievementPoints: 1250,
      weeklyProgress: {
        learning: 12,
        community: 3,
        achievements: 2,
        coaching: 1
      }
    };

    res.json({
      success: true,
      data: metrics,
      requestId: req.id
    });
  } catch (error) {
    console.error(`[${req.id}] Metrics error:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch metrics',
      requestId: req.id
    });
  }
});

module.exports = router;