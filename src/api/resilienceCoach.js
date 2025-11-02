const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';

export async function startCoachingSession(input, type = 'general') {
  try {
    const response = await fetch(`${API_BASE_URL}/api/resilience-coach/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, type }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('[Coaching Session Error]:', error.message);
    throw error;
  }
}

export async function getSessions() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/resilience-coach/sessions`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('[Get Sessions Error]:', error.message);
    throw error;
  }
}

export async function createGoal(goal) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/resilience-coach/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goal),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('[Create Goal Error]:', error.message);
    throw error;
  }
}

export async function getGoals() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/resilience-coach/goals`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('[Get Goals Error]:', error.message);
    throw error;
  }
}

export async function runAssessment(answers) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/resilience-coach/assessment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('[Assessment Error]:', error.message);
    throw error;
  }
}

