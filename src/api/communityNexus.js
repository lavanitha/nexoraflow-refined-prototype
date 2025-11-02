const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';

export async function searchOpportunities(query, filters = {}) {
  try {
    const params = new URLSearchParams({
      query,
      ...(filters.category && { category: filters.category }),
      ...(filters.location && { location: filters.location }),
      limit: filters.limit || 20,
    });

    const response = await fetch(`${API_BASE_URL}/api/community-nexus/opportunities?${params}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('[Search Opportunities Error]:', error.message);
    throw error;
  }
}

export async function getMarketplace(category = 'all') {
  try {
    const response = await fetch(`${API_BASE_URL}/api/community-nexus/marketplace?category=${category}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('[Get Marketplace Error]:', error.message);
    throw error;
  }
}

