const llmClient = require('../utils/llmClient');
const Cache = require('../utils/cache');
const { getCollection } = require('../utils/mongodb');

// Initialize cache
const cache = new Cache(process.env.CACHE_TTL_MINUTES || 360);

/**
 * Main career twin simulation endpoint
 * POST /api/career-twin/simulate
 */
const simulateHandler = async (req, res) => {
  const startTime = Date.now();

  try {
    // Validate request body
    const { career1, career2, timelineYears, resolutionMonths, userSkills, location, experienceYears, userId } = req.body;

    if (!career1 || !career2 || !timelineYears || !resolutionMonths || !userSkills) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: career1, career2, timelineYears, resolutionMonths, userSkills',
      });
    }

    // Additional validation
    if (career1.length > 100 || career2.length > 100) {
      return res.status(400).json({ success: false, message: 'Career names too long (max 100 chars)' });
    }
    if (timelineYears < 0.5 || timelineYears > 10) {
      return res.status(400).json({ success: false, message: 'timelineYears must be 0.5-10' });
    }
    if (resolutionMonths < 1 || resolutionMonths > 120) {
      return res.status(400).json({ success: false, message: 'resolutionMonths must be 1-120' });
    }
    if (!Array.isArray(userSkills) || userSkills.length === 0) {
      return res.status(400).json({ success: false, message: 'userSkills must be non-empty array' });
    }

    // Validate userSkills structure
    for (const skill of userSkills) {
      if (!skill.name || typeof skill.name !== 'string' || skill.name.length > 100) {
        return res.status(400).json({ success: false, message: 'Invalid skill name in userSkills' });
      }
      if (typeof (skill.score || skill.level) !== 'number' || (skill.score || skill.level) < 0 || (skill.score || skill.level) > 100) {
        return res.status(400).json({ success: false, message: 'Invalid skill score in userSkills (0-100)' });
      }
    }

    // Normalize userSkills format (support both 'score' and 'level')
    const normalizedSkills = userSkills.map(s => ({
      name: s.name,
      score: s.score || s.level || 0,
    }));

    // Generate cache key
    const cacheKey = llmClient.generateCacheKey(career1, career2, location || '', timelineYears, normalizedSkills);

    // Check cache
    let cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      console.log(`[Cache Hit] ${career1} vs ${career2}`);
      return res.json({
        success: true,
        ...cachedResult,
        meta: {
          ...cachedResult.meta,
          cacheHit: true,
          latencyMs: Date.now() - startTime,
        },
      });
    }

    console.log(`[Cache Miss] ${career1} vs ${career2}`);

    // Fetch RapidAPI data for both careers if available
    let optionalData = {};
    if (llmClient.rapidApiKey) {
      const [data1, data2] = await Promise.all([
        llmClient.fetchRapidApiData(career1, location || 'India'),
        llmClient.fetchRapidApiData(career2, location || 'India'),
      ]);

      if (data1 && data2) {
        optionalData = {
          [`${career1}`]: { salary: data1.avgSalary, demand: data1.demandScore, openingsCount: data1.openingsCount },
          [`${career2}`]: { salary: data2.avgSalary, demand: data2.demandScore, openingsCount: data2.openingsCount },
        };
      }
    }

    // Build prompt and call LLM
    const prompt = llmClient.buildPrompt(
      career1,
      career2,
      timelineYears,
      resolutionMonths,
      normalizedSkills,
      optionalData
    );

    const llmResult = await llmClient.callLLM(prompt);

    let result;
    let sources = [];
    let model = llmResult.model || 'none';

    if (llmResult.data) {
      // Validate LLM response
      result = llmResult.data;
      sources.push(`llm-${llmClient.provider}`);
      if (llmResult.retried) sources.push('llm-retry');
    } else {
      // Use deterministic fallback
      result = llmClient.generateFallback(career1, career2, timelineYears, resolutionMonths, normalizedSkills);
      model = 'deterministic-fallback';
      sources.push('fallback-deterministic');
      console.log('[Using Fallback] LLM failed or not configured');
    }

    // Add source flags
    if (!llmClient.rapidApiKey) sources.push('missing-rapidapi');
    if (!llmClient.apiKey) sources.push('missing-llm-key');

    // Merge optional data into result
    if (optionalData[career1]) {
      result.salary.career1 = optionalData[career1].salary || result.salary.career1;
      result.demand_score.career1 = optionalData[career1].demand || result.demand_score.career1;
    }
    if (optionalData[career2]) {
      result.salary.career2 = optionalData[career2].salary || result.salary.career2;
      result.demand_score.career2 = optionalData[career2].demand || result.demand_score.career2;
    }

    // Set currency if not set
    if (!result.salary.currency) {
      result.salary.currency = location?.toLowerCase().includes('india') || !location ? 'INR' : 'USD';
    }

    const latencyMs = Date.now() - startTime;

    // Prepare response
    const response = {
      success: true,
      ...result,
      meta: {
        model,
        tokensUsed: llmResult.tokensUsed || 0,
        sources,
        cacheHit: false,
        latencyMs,
      },
    };

    // Cache result
    cache.set(cacheKey, response);

    // Log metadata (not user skills)
    console.log(
      `[Simulate] ${career1} vs ${career2} | Model: ${model} | Latency: ${latencyMs}ms | Cache: miss`
    );

    res.json(response);
  } catch (error) {
    console.error('[Simulate Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error during simulation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * History endpoint - GET or POST
 * GET /api/career-twin/history?userId=xxx - Retrieve history
 * POST /api/career-twin/history - Save comparison
 */
const historyHandler = async (req, res) => {
  if (!process.env.MONGO_URI) {
    return res.status(501).json({
      success: false,
      message: 'Database not configured. Set MONGO_URI to enable history functionality.',
    });
  }

  try {
    const collection = await getCollection('career_twin_history');
    if (!collection) {
      return res.status(500).json({
        success: false,
        message: 'Database connection failed',
      });
    }

    // GET request - retrieve history
    if (req.method === 'GET') {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId query parameter required',
        });
      }

      const history = await collection
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray();

      return res.json({
        success: true,
        count: history.length,
        results: history,
      });
    }

    // POST request - save comparison
    if (req.method === 'POST') {
      const { userId, career1, career2, simulationResult, metadata } = req.body;

      if (!userId || !career1 || !career2 || !simulationResult) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: userId, career1, career2, simulationResult',
        });
      }

      const doc = {
        userId,
        career1,
        career2,
        simulationResult,
        metadata: metadata || {},
        createdAt: new Date(),
      };

      const result = await collection.insertOne(doc);

      return res.json({
        success: true,
        id: result.insertedId,
        message: 'Comparison saved successfully',
      });
    }
  } catch (error) {
    console.error('[History Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Database operation failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Jobs enrichment endpoint
 * GET /api/career-twin/jobs?career=xxx&location=xxx
 */
const jobsHandler = async (req, res) => {
  if (!llmClient.rapidApiKey) {
    return res.status(501).json({
      success: false,
      message: 'RapidAPI not configured. Set RAPIDAPI_KEY to enable job data enrichment.',
    });
  }

  try {
    const { career, location = 'India' } = req.query;

    if (!career) {
      return res.status(400).json({
        success: false,
        message: 'career query parameter required',
      });
    }

    const data = await llmClient.fetchRapidApiData(career, location);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'No job data found for the given career and location',
      });
    }

    return res.json({
      success: true,
      career,
      location,
      data: {
        avgSalary: data.avgSalary,
        demandScore: data.demandScore,
        openingsCount: data.openingsCount,
      },
    });
  } catch (error) {
    console.error('[Jobs Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = {
  simulateHandler,
  historyHandler,
  jobsHandler,
};

