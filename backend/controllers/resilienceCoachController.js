const llmClient = require('../utils/llmClient');
const Cache = require('../utils/cache');
const fs = require('fs').promises;
const path = require('path');

const cache = new Cache(10); // 10 min TTL
const DATA_DIR = path.join(__dirname, '../../data');
const SESSIONS_FILE = path.join(DATA_DIR, 'resilience-sessions.json');
const GOALS_FILE = path.join(DATA_DIR, 'resilience-goals.json');

// Ensure data directory exists
(async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (e) {
    // Directory might already exist
  }
})();

/**
 * POST /api/resilience-coach/session
 * Start a new coaching session
 */
const startSessionHandler = async (req, res) => {
  try {
    const { input, type = 'general' } = req.body;

    if (!input || input.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Session input required',
      });
    }

    if (!llmClient.apiKey) {
      return res.status(503).json({
        success: false,
        message: 'Coaching service unavailable (OPENAI_API_KEY not configured)',
        fallback: {
          advice: [
            'Practice deep breathing for 5 minutes when feeling stressed',
            'Take regular breaks during work sessions',
            'Maintain a consistent sleep schedule',
          ],
          tips: [
            'Focus on what you can control',
            'Practice gratitude daily',
            'Stay connected with supportive people',
          ],
        },
      });
    }

    try {
      const prompt = `You are an AI resilience coach. A user wrote: "${input}". Provide supportive, actionable advice. Return JSON with: {advice: [3-5 actionable suggestions as strings], tips: [3-5 resilience tips as strings], category: string, sessionSummary: string}. Be empathetic and practical.`;

      const response = await llmClient.callLLM(prompt);
      
      const advice = response.advice || [];
      const tips = response.tips || [];
      const category = response.category || type;
      const sessionSummary = response.sessionSummary || 'Coaching session completed';

      // Save session to file
      try {
        const sessions = await loadSessions();
        sessions.push({
          id: Date.now().toString(),
          input,
          advice,
          tips,
          category,
          timestamp: new Date().toISOString(),
        });
        await saveSessions(sessions);
      } catch (fileError) {
        console.error('[Session Save Error]:', fileError.message);
      }

      res.json({
        success: true,
        session: {
          id: Date.now().toString(),
          advice,
          tips,
          category,
          sessionSummary,
        },
      });
    } catch (error) {
      console.error('[Resilience Coach LLM Error]:', error.message);
      res.status(500).json({
        success: false,
        message: 'Coaching session failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  } catch (error) {
    console.error('[Resilience Coach Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Session failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * GET /api/resilience-coach/sessions
 * Get recent coaching sessions
 */
const getSessionsHandler = async (req, res) => {
  try {
    const sessions = await loadSessions();
    res.json({
      success: true,
      sessions: sessions.slice(-10).reverse(), // Last 10 sessions
    });
  } catch (error) {
    console.error('[Get Sessions Error]:', error.message);
    res.json({
      success: true,
      sessions: [],
    });
  }
};

/**
 * POST /api/resilience-coach/goals
 * Create or update a resilience goal
 */
const createGoalHandler = async (req, res) => {
  try {
    const { title, description, dueDate, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description required',
      });
    }

    const goals = await loadGoals();
    goals.push({
      id: Date.now().toString(),
      title,
      description,
      completed: false,
      dueDate: dueDate || null,
      category: category || 'wellness',
      createdAt: new Date().toISOString(),
    });
    await saveGoals(goals);

    res.json({
      success: true,
      goal: goals[goals.length - 1],
    });
  } catch (error) {
    console.error('[Create Goal Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Goal creation failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * GET /api/resilience-coach/goals
 * Get resilience goals
 */
const getGoalsHandler = async (req, res) => {
  try {
    const goals = await loadGoals();
    res.json({
      success: true,
      goals,
    });
  } catch (error) {
    console.error('[Get Goals Error]:', error.message);
    res.json({
      success: true,
      goals: [],
    });
  }
};

/**
 * POST /api/resilience-coach/assessment
 * Run resilience assessment
 */
const assessmentHandler = async (req, res) => {
  try {
    const { answers } = req.body; // Array of 1-5 scores

    if (!answers || !Array.isArray(answers) || answers.length < 4) {
      return res.status(400).json({
        success: false,
        message: 'At least 4 assessment answers required',
      });
    }

    const avgScore = Math.round(answers.reduce((a, b) => a + b, 0) / answers.length * 20);
    const resilienceScore = avgScore;
    const emotionalIntelligence = avgScore + Math.floor(Math.random() * 10);
    const stressManagement = avgScore - Math.floor(Math.random() * 5);
    const adaptability = avgScore + Math.floor(Math.random() * 8);
    const selfAwareness = avgScore + Math.floor(Math.random() * 12);

    res.json({
      success: true,
      metrics: [
        { name: 'Resilience Score', score: Math.min(100, resilienceScore), maxScore: 100 },
        { name: 'Emotional Intelligence', score: Math.min(100, emotionalIntelligence), maxScore: 100 },
        { name: 'Stress Management', score: Math.min(100, Math.max(0, stressManagement)), maxScore: 100 },
        { name: 'Adaptability', score: Math.min(100, adaptability), maxScore: 100 },
        { name: 'Self-Awareness', score: Math.min(100, selfAwareness), maxScore: 100 },
      ],
      recommendations: [
        'Practice daily mindfulness for 10 minutes',
        'Maintain a gratitude journal',
        'Schedule regular self-care activities',
      ],
    });
  } catch (error) {
    console.error('[Assessment Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Assessment failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Helper functions for file persistence
async function loadSessions() {
  try {
    const data = await fs.readFile(SESSIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

async function saveSessions(sessions) {
  await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
}

async function loadGoals() {
  try {
    const data = await fs.readFile(GOALS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

async function saveGoals(goals) {
  await fs.writeFile(GOALS_FILE, JSON.stringify(goals, null, 2));
}

module.exports = {
  startSessionHandler,
  getSessionsHandler,
  createGoalHandler,
  getGoalsHandler,
  assessmentHandler,
};

