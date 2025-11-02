const llmClient = require('../utils/llmClient');
const Cache = require('../utils/cache');
const { defaultLimiter } = require('../utils/rateLimiter');

// Initialize cache and rate limiter
const cache = new Cache(process.env.CACHE_TTL_MINUTES || 360);
const useMongo = !!process.env.MONGO_URI;

/**
 * Main career comparison endpoint handler
 */
const compareCareersHandler = async (req, res) => {
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
      if (typeof skill.score !== 'number' || skill.score < 0 || skill.score > 100) {
        return res.status(400).json({ success: false, message: 'Invalid skill score in userSkills (0-100)' });
      }
    }

    // Generate cache key
    const cacheKey = llmClient.generateCacheKey(career1, career2, location || '', timelineYears, userSkills);

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

    // Fetch RapidAPI data for both careers
    let optionalData = {};
    if (llmClient.rapidApiKey) {
      const [data1, data2] = await Promise.all([
        llmClient.fetchRapidApiData(career1, location || 'India'),
        llmClient.fetchRapidApiData(career2, location || 'India'),
      ]);

      if (data1 && data2) {
        optionalData = {
          [`${career1}`]: { salary: data1.avgSalary, demand: data1.demandScore },
          [`${career2}`]: { salary: data2.avgSalary, demand: data2.demandScore },
        };
      }
    }

    // Build prompt and call LLM
    const prompt = llmClient.buildPrompt(
      career1,
      career2,
      timelineYears,
      resolutionMonths,
      userSkills,
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
      result = llmClient.generateFallback(career1, career2, timelineYears, resolutionMonths, userSkills);
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
      `[Compare] ${career1} vs ${career2} | Model: ${model} | Latency: ${latencyMs}ms | Cache: miss`
    );

    res.json(response);
  } catch (error) {
    console.error('[Compare Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error during comparison',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Save comparison to DB (if MONGO_URI set)
 */
const saveComparisonHandler = async (req, res) => {
  if (!useMongo) {
    return res.status(501).json({
      success: false,
      message: 'Database not configured. Set MONGO_URI to enable save functionality.',
    });
  }

  // TODO: Implement MongoDB save
  res.status(501).json({
    success: false,
    message: 'Save functionality not yet implemented',
  });
};

/**
 * Get comparison history from DB (if MONGO_URI set)
 */
const getHistoryHandler = async (req, res) => {
  if (!useMongo) {
    return res.status(501).json({
      success: false,
      message: 'Database not configured. Set MONGO_URI to enable history functionality.',
    });
  }

  // TODO: Implement MongoDB history
  res.status(501).json({
    success: false,
    message: 'History functionality not yet implemented',
  });
};

/**
 * Health check endpoint
 */
const healthCheckHandler = async (req, res) => {
  try {
    const stats = defaultLimiter.getStats();
    res.json({
      ok: true,
      provider: process.env.LLM_API_PROVIDER || 'none',
      llm_key_set: !!process.env.LLM_API_KEY,
      rapidapi_set: !!process.env.RAPIDAPI_KEY,
      mongo_set: useMongo,
      cacheSize: cache.size(),
      rateLimit: process.env.RATE_LIMIT_PER_HOUR || 30,
      stats,
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

module.exports = {
  compareCareersHandler,
  saveComparisonHandler,
  getHistoryHandler,
  healthCheckHandler,
};

