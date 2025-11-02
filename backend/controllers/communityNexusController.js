const rapidApiClient = require('../utils/rapidApiClient');
const Cache = require('../utils/cache');

const cache = new Cache(30);

/**
 * GET /api/community-nexus/opportunities
 * Search for opportunities (jobs, events, etc.)
 */
const searchOpportunitiesHandler = async (req, res) => {
  try {
    const { query, category, location, limit = 20 } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query required',
      });
    }

    const cacheKey = `opportunities-${query}-${category || 'all'}-${location || 'all'}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ success: true, ...cached, cached: true });
    }

    let opportunities = [];

    if (rapidApiClient.isConfigured()) {
      try {
        const results = await rapidApiClient.searchOpportunities(query, {
          category,
          location: location || 'India',
          limit: parseInt(limit),
        });

        opportunities = results.map(r => ({
          id: r.id || Date.now().toString() + Math.random(),
          title: r.title || query,
          description: r.description || 'No description available',
          company: r.company?.display_name || 'Unknown',
          location: r.location?.display_name || location || 'India',
          salary: r.salary_min || r.salary_max ? {
            min: r.salary_min || 0,
            max: r.salary_max || 0,
          } : null,
          url: r.redirect_url || '#',
          postedAt: r.created || new Date().toISOString(),
          category: r.category?.label || category || 'General',
        }));
      } catch (error) {
        console.error('[Community Nexus RapidAPI Error]:', error.message);
      }
    }

    // Fallback opportunities
    if (opportunities.length === 0) {
      opportunities = [
        {
          id: '1',
          title: query,
          description: `Opportunity related to ${query}`,
          company: 'Tech Company',
          location: location || 'India',
          salary: { min: 500000, max: 1000000 },
          url: '#',
          postedAt: new Date().toISOString(),
          category: category || 'General',
        },
      ];
    }

    cache.set(cacheKey, { opportunities });

    res.json({
      success: true,
      opportunities,
      cached: false,
    });
  } catch (error) {
    console.error('[Search Opportunities Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Opportunity search failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * GET /api/community-nexus/marketplace
 * Get marketplace listings
 */
const getMarketplaceHandler = async (req, res) => {
  try {
    const { category = 'all' } = req.query;

    const cacheKey = `marketplace-${category}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ success: true, ...cached, cached: true });
    }

    // Return marketplace data (could be enriched with external APIs)
    const marketplace = {
      services: [
        {
          id: '1',
          title: 'Freelance Development Services',
          category: 'Services',
          description: 'Connect with skilled developers',
        },
        {
          id: '2',
          title: 'Learning Resources',
          category: 'Resources',
          description: 'Access curated learning materials',
        },
      ],
      events: [
        {
          id: '1',
          title: 'Virtual Networking Mixer',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          attendees: 45,
        },
      ],
    };

    cache.set(cacheKey, marketplace);

    res.json({
      success: true,
      ...marketplace,
      cached: false,
    });
  } catch (error) {
    console.error('[Marketplace Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Marketplace fetch failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = {
  searchOpportunitiesHandler,
  getMarketplaceHandler,
};

