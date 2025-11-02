import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import type { LoadingState } from '../services/api';

// Generic hook for API calls with loading states
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = [],
  options: {
    immediate?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
  } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { immediate = true, onSuccess, onError } = options;

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.userMessage || err.message || 'An error occurred';
      setError(errorMessage);
      onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  const refetch = useCallback(() => {
    return execute();
  }, [execute]);

  return {
    data,
    loading,
    error,
    refetch,
    execute
  };
}

// Hook for managing global loading states
export function useLoadingState(key: string) {
  const [loadingState, setLoadingState] = useState<LoadingState>({ isLoading: false, error: null });

  useEffect(() => {
    const handleLoadingStateChange = (event: CustomEvent) => {
      if (event.detail.key === key || event.detail.key === 'all') {
        setLoadingState(event.detail.state);
      }
    };

    window.addEventListener('loadingStateChange', handleLoadingStateChange as EventListener);
    
    return () => {
      window.removeEventListener('loadingStateChange', handleLoadingStateChange as EventListener);
    };
  }, [key]);

  return loadingState;
}

// Specific hooks for each API service
export function useDashboard() {
  return useApi(() => apiService.dashboard.getOverview());
}

export function useDashboardMetrics() {
  return useApi(() => apiService.dashboard.getMetrics());
}

export function useAdviceCategories() {
  return useApi(() => apiService.advice.getCategories());
}

export function useCoachingData() {
  return useApi(() => apiService.coaching.getOverview());
}

export function useAchievementData() {
  return useApi(() => apiService.achievement.getOverview());
}

export function useLearningData() {
  return useApi(() => apiService.learning.getOverview());
}

export function useCommunityData() {
  return useApi(() => apiService.community.getOverview());
}

// Hook for making advice requests
export function useAdviceRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestAdvice = useCallback(async (request: {
    userId: string;
    context: string;
    category: 'coaching' | 'learning' | 'hustle' | 'achievement';
  }) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.advice.getAdvice(request);
      return result;
    } catch (err: any) {
      const errorMessage = err.userMessage || err.message || 'Failed to get advice';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    requestAdvice,
    loading,
    error
  };
}

// Hook for managing user connections
export function useUserConnection() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWithUser = useCallback(async (userId: string, targetUserId: string, message?: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.community.connectWithMember(userId, targetUserId, message);
      return result;
    } catch (err: any) {
      const errorMessage = err.userMessage || err.message || 'Failed to connect with user';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    connectWithUser,
    loading,
    error
  };
}

// Hook for course enrollment
export function useCourseEnrollment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enrollInCourse = useCallback(async (userId: string, courseId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.learning.enrollCourse(userId, courseId);
      return result;
    } catch (err: any) {
      const errorMessage = err.userMessage || err.message || 'Failed to enroll in course';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    enrollInCourse,
    loading,
    error
  };
}

// Hook for event participation
export function useEventParticipation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinEvent = useCallback(async (userId: string, eventId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.community.joinEvent(userId, eventId);
      return result;
    } catch (err: any) {
      const errorMessage = err.userMessage || err.message || 'Failed to join event';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    joinEvent,
    loading,
    error
  };
}