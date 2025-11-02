// API base URL - must be set via environment variable in production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:3002' : '');

export async function projectEvolution(params) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/predictive-evolution/project`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('[Predictive Evolution Error]:', error.message);
    throw error;
  }
}

export async function exportProjection(data, format = 'json') {
  try {
    const response = await fetch(`${API_BASE_URL}/api/predictive-evolution/export?format=${format}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ format, data }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    if (format === 'csv') {
      const blob = await response.blob();
      return blob;
    }
    return await response.json();
  } catch (error) {
    console.error('[Export Error]:', error.message);
    throw error;
  }
}

