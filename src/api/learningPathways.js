// API base URL - must be set via environment variable in production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:3002' : '');

export async function getPathways() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/learning-pathways`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('[Get Pathways Error]:', error.message);
    throw error;
  }
}

export async function generatePathway(skills, goals, timeframe) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/learning-pathways/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills, goals, timeframe }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('[Generate Pathway Error]:', error.message);
    throw error;
  }
}

export async function generateMicroLearn(skill, context) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/learning-pathways/micro-learn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skill, context }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('[MicroLearn Error]:', error.message);
    throw error;
  }
}

