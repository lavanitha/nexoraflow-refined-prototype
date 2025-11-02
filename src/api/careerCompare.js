/**
 * Career Compare API Helper
 * Calls the backend career-twin endpoints with proper error handling
 */

// API base URL - must be set via environment variable in production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:3002' : '');

/**
 * Run career twin simulation
 * @param {Object} payload - Simulation parameters
 * @param {string} payload.career1 - First career name
 * @param {string} payload.career2 - Second career name
 * @param {number} payload.timelineYears - Timeline in years (0.5-10)
 * @param {number} payload.resolutionMonths - Resolution in months (1-120)
 * @param {Array<{name: string, score: number}>} payload.userSkills - User skills array
 * @param {string} [payload.location] - Optional location
 * @param {number} [payload.experienceYears] - Optional experience years
 * @param {string} [payload.userId] - Optional user ID
 * @returns {Promise<Object>} Simulation result
 */
export async function compareCareers(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/career-twin/simulate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[Career Twin Simulation Error]:', error.message);
    throw error;
  }
}

/**
 * Save comparison to database
 * @param {Object} payload - Saved comparison data {userId, career1, career2, simulationResult, metadata}
 * @returns {Promise<Object>} Save result
 */
export async function saveComparison(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/career-twin/history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Save failed' }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[Save Comparison Error]:', error.message);
    throw error;
  }
}

/**
 * Get comparison history
 * @param {string} userId - User ID
 * @returns {Promise<Object>} History result
 */
export async function getHistory(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/career-twin/history?userId=${encodeURIComponent(userId)}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'History fetch failed' }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[Get History Error]:', error.message);
    throw error;
  }
}

/**
 * Get job enrichment data for a career
 * @param {string} career - Career name
 * @param {string} location - Location (optional)
 * @returns {Promise<Object>} Job data result
 */
export async function getJobData(career, location = 'India') {
  try {
    const response = await fetch(`${API_BASE_URL}/api/career-twin/jobs?career=${encodeURIComponent(career)}&location=${encodeURIComponent(location)}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Job data fetch failed' }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[Get Job Data Error]:', error.message);
    throw error;
  }
}

/**
 * Check API health
 * @returns {Promise<Object>} Health status
 */
export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/compare/health`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[Health Check Error]:', error.message);
    return { ok: false, error: error.message };
  }
}

