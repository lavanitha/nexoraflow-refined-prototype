const skillEmbeddings = require('./skillEmbeddings');

/**
 * Skill Engine utility
 * Computes clusters, radial coordinates, and simulates skill updates
 */
class SkillEngine {
  /**
   * Group skills into clusters using embeddings
   */
  async computeClusters(skills) {
    try {
      const embeddings = await skillEmbeddings.generateEmbeddings(skills);
      
      // Simple k-means clustering (k = number of categories or 5)
      const categories = [...new Set(skills.map(s => s.category))];
      const clusters = {};

      categories.forEach((category, idx) => {
        clusters[category] = {
          id: category.toLowerCase().replace(/\s+/g, '-'),
          name: category,
          angle: (idx / categories.length) * 2 * Math.PI - Math.PI / 2,
          skills: skills.filter(s => s.category === category).map(s => s.id),
        };
      });

      return { clusters, embeddings };
    } catch (error) {
      console.error('[Cluster Error]:', error.message);
      // Fallback: use categories as clusters
      const categories = [...new Set(skills.map(s => s.category))];
      const clusters = {};
      categories.forEach((category, idx) => {
        clusters[category] = {
          id: category.toLowerCase().replace(/\s+/g, '-'),
          name: category,
          angle: (idx / categories.length) * 2 * Math.PI - Math.PI / 2,
          skills: skills.filter(s => s.category === category).map(s => s.id),
        };
      });
      return { clusters, embeddings: {} };
    }
  }

  /**
   * Compute radial coordinates for skills
   * angle = cluster angle, radius = proficiency (normalized 0-1)
   */
  computeRadialCoords(skills, clusters) {
    const coords = {};

    skills.forEach(skill => {
      const cluster = Object.values(clusters).find(c => c.skills.includes(skill.id));
      const angle = cluster ? cluster.angle : 0;
      const radius = skill.proficiency / 100; // Normalize to 0-1
      
      coords[skill.id] = {
        angle,
        radius,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      };
    });

    return coords;
  }

  /**
   * Generate matrix data (skill category positions)
   */
  computeMatrixData(skills, clusters) {
    const matrixData = {};

    skills.forEach(skill => {
      const cluster = Object.values(clusters).find(c => c.skills.includes(skill.id));
      const categoryIndex = Object.keys(clusters).indexOf(cluster?.name || skill.category);
      const categoryCount = Object.keys(clusters).length;
      
      matrixData[skill.id] = {
        categoryIndex,
        categoryCount,
        proficiency: skill.proficiency,
        level: skill.proficiency < 40 ? 'beginner' : skill.proficiency < 70 ? 'intermediate' : 'expert',
      };
    });

    return matrixData;
  }

  /**
   * Simulate MicroLearn action (+2 proficiency)
   */
  simulateMicroLearn(skills, skillIds = null) {
    const updatedSkills = skills.map(skill => {
      if (!skillIds || skillIds.includes(skill.id)) {
        return {
          ...skill,
          proficiency: Math.min(100, skill.proficiency + 2),
        };
      }
      return skill;
    });

    return updatedSkills;
  }

  /**
   * Simulate Generate Pathway (projected growth timeline)
   */
  simulatePathway(skills, months = 24) {
    // Generate projected growth for each skill
    const timeline = [];
    const projectedSkills = skills.map(skill => {
      // Project growth: lower skills grow faster
      const growthRate = skill.proficiency < 40 ? 0.5 : skill.proficiency < 70 ? 0.3 : 0.15; // % per month
      const projectedProficiency = Math.min(100, skill.proficiency + (growthRate * months));

      return {
        ...skill,
        projectedProficiency: Math.round(projectedProficiency),
        growthRate,
      };
    });

    // Generate monthly timeline
    for (let month = 0; month <= months; month += 3) {
      const monthSkills = projectedSkills.map(skill => ({
        id: skill.id,
        proficiency: Math.min(100, Math.round(skill.proficiency + (skill.growthRate * month))),
      }));

      timeline.push({
        month,
        skills: monthSkills,
        avgProficiency: Math.round(
          monthSkills.reduce((sum, s) => sum + s.proficiency, 0) / monthSkills.length
        ),
      });
    }

    return {
      projectedSkills,
      timeline,
    };
  }

  /**
   * Compute top opportunity based on skill strengths
   */
  computeTopOpportunity(skills) {
    // Simple heuristic: career with most matching high-proficiency skills
    const careerMatches = {
      'Frontend Engineer': ['JavaScript', 'React', 'HTML', 'CSS'],
      'Backend Engineer': ['Node.js', 'SQL', 'API', 'Database'],
      'Full Stack Developer': ['JavaScript', 'React', 'Node.js', 'SQL'],
      'Data Scientist': ['Python', 'SQL', 'Machine Learning', 'Data'],
      'DevOps Engineer': ['Cloud', 'Docker', 'CI/CD', 'Infrastructure'],
    };

    let bestCareer = 'Frontend Engineer';
    let bestScore = 0;

    Object.entries(careerMatches).forEach(([career, requiredSkills]) => {
      const score = skills.reduce((sum, skill) => {
        const match = requiredSkills.some(req => 
          skill.name.toLowerCase().includes(req.toLowerCase()) ||
          req.toLowerCase().includes(skill.name.toLowerCase())
        );
        return sum + (match ? skill.proficiency : 0);
      }, 0);

      if (score > bestScore) {
        bestScore = score;
        bestCareer = career;
      }
    });

    return bestCareer;
  }

  /**
   * Compute gap radar (top skill gaps)
   */
  computeGapRadar(skills, targetCareer = null) {
    const sorted = [...skills].sort((a, b) => a.proficiency - b.proficiency);
    return sorted.slice(0, 3).map(skill => ({
      name: skill.name,
      gap: Math.max(0, 70 - skill.proficiency), // Gap to reach 70% proficiency
      currentProficiency: skill.proficiency,
    }));
  }
}

module.exports = new SkillEngine();

