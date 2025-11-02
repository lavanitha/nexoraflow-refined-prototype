import { useState, useCallback } from 'react';

// API base URL - must be set via environment variable in production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:3002' : '');

export function useSideHustle() {
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState([]);
  const [error, setError] = useState(null);
  const [rawResponse, setRawResponse] = useState(null);

  const generateIdeas = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    setRawResponse(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/sidehustle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // Store raw response for debugging
        if (data.rawResponse) {
          setRawResponse(data.rawResponse);
        }
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      setIdeas(data.ideas || []);
      return data.ideas || [];
    } catch (err) {
      setError(err.message || 'Failed to generate ideas');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const retry = useCallback((payload) => {
    return generateIdeas(payload);
  }, [generateIdeas]);

  return {
    loading,
    ideas,
    error,
    rawResponse,
    generateIdeas,
    retry,
  };
}

