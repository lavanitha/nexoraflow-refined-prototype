import { useState, useCallback } from 'react';

// API base URL - must be set via environment variable in production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:3002' : '');

export function useSkillDNA() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/skill-dna/profile`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setProfile(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load skill profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const simulate = useCallback(async (action, payload = {}) => {
    setLoading(true);
    setError(null);

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

      const data = await response.json();
      
      // Refresh profile after simulation
      await fetchProfile();
      
      return data;
    } catch (err) {
      setError(err.message || 'Simulation failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  return {
    loading,
    profile,
    error,
    fetchProfile,
    simulate,
  };
}

