const skillEngine = require('../utils/skillEngine');
const skillEmbeddings = require('../utils/skillEmbeddings');
const Cache = require('../utils/cache');

// Initialize cache with 10 minute TTL
const cache = new Cache(10);

/**
 * GET /api/skill-dna/profile
 * Returns skill profile with clusters, radial coords, matrix data, snapshot
 */
const getProfileHandler = async (req, res) => {
  try {
    // Check cache
    const cacheKey = 'skill-dna-profile';
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log('[SkillDNA] Profile cache hit');
      return res.json({
        success: true,
        ...cached,
        cached: true,
      });
    }

    // Demo skills data (in production, this would come from DB)
    const demoSkills = [
      { id: 'js', name: 'JavaScript', category: 'Core', proficiency: 75, exp: 2.5 },
      { id: 'react', name: 'React', category: 'Framework', proficiency: 70, exp: 2 },
      { id: 'sql', name: 'SQL', category: 'Database', proficiency: 45, exp: 1 },
      { id: 'ml', name: 'Machine Learning', category: 'Advanced', proficiency: 30, exp: 0.5 },
      { id: 'cloud', name: 'Cloud (AWS)', category: 'Platform', proficiency: 50, exp: 1.5 },
      { id: 'communication', name: 'Communication', category: 'Communication', proficiency: 65, exp: 3 },
      { id: 'data-structures', name: 'Data Structures', category: 'Foundational', proficiency: 58, exp: 1 },
    ];

    // Compute clusters and embeddings
    const { clusters, embeddings } = await skillEngine.computeClusters(demoSkills);

    // Compute radial coordinates
    const radialCoords = skillEngine.computeRadialCoords(demoSkills, clusters);

    // Compute matrix data
    const matrixData = skillEngine.computeMatrixData(demoSkills, clusters);

    // Compute snapshot
    const topOpportunity = skillEngine.computeTopOpportunity(demoSkills);
    const gapRadar = skillEngine.computeGapRadar(demoSkills, topOpportunity);

    // Enrich skills with related skills using embeddings
    const enrichedSkills = await Promise.all(
      demoSkills.map(async (skill) => {
        let relatedSkills = [];
        if (Object.keys(embeddings).length > 0) {
          try {
            relatedSkills = await skillEmbeddings.findRelatedSkills(skill.id, demoSkills, embeddings, 3);
          } catch (e) {
            // Fallback to category-based
            relatedSkills = demoSkills
              .filter(s => s.category === skill.category && s.id !== skill.id)
              .map(s => s.name)
              .slice(0, 3);
          }
        } else {
          // Fallback to category-based
          relatedSkills = demoSkills
            .filter(s => s.category === skill.category && s.id !== skill.id)
            .map(s => s.name)
            .slice(0, 3);
        }

        return {
          ...skill,
          related: relatedSkills,
          pinned: false,
        };
      })
    );

    const response = {
      skills: enrichedSkills,
      radialCoords,
      matrixData,
      clusters: Object.values(clusters),
      snapshot: {
        topOpportunity,
        gapRadar,
        totalSkills: enrichedSkills.length,
        avgProficiency: Math.round(
          enrichedSkills.reduce((sum, s) => sum + s.proficiency, 0) / enrichedSkills.length
        ),
      },
    };

    // Cache result
    cache.set(cacheKey, response);

    res.json({
      success: true,
      ...response,
      cached: false,
    });
  } catch (error) {
    console.error('[Profile Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to load skill profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * POST /api/skill-dna/simulate
 * Simulates MicroLearn or GeneratePathway actions
 */
const simulateHandler = async (req, res) => {
  try {
    const { action, payload } = req.body;

    if (!action || !['microlearn', 'generatePathway'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Must be "microlearn" or "generatePathway"',
      });
    }

    // Get current profile (from cache or regenerate)
    let currentSkills = cache.get('skill-dna-profile')?.skills || [];
    if (currentSkills.length === 0) {
      // If no cached profile, return error (should call profile first)
      return res.status(400).json({
        success: false,
        message: 'No profile data available. Call /api/skill-dna/profile first.',
      });
    }

    let updatedSkills;
    let result = {};

    if (action === 'microlearn') {
      // Apply +2 proficiency
      const skillIds = payload?.skillIds || payload?.skillId ? [payload.skillId] : null;
      updatedSkills = skillEngine.simulateMicroLearn(currentSkills, skillIds);

      result = {
        action: 'microlearn',
        updatedSkills: updatedSkills.map(s => ({
          id: s.id,
          proficiency: s.proficiency,
        })),
      };
    } else if (action === 'generatePathway') {
      // Generate pathway
      const months = payload?.months || 24;
      const pathway = skillEngine.simulatePathway(currentSkills, months);

      updatedSkills = pathway.projectedSkills;
      result = {
        action: 'generatePathway',
        timeline: pathway.timeline,
        projectedSkills: pathway.projectedSkills.map(s => ({
          id: s.id,
          proficiency: s.proficiency,
          projectedProficiency: s.projectedProficiency,
        })),
      };
    }

    // Update cache with new skills
    const cachedProfile = cache.get('skill-dna-profile');
    if (cachedProfile) {
      const { clusters } = await skillEngine.computeClusters(updatedSkills);
      const radialCoords = skillEngine.computeRadialCoords(updatedSkills, clusters);
      const matrixData = skillEngine.computeMatrixData(updatedSkills, clusters);
      const topOpportunity = skillEngine.computeTopOpportunity(updatedSkills);
      const gapRadar = skillEngine.computeGapRadar(updatedSkills, topOpportunity);

      // Re-enrich with related skills
      const enrichedSkills = await Promise.all(
        updatedSkills.map(async (skill) => {
          const originalSkill = currentSkills.find(s => s.id === skill.id);
          return {
            ...skill,
            related: originalSkill?.related || [],
            pinned: originalSkill?.pinned || false,
          };
        })
      );

      cache.set('skill-dna-profile', {
        skills: enrichedSkills,
        radialCoords,
        matrixData,
        clusters: Object.values(clusters),
        snapshot: {
          topOpportunity,
          gapRadar,
          totalSkills: enrichedSkills.length,
          avgProficiency: Math.round(
            enrichedSkills.reduce((sum, s) => sum + s.proficiency, 0) / enrichedSkills.length
          ),
        },
      });
    }

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('[Simulate Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Simulation failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * POST /api/skill-dna/embeddings (optional)
 * Generate embeddings for skills
 */
const embeddingsHandler = async (req, res) => {
  try {
    const { skills } = req.body;

    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        message: 'skills array required',
      });
    }

    const embeddings = await skillEmbeddings.generateEmbeddings(skills);

    res.json({
      success: true,
      embeddings,
    });
  } catch (error) {
    console.error('[Embeddings Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate embeddings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = {
  getProfileHandler,
  simulateHandler,
  embeddingsHandler,
};

