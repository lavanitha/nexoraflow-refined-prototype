const express = require('express');
const router = express.Router();

// GET /api/community - Get community overview data
router.get('/', async (req, res) => {
  try {
    const communityData = {
      connections: [
        { id: 1, name: 'Sarah Johnson', role: 'Frontend Developer', connections: 45, avatar: null },
        { id: 2, name: 'Mike Chen', role: 'UX Designer', connections: 32, avatar: null },
        { id: 3, name: 'Emily Rodriguez', role: 'Product Manager', connections: 67, avatar: null }
      ],
      events: [
        { 
          id: 1, 
          title: 'React Best Practices Workshop', 
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          attendees: 24,
          type: 'workshop'
        },
        { 
          id: 2, 
          title: 'Community Networking Hour', 
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          attendees: 15,
          type: 'networking'
        }
      ],
      discussions: [
        { 
          id: 1, 
          title: 'Best practices for remote work', 
          author: 'Sarah Johnson', 
          replies: 12, 
          lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        { 
          id: 2, 
          title: 'Side hustle success stories', 
          author: 'Mike Chen', 
          replies: 8, 
          lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        }
      ],
      challenges: [
        {
          id: 1,
          title: '30-Day Learning Challenge',
          description: 'Complete a learning module every day for 30 days',
          participants: 156,
          daysLeft: 12
        }
      ]
    };

    res.json({
      success: true,
      data: communityData,
      requestId: req.id
    });
  } catch (error) {
    console.error(`[${req.id}] Community error:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch community data',
      requestId: req.id
    });
  }
});

module.exports = router;