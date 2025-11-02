const express = require('express');
const router = express.Router();

// Validation middleware for advise requests
const validateAdviseRequest = (req, res, next) => {
  const { userId, context, category } = req.body;
  
  if (!userId || !context || !category) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: userId, context, and category are required',
      requestId: req.id
    });
  }

  const validCategories = ['coaching', 'learning', 'hustle', 'achievement', 'community'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({
      success: false,
      error: `Invalid category. Must be one of: ${validCategories.join(', ')}`,
      requestId: req.id
    });
  }

  if (context.length < 10) {
    return res.status(400).json({
      success: false,
      error: 'Context must be at least 10 characters long',
      requestId: req.id
    });
  }

  next();
};

// POST /api/advise - Get AI advice from Gemini
router.post('/', validateAdviseRequest, async (req, res) => {
  try {
    const { userId, context, category } = req.body;
    
    console.log(`[${req.id}] Advise request - User: ${userId}, Category: ${category}`);
    
    // TODO: Integrate with Gemini AI API
    // const geminiResponse = await callGeminiAPI({
    //   prompt: `Provide advice for a user in the ${category} category. Context: ${context}`,
    //   userId: userId,
    //   category: category
    // });
    
    // Enhanced placeholder response based on category
    const categoryResponses = {
      coaching: {
        advice: "Focus on building resilience through daily mindfulness practices. Start with 5-minute meditation sessions and gradually increase the duration. Remember that setbacks are part of growth.",
        suggestions: [
          "Practice daily mindfulness for 5-10 minutes",
          "Keep a resilience journal to track your progress",
          "Set small, achievable goals to build confidence",
          "Connect with supportive community members"
        ],
        followUpQuestions: [
          "What specific challenges are you facing right now?",
          "How do you currently handle stress and setbacks?",
          "What support systems do you have in place?"
        ]
      },
      learning: {
        advice: "Based on your learning context, I recommend focusing on hands-on practice alongside theoretical knowledge. Create projects that apply what you're learning to reinforce concepts.",
        suggestions: [
          "Build practical projects to apply new concepts",
          "Join study groups or learning communities",
          "Set aside dedicated learning time each day",
          "Track your progress with learning milestones"
        ],
        followUpQuestions: [
          "What learning style works best for you?",
          "How much time can you dedicate to learning daily?",
          "What specific skills do you want to develop?"
        ]
      },
      hustle: {
        advice: "Identify side hustles that align with your existing skills and interests. Start small and validate your ideas before investing significant time or money.",
        suggestions: [
          "Leverage your current skills for freelance opportunities",
          "Research market demand for your services",
          "Start with low-risk, low-investment options",
          "Network with others in your target market"
        ],
        followUpQuestions: [
          "What skills do you have that could be monetized?",
          "How many hours per week can you dedicate to a side hustle?",
          "What's your target monthly income from side activities?"
        ]
      },
      achievement: {
        advice: "Break down your larger goals into smaller, measurable milestones. Celebrate small wins to maintain motivation and track your progress consistently.",
        suggestions: [
          "Set SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)",
          "Create a reward system for reaching milestones",
          "Share your goals with accountability partners",
          "Review and adjust your goals regularly"
        ],
        followUpQuestions: [
          "What specific achievement are you working towards?",
          "How do you currently track your progress?",
          "What motivates you to keep going when things get tough?"
        ]
      },
      community: {
        advice: "Engage authentically with community members by sharing your experiences and offering help to others. Quality connections are more valuable than quantity.",
        suggestions: [
          "Participate actively in discussions and forums",
          "Offer help and support to other community members",
          "Share your knowledge and experiences openly",
          "Attend virtual or in-person community events"
        ],
        followUpQuestions: [
          "What type of community connections are you looking for?",
          "How comfortable are you with networking and meeting new people?",
          "What value can you bring to the community?"
        ]
      }
    };

    const response = categoryResponses[category] || categoryResponses.coaching;
    
    const adviceResponse = {
      advice: response.advice,
      confidence: Math.random() * 0.2 + 0.8, // Random confidence between 0.8-1.0
      suggestions: response.suggestions,
      followUpQuestions: response.followUpQuestions,
      category: category,
      timestamp: new Date().toISOString(),
      // Placeholder for future Gemini integration
      geminiIntegration: {
        status: 'placeholder',
        message: 'This response is generated by placeholder logic. Gemini AI integration will be added here.',
        integrationPoints: [
          'Replace placeholder logic with Gemini API call',
          'Add proper prompt engineering for each category',
          'Implement context-aware responses',
          'Add conversation history tracking'
        ]
      }
    };

    res.json({
      success: true,
      data: adviceResponse,
      requestId: req.id
    });
    
  } catch (error) {
    console.error(`[${req.id}] Advise error:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate advice',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      requestId: req.id
    });
  }
});

// GET /api/advise/categories - Get available advice categories
router.get('/categories', (req, res) => {
  const categories = [
    { 
      id: 'coaching', 
      name: 'AI Resilience Coaching', 
      description: 'Get personalized coaching for building resilience and mental strength',
      icon: '🧠'
    },
    { 
      id: 'learning', 
      name: 'Learning Guidance', 
      description: 'Receive advice on learning paths and skill development',
      icon: '📚'
    },
    { 
      id: 'hustle', 
      name: 'Side Hustle Advice', 
      description: 'Get recommendations for side hustle opportunities',
      icon: '💼'
    },
    { 
      id: 'achievement', 
      name: 'Achievement Coaching', 
      description: 'Guidance on setting and reaching your goals',
      icon: '🏆'
    },
    { 
      id: 'community', 
      name: 'Community Engagement', 
      description: 'Tips for building meaningful connections and networking',
      icon: '👥'
    }
  ];

  res.json({
    success: true,
    data: categories,
    requestId: req.id
  });
});

module.exports = router;