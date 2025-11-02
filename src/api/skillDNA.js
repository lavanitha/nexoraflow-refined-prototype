/**
 * Skill DNA API Helper
 * Handles API calls for skill DNA mapping
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';

/**
 * Fetch skill profile
 */
export async function fetchSkillProfile() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/skill-dna/profile`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[Skill DNA Profile Error]:', error.message);
    throw error;
  }
}

/**
 * Simulate action (microlearn or generatePathway)
 */
export async function simulateSkillDNA(action, payload = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/skill-dna/simulate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, payload }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[Skill DNA Simulate Error]:', error.message);
    throw error;
  }
}

/**
 * Generate embeddings (optional)
 */
export async function generateEmbeddings(skills) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/skill-dna/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ skills }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[Skill DNA Embeddings Error]:', error.message);
    throw error;
  }
}

/**
 * Generate micro-learn suggestions (frontend helper)
 * This calls the backend embeddings utility
 */
export const skillEmbeddings = {
  async generateMicroLearns(skillName, skillCategory) {
    // For now, return deterministic suggestions
    // In production, this could call the backend embeddings endpoint
    return [
      `Complete ${skillName} fundamentals tutorial`,
      `Build a project using ${skillName}`,
      `Join ${skillName} community and practice`,
    ];
  },
};

