const llmClient = require('../utils/llmClient');
const Cache = require('../utils/cache');
const fs = require('fs').promises;
const path = require('path');

const cache = new Cache(60);
const DATA_DIR = path.join(__dirname, '../../data');
const PATHWAYS_FILE = path.join(DATA_DIR, 'learning-pathways.json');

(async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (e) {}
})();

/**
 * GET /api/learning-pathways
 * Get learning pathways
 */
const getPathwaysHandler = async (req, res) => {
  try {
    const pathways = await loadPathways();
    res.json({
      success: true,
      pathways,
    });
  } catch (error) {
    console.error('[Get Pathways Error]:', error.message);
    res.json({
      success: true,
      pathways: [],
    });
  }
};

/**
 * POST /api/learning-pathways/generate
 * Generate personalized learning pathway
 */
const generatePathwayHandler = async (req, res) => {
  try {
    const { skills, goals, timeframe } = req.body;

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Skills array required',
      });
    }

    const cacheKey = `pathway-${JSON.stringify(skills)}-${goals || 'general'}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ success: true, ...cached, cached: true });
    }

    let pathway = null;

    if (llmClient.apiKey) {
      try {
        const prompt = `Generate a personalized learning pathway for skills: ${skills.join(', ')}. Goals: ${goals || 'general career growth'}. Timeframe: ${timeframe || '6 months'}. Return JSON with: {title, description, modules: [{title, description, duration, skills, order}], estimatedDuration, difficulty}. Include 8-12 modules.`;

        const response = await llmClient.callLLM(prompt);
        if (response.title && response.modules) {
          pathway = {
            id: Date.now().toString(),
            ...response,
            skills,
            goals: goals || 'general',
            createdAt: new Date().toISOString(),
          };
        }
      } catch (error) {
        console.error('[Generate Pathway LLM Error]:', error.message);
      }
    }

    // Fallback pathway
    if (!pathway) {
      pathway = {
        id: Date.now().toString(),
        title: `${skills[0]} Learning Path`,
        description: `Master ${skills.join(' and ')} through structured learning modules`,
        modules: skills.map((skill, idx) => ({
          title: `${skill} Fundamentals`,
          description: `Learn core ${skill} concepts`,
          duration: '2-3 weeks',
          skills: [skill],
          order: idx + 1,
        })),
        estimatedDuration: `${Math.ceil(timeframe || 6)} months`,
        difficulty: 'Intermediate',
        skills,
        goals: goals || 'general',
        createdAt: new Date().toISOString(),
      };
    }

    // Save pathway
    const pathways = await loadPathways();
    pathways.push(pathway);
    await savePathways(pathways);

    cache.set(cacheKey, pathway);

    res.json({
      success: true,
      pathway,
      cached: false,
    });
  } catch (error) {
    console.error('[Generate Pathway Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Pathway generation failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * POST /api/learning-pathways/micro-learn
 * Generate micro-learning suggestions
 */
const generateMicroLearnHandler = async (req, res) => {
  try {
    const { skill, context } = req.body;

    if (!skill) {
      return res.status(400).json({
        success: false,
        message: 'Skill required',
      });
    }

    let suggestions = [];

    if (llmClient.apiKey) {
      try {
        const prompt = `Generate 3-5 micro-learning activities (1-2 hours each) for ${skill}. Context: ${context || 'general learning'}. Return JSON array of strings.`;

        const response = await llmClient.callLLM(prompt);
        if (Array.isArray(response)) {
          suggestions = response.slice(0, 5);
        }
      } catch (error) {
        console.error('[MicroLearn LLM Error]:', error.message);
      }
    }

    // Fallback
    if (suggestions.length === 0) {
      suggestions = [
        `Complete ${skill} fundamentals tutorial`,
        `Build a small project using ${skill}`,
        `Join ${skill} community and practice`,
        `Watch ${skill} best practices video`,
        `Read ${skill} documentation`,
      ];
    }

    res.json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.error('[MicroLearn Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Micro-learn generation failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

async function loadPathways() {
  try {
    const data = await fs.readFile(PATHWAYS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

async function savePathways(pathways) {
  await fs.writeFile(PATHWAYS_FILE, JSON.stringify(pathways, null, 2));
}

module.exports = {
  getPathwaysHandler,
  generatePathwayHandler,
  generateMicroLearnHandler,
};

