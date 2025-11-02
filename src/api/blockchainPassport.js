// API base URL - must be set via environment variable in production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:3002' : '');

export async function getRecords() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blockchain-passport/records`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('[Get Records Error]:', error.message);
    throw error;
  }
}

export async function verifyRecord(record) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blockchain-passport/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('[Verify Record Error]:', error.message);
    throw error;
  }
}

export async function exportPassport(format = 'json') {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blockchain-passport/export?format=${format}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    if (format === 'json') {
      return await response.json();
    }
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('[Export Passport Error]:', error.message);
    throw error;
  }
}

