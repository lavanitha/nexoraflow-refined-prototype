const express = require('express');
const router = express.Router();

// GET /api/learning - Get learning overview data
router.get('/', async (req, res) => {
  try {
    const learningData = {
      paths: [
        {
          id: 1,
          title: 'Frontend Development Mastery',
          description: 'Complete path from beginner to advanced frontend developer',
          progress: 65,
          totalModules: 12,
          completedModules: 8,
          estimatedTime: '3 months'
        },
        {
          id: 2,
          title: 'UX/UI Design Fundamentals',
          description: 'Learn the basics of user experience and interface design',
          progress: 30,
          totalModules: 8,
          completedModules: 2,
          estimatedTime: '2 months'
        }
      ],
      progress: {
        totalHours: 45,
        weeklyGoal: 10,
        currentWeekHours: 7,
        streak: 5,
        completedCourses: 3
      },
      recommendations: [
        {
          id: 1,
          title: 'Advanced React Patterns',
          description: 'Deep dive into advanced React concepts and patterns',
          difficulty: 'Advanced',
          duration: '4 weeks',
          rating: 4.8
        },
        {
          id: 2,
          title: 'JavaScript Testing Fundamentals',
          description: 'Learn to write effective tests for your JavaScript code',
          difficulty: 'Intermediate',
          duration: '2 weeks',
          rating: 4.6
        }
      ]
    };

    res.json({
      success: true,
      data: learningData,
      requestId: req.id
    });
  } catch (error) {
    console.error(`[${req.id}] Learning error:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch learning data',
      requestId: req.id
    });
  }
});

module.exports = router;