const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';

export async function fetchTrends(params = {}) {
  try {
    const queryParams = new URLSearchParams({
      industry: params.industry || 'all',
      location: params.location || 'all',
      timeWindow: params.timeWindow || 30,
    });

    const response = await fetch(`${API_BASE_URL}/api/trend-feed/trends?${queryParams}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('[Trend Feed Error]:', error.message);
    throw error;
  }
}

export async function subscribeToTrends(email, preferences = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/trend-feed/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, preferences }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('[Subscribe Error]:', error.message);
    throw error;
  }
}

