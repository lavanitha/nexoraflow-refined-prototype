const llmClient = require('../utils/llmClient');
const rapidApiClient = require('../utils/rapidApiClient');
const Cache = require('../utils/cache');

const cache = new Cache(60); // 1 hour TTL

/**
 * POST /api/predictive-evolution/project
 * Generate career evolution projections
 */
const projectEvolutionHandler = async (req, res) => {
  try {
    const { careerId, experienceLevel, projectionWindow, skills } = req.body;

    if (!careerId || !projectionWindow) {
      return res.status(400).json({
        success: false,
        message: 'careerId and projectionWindow required',
      });
    }

    const cacheKey = `evolution-${careerId}-${experienceLevel || 50}-${projectionWindow}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ success: true, ...cached, cached: true });
    }

    // Get base data for career
    let baseSalary = 860000;
    let projectedSalary = 1320000;
    let openings = 12400;

    // Enrich with RapidAPI if available
    if (rapidApiClient.isConfigured()) {
      try {
        const salaryData = await rapidApiClient.getSalaryData(careerId, 'India');
        if (salaryData.avg > 0) {
          baseSalary = salaryData.avg;
          projectedSalary = Math.round(salaryData.avg * 1.5);
        }

        const jobData = await rapidApiClient.getJobTrends(careerId, 'India', 1);
        if (jobData.count > 0) {
          openings = jobData.count;
        }
      } catch (error) {
        console.error('[Predictive Evolution RapidAPI Error]:', error.message);
      }
    }

    // Use LLM to generate projections if available
    let skillData = [];
    let salaryData = [];

    if (llmClient.apiKey) {
      try {
        const prompt = `Generate a ${projectionWindow}-year career projection for ${careerId} role starting at ${experienceLevel || 50}% experience level. Return JSON with: skillData (array of ${projectionWindow + 1} numbers representing skill level each year), salaryData (array of ${projectionWindow + 1} numbers representing salary in lakhs INR each year), skillGrowth (percentage), and insights (array of 3-5 strings). Base salary: ${baseSalary / 100000}L.`;

        const response = await llmClient.callLLM(prompt);
        if (response.skillData && Array.isArray(response.skillData)) {
          skillData = response.skillData;
        }
        if (response.salaryData && Array.isArray(response.salaryData)) {
          salaryData = response.salaryData.map(s => s * 100000); // Convert to actual INR
        }
      } catch (error) {
        console.error('[Predictive Evolution LLM Error]:', error.message);
      }
    }

    // Fallback calculation if LLM not available
    if (skillData.length === 0) {
      const skillStart = 60 + ((experienceLevel || 50) / 100) * 20;
      const skillEnd = Math.min(99, skillStart + 30);
      for (let i = 0; i <= projectionWindow; i++) {
        const progress = i / projectionWindow;
        skillData.push(Math.round(skillStart + (skillEnd - skillStart) * progress));
      }
    }

    if (salaryData.length === 0) {
      const salaryEnd = projectedSalary;
      for (let i = 0; i <= projectionWindow; i++) {
        const progress = i / projectionWindow;
        salaryData.push(Math.round(baseSalary + (salaryEnd - baseSalary) * progress));
      }
    }

    const skillGrowth = skillData.length > 1 
      ? Math.round(((skillData[skillData.length - 1] - skillData[0]) / skillData[0]) * 100)
      : 52;

    const response = {
      career: {
        id: careerId,
        title: careerId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        baseSalary,
        projectedSalary: salaryData[salaryData.length - 1] || projectedSalary,
        skillGrowth,
        openings,
        skillData,
        salaryData,
      },
      insights: [
        `Projected ${skillGrowth}% skill growth over ${projectionWindow} years`,
        `Salary potential increases to ₹${(salaryData[salaryData.length - 1] / 100000).toFixed(1)}L`,
        `${openings.toLocaleString()} active openings in current market`,
      ],
      projectionWindow: parseInt(projectionWindow),
    };

    cache.set(cacheKey, response);

    res.json({
      success: true,
      ...response,
      cached: false,
    });
  } catch (error) {
    console.error('[Predictive Evolution Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Projection failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * POST /api/predictive-evolution/export
 * Export projection data as CSV/JSON
 */
const exportProjectionHandler = async (req, res) => {
  try {
    const { format = 'json', data } = req.body;

    if (!data || !data.career) {
      return res.status(400).json({
        success: false,
        message: 'Projection data required',
      });
    }

    if (format === 'csv') {
      // Generate CSV
      const csv = [
        'Year,Skill Level,Salary (INR)',
        ...data.career.skillData.map((_, i) => 
          `${i},${data.career.skillData[i]},${data.career.salaryData[i]}`
        ),
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=career-projection-${data.career.id}.csv`);
      return res.send(csv);
    }

    // Return JSON
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('[Export Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Export failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = {
  projectEvolutionHandler,
  exportProjectionHandler,
};

