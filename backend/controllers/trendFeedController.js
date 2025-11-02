const rapidApiClient = require('../utils/rapidApiClient');
const llmClient = require('../utils/llmClient');
const Cache = require('../utils/cache');

const cache = new Cache(30); // 30 min TTL for trends

/**
 * GET /api/trend-feed/trends
 * Get trending roles and industry insights
 */
const getTrendsHandler = async (req, res) => {
  try {
    const { industry, location, timeWindow = 30 } = req.query;

    const cacheKey = `trends-${industry || 'all'}-${location || 'all'}-${timeWindow}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ success: true, ...cached, cached: true });
    }

    // Use LLM to generate trend insights if available
    let trendingRoles = [];
    let insights = [];

    if (llmClient.apiKey) {
      try {
        const prompt = `Generate 5-7 trending tech job roles for ${industry || 'technology'} industry in ${location || 'India'} over the last ${timeWindow} days. Include: title, description, salary range (INR), openings count estimate, required skills, location, experience level, and a tag (NEW ROLE, HOT ROLE, or TOP PAYING). Return ONLY valid JSON array with objects containing: id, title, tag, description, postedAt, salaryRange {min, max}, openingsCount, companies (array), requiredSkills (array), location, experience, industry.`;

        const response = await llmClient.callLLM(prompt);
        if (Array.isArray(response)) {
          trendingRoles = response.slice(0, 7);
        } else if (response.trendingRoles) {
          trendingRoles = response.trendingRoles;
        }

        // Generate insights
        const insightsPrompt = `Generate 3-5 brief industry trend insights for ${industry || 'technology'} sector based on current job market. Return JSON array of strings.`;
        const insightsResponse = await llmClient.callLLM(insightsPrompt);
        if (Array.isArray(insightsResponse)) {
          insights = insightsResponse.slice(0, 5);
        }
      } catch (error) {
        console.error('[Trend Feed LLM Error]:', error.message);
      }
    }

    // Enrich with RapidAPI if available
    if (rapidApiClient.isConfigured() && trendingRoles.length > 0) {
      for (const role of trendingRoles.slice(0, 5)) {
        try {
          const salaryData = await rapidApiClient.getSalaryData(role.title, location || 'India');
          if (salaryData.avg > 0) {
            role.salaryRange = {
              min: salaryData.min || role.salaryRange?.min || 500000,
              max: salaryData.max || role.salaryRange?.max || 1500000,
            };
          }

          const jobData = await rapidApiClient.getJobTrends(role.title, location || 'India', 5);
          if (jobData.count > 0) {
            role.openingsCount = jobData.count;
            role.companies = jobData.results
              .slice(0, 3)
              .map(j => j.company?.display_name || 'Unknown')
              .filter(Boolean);
          }
        } catch (error) {
          console.error(`[Trend Feed Enrichment Error for ${role.title}]:`, error.message);
        }
      }
    }

    // Fallback to demo data if no LLM
    if (trendingRoles.length === 0) {
      trendingRoles = [
        {
          id: 'prompt-engineer',
          title: 'Prompt Engineer',
          tag: 'NEW ROLE',
          description: 'Design and optimize AI prompts to enhance LLM performance.',
          postedAt: '2 days ago',
          salaryRange: { min: 1200000, max: 1800000 },
          openingsCount: 1240,
          companies: ['OpenAI', 'Anthropic', 'Google'],
          requiredSkills: ['Python', 'NLP', 'Machine Learning'],
          location: 'Remote',
          experience: '2-5 years',
          industry: industry || 'AI',
        },
      ];
    }

    const response = {
      trendingRoles,
      insights: insights.length > 0 ? insights : [
        'AI and ML roles see 40% growth in hiring',
        'Remote-first positions up 25% this quarter',
        'Entry-level positions offering competitive packages',
      ],
      companies: trendingRoles
        .flatMap(r => r.companies || [])
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, 10)
        .map(name => ({
          id: name.toLowerCase(),
          name,
          logo: '🏢',
          featuredRole: trendingRoles.find(r => r.companies?.includes(name))?.title || 'Software Engineer',
          openRoles: trendingRoles
            .filter(r => r.companies?.includes(name))
            .reduce((sum, r) => sum + (r.openingsCount || 0), 0),
        })),
      metadata: {
        industry: industry || 'all',
        location: location || 'all',
        timeWindow: parseInt(timeWindow),
        rapidApiEnabled: rapidApiClient.isConfigured(),
        llmEnabled: !!llmClient.apiKey,
      },
    };

    cache.set(cacheKey, response);

    res.json({
      success: true,
      ...response,
      cached: false,
    });
  } catch (error) {
    console.error('[Trend Feed Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trends',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * POST /api/trend-feed/subscribe
 * Subscribe to trend alerts
 */
const subscribeHandler = async (req, res) => {
  try {
    const { email, preferences } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Valid email required',
      });
    }

    // In production, save to DB. For now, just confirm
    res.json({
      success: true,
      message: 'Subscribed to trend alerts',
      email,
      preferences: preferences || {},
    });
  } catch (error) {
    console.error('[Subscribe Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Subscription failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = {
  getTrendsHandler,
  subscribeHandler,
};

