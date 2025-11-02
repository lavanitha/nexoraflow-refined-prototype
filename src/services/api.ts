import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import type {
  APIResponse,
  DashboardData,
  DashboardMetrics,
  GeminiAdviceRequest,
  GeminiAdviceResponse,
  SideHustleOpportunity,
  Achievement,
  Challenge,
  GamificationStats,
  LearningPath,
  Course,
  LearningAnalytics,
  CommunityMember,
  CommunityEvent,
  ForumPost,
  CommunityChallenge,
  ErrorType
} from '../types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';

// Loading state management
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Global loading state (can be managed by a state management library in the future)
let globalLoadingState: Record<string, LoadingState> = {};

// Loading state helpers
export const getLoadingState = (key: string): LoadingState => {
  return globalLoadingState[key] || { isLoading: false, error: null };
};

export const setLoadingState = (key: string, state: LoadingState): void => {
  globalLoadingState[key] = state;
  // Dispatch custom event for components to listen to
  window.dispatchEvent(new CustomEvent('loadingStateChange', { 
    detail: { key, state } 
  }));
};

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased timeout for better reliability
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens and loading states
apiClient.interceptors.request.use(
  (config) => {
    // Set loading state for the request
    const requestKey = `${config.method?.toUpperCase()}_${config.url}`;
    setLoadingState(requestKey, { isLoading: true, error: null });

    // TODO: Add authentication token when auth is implemented
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    // Add request ID for tracking
    config.headers['X-Request-ID'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors and loading states
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Clear loading state on success
    const requestKey = `${response.config.method?.toUpperCase()}_${response.config.url}`;
    setLoadingState(requestKey, { isLoading: false, error: null });
    
    return response;
  },
  (error: AxiosError) => {
    // Clear loading state and set error
    const requestKey = `${error.config?.method?.toUpperCase()}_${error.config?.url}`;
    let errorMessage = 'An unexpected error occurred';
    let errorType: ErrorType = 'NETWORK_ERROR';

    // Handle different error scenarios
    if (error.response?.status === 401) {
      errorMessage = 'Unauthorized access - please log in';
      errorType = 'AUTHENTICATION_ERROR';
      // TODO: Handle unauthorized access (redirect to login)
      console.error('Unauthorized access - redirect to login');
    } else if (error.response?.status === 403) {
      errorMessage = 'Access forbidden - insufficient permissions';
      errorType = 'AUTHORIZATION_ERROR';
    } else if (error.response?.status === 400) {
      errorMessage = (error.response.data as any)?.error || 'Invalid request';
      errorType = 'VALIDATION_ERROR';
    } else if (error.response?.status === 500) {
      errorMessage = 'Server error - please try again later';
      errorType = 'SERVER_ERROR';
      console.error('Server error:', error.response.data);
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout - please check your connection';
      errorType = 'NETWORK_ERROR';
    } else if (!error.response) {
      errorMessage = 'Network error - server might be down';
      errorType = 'NETWORK_ERROR';
    }

    setLoadingState(requestKey, { isLoading: false, error: errorMessage });

    // Enhance error object with additional information
    const enhancedError = {
      ...error,
      errorType,
      userMessage: errorMessage,
      timestamp: new Date().toISOString(),
    };
    
    return Promise.reject(enhancedError);
  }
);

// Error handling utility
const handleApiError = (error: any, context: string) => {
  console.error(`API Error in ${context}:`, error);
  
  // Log additional error details for debugging
  if (error.response) {
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
  }
  
  throw error;
};

// API Service Functions
export const apiService = {
  // Dashboard API Services
  dashboard: {
    // Get complete dashboard overview data
    getOverview: async (): Promise<DashboardData> => {
      try {
        const response = await apiClient.get<APIResponse<DashboardData>>('/api/dashboard');
        return response.data.data;
      } catch (error) {
        handleApiError(error, 'dashboard.getOverview');
        throw error;
      }
    },

    // Get specific dashboard metrics
    getMetrics: async (): Promise<DashboardMetrics> => {
      try {
        const response = await apiClient.get<APIResponse<DashboardMetrics>>('/api/dashboard/metrics');
        return response.data.data;
      } catch (error) {
        handleApiError(error, 'dashboard.getMetrics');
        throw error;
      }
    },
  },

  // Gemini AI Advice API Services
  advice: {
    // Get AI advice based on context and category
    getAdvice: async (request: GeminiAdviceRequest): Promise<GeminiAdviceResponse> => {
      try {
        const response = await apiClient.post<APIResponse<GeminiAdviceResponse>>('/api/advise', request);
        return response.data.data;
      } catch (error) {
        handleApiError(error, 'advice.getAdvice');
        throw error;
      }
    },

    // Get available advice categories
    getCategories: async (): Promise<Array<{ id: string; name: string; description: string; icon: string }>> => {
      try {
        const response = await apiClient.get<APIResponse<Array<{ id: string; name: string; description: string; icon: string }>>>('/api/advise/categories');
        return response.data.data;
      } catch (error) {
        handleApiError(error, 'advice.getCategories');
        throw error;
      }
    },

    // Placeholder for future Gemini AI integration
    geminiIntegration: {
      // TODO: Implement direct Gemini API integration
      // This will replace the backend placeholder when ready
      callGeminiDirectly: async (_prompt: string, _context: any): Promise<GeminiAdviceResponse> => {
        // Placeholder for direct Gemini API integration
        throw new Error('Direct Gemini integration not yet implemented. Use advice.getAdvice() instead.');
      },
      
      // TODO: Implement conversation history tracking
      getConversationHistory: async (_userId: string): Promise<any[]> => {
        throw new Error('Conversation history not yet implemented');
      },
      
      // TODO: Implement context-aware responses
      getContextualAdvice: async (_userId: string, _conversationId: string, _message: string): Promise<GeminiAdviceResponse> => {
        throw new Error('Contextual advice not yet implemented');
      }
    }
  },

  // Side Hustle Discovery API Services
  sideHustle: {
    // Get side hustle opportunities
    getOpportunities: async (filters?: any): Promise<SideHustleOpportunity[]> => {
      try {
        const response = await apiClient.get<APIResponse<SideHustleOpportunity[]>>('/api/hustle', { params: filters });
        return response.data.data;
      } catch (error) {
        handleApiError(error, 'sideHustle.getOpportunities');
        // Return placeholder data for now
        return [];
      }
    },

    // Get success stories
    getSuccessStories: async (): Promise<any[]> => {
      try {
        const response = await apiClient.get<APIResponse<any[]>>('/api/hustle/stories');
        return response.data.data;
      } catch (error) {
        handleApiError(error, 'sideHustle.getSuccessStories');
        return [];
      }
    },

    // Get personalized recommendations
    getRecommendations: async (userId: string): Promise<SideHustleOpportunity[]> => {
      try {
        const response = await apiClient.get<APIResponse<SideHustleOpportunity[]>>(`/api/hustle/recommendations/${userId}`);
        return response.data.data;
      } catch (error) {
        handleApiError(error, 'sideHustle.getRecommendations');
        return [];
      }
    }
  },

  // AI Resilience Coach API Services
  coaching: {
    // Get coaching overview data
    getOverview: async (): Promise<any> => {
      try {
        const response = await apiClient.get<APIResponse<any>>('/api/coaching');
        return response.data.data;
      } catch (error) {
        handleApiError(error, 'coaching.getOverview');
        throw error;
      }
    },

    // Get coaching sessions
    getSessions: async (userId: string): Promise<any[]> => {
      try {
        const response = await apiClient.get<APIResponse<any[]>>(`/api/coaching/sessions/${userId}`);
        return response.data.data;
      } catch (error) {
        handleApiError(error, 'coaching.getSessions');
        return [];
      }
    },

    // Get progress tracking data
    getProgress: async (userId: string): Promise<any> => {
      try {
        const response = await apiClient.get<APIResponse<any>>(`/api/coaching/progress/${userId}`);
        return response.data.data;
      } catch (error) {
        handleApiError(error, 'coaching.getProgress');
        return {};
      }
    },

    // Start a new coaching session
    startSession: async (userId: string, sessionType: string): Promise<any> => {
      try {
        const response = await apiClient.post<APIResponse<any>>('/api/coaching/session', { userId, sessionType });
        return response.data.data;
      } catch (error) {
        handleApiError(error, 'coaching.startSession');
        throw error;
      }
    }
  },

  // Achievement Gamification API Services
  achievement: {
    // Get achievement overview data
    getOverview: async (): Promise<any> => {
      try {
        const response = await apiClient.get<APIResponse<any>>('/api/achievement');
        return response.data.data;
      } catch (error) {
        handleApiError(error, 'achievement.getOverview');
        throw error;
      }
    },

    // Get user achievements
    getAchievements: async (userId: string): Promise<Achievement[]> => {
      try {
        const response = await apiClient.get<APIResponse<Achievement[]>>(`/api/achievement/badges/${userId}`);
        return response.data.data;
      } catch (error) {
        handleApiError(error, 'achievement.getAchievements');
        return [];
      }
    },

    // Get active challenges
    getChallenges: async (): Promise<Challenge[]> => {
      try {
        const response = await apiClient.get<APIResponse<Challenge[]>>('/api/achievement/challenges');
        return response.data.data;
      } catch (error) {
        handleApiError(error, 'achievement.getChallenges');
        return [];
      }
    },

    // Get leaderboard
    getLeaderboard: async (category?: string): Promise<any[]> => {
      try {
        const response = await apiClient.get<APIResponse<any[]>>('/api/achievement/leaderboard', { params: { category } });
        return response.data.data;
      } catch (error) {
        handleApiError(error, 'achievement.getLeaderboard');
        return [];
      }
    },

    // Get gamification stats
    getStats: async (userId: string): Promise<GamificationStats> => {
      try {
        const response = await apiClient.get<APIResponse<GamificationStats>>(`/api/achievement/stats/${userId}`);
        return response.data.data;
      } catch (error) {
        handleApiError(error, 'achievement.getStats');
        throw error;
      }
    }
  },

  // Adaptive Learning API Services
  learning: {
    // Get learning overview data
    getOverview: async (): Promise<any> => {
      try {
        const response = await apiClient.get<APIResponse<any>>('/api/learning');
        return response.data.data;
      } catch (error) {
        handleApiError(error, 'learning.getOverview');
        throw error;
      }
    },

    // Get learning paths
    getPaths: async (userId: string): Promise<LearningPath[]> => {
      try {
        const response = await apiClient.get<APIResponse<LearningPath[]>>(`/api/learning/paths/${userId}`);
        return response.data.data;
      } catch (error) {
        handleApiError(error, 'learning.getPaths');
        return [];
      }
    },

    // Get recommended courses
    getCourses: async (filters?: any): Promise<Course[]> => {
      try {
        const response = await apiClient.get<APIResponse<Course[]>>('/api/learning/courses', { params: filters });
        return response.data.data;
      } catch (error) {
        handleApiError(error, 'learning.getCourses');
        return [];
      }
    },

    // Get learning analytics
    getAnalytics: async (userId: string): Promise<LearningAnalytics> => {
      try {
        const response = await apiClient.get<APIResponse<LearningAnalytics>>(`/api/learning/analytics/${userId}`);
        return response.data.data;
      } catch (error) {
        handleApiError(error, 'learning.getAnalytics');
        throw error;
      }
    },

    // Get skill assessments
    getSkillAssessments: async (userId: string): Promise<any[]> => {
      try {
        const response = await apiClient.get<APIResponse<any[]>>(`/api/learning/assessments/${userId}`);
        return response.data.data;
      } catch (error) {
        handleApiError(error, 'learning.getSkillAssessments');
        return [];
      }
    },

    // Enroll in a course
    enrollCourse: async (userId: string, courseId: string): Promise<any> => {
      try {
        const response = await apiClient.post<APIResponse<any>>('/api/learning/enroll', { userId, courseId });
        return response.data.data;
      } catch (error) {
        handleApiError(error, 'learning.enrollCourse');
        throw error;
      }
    }
  },

  // Community Nexus API Services
  community: {
    // Get community overview data
    getOverview: async (): Promise<any> => {
      try {
        const response = await apiClient.get<APIResponse<any>>('/api/community');
        return response.data.data;
      } catch (error) {
        handleApiError(error, 'community.getOverview');
        throw error;
      }
    },

    // Get community members
    getMembers: async (filters?: any): Promise<CommunityMember[]> => {
      try {
        const response = await apiClient.get<APIResponse<CommunityMember[]>>('/api/community/members', { params: filters });
        return response.data.data;
      } catch (error) {
        handleApiError(error, 'community.getMembers');
        return [];
      }
    },

    // Get community events
    getEvents: async (filters?: any): Promise<CommunityEvent[]> => {
      try {
        const response = await apiClient.get<APIResponse<CommunityEvent[]>>('/api/community/events', { params: filters });
        return response.data.data;
      } catch (error) {
        handleApiError(error, 'community.getEvents');
        return [];
      }
    },

    // Get forum posts
    getForumPosts: async (category?: string): Promise<ForumPost[]> => {
      try {
        const response = await apiClient.get<APIResponse<ForumPost[]>>('/api/community/forum', { params: { category } });
        return response.data.data;
      } catch (error) {
        handleApiError(error, 'community.getForumPosts');
        return [];
      }
    },

    // Get community challenges
    getChallenges: async (): Promise<CommunityChallenge[]> => {
      try {
        const response = await apiClient.get<APIResponse<CommunityChallenge[]>>('/api/community/challenges');
        return response.data.data;
      } catch (error) {
        handleApiError(error, 'community.getChallenges');
        return [];
      }
    },

    // Connect with a member
    connectWithMember: async (userId: string, targetUserId: string, message?: string): Promise<any> => {
      try {
        const response = await apiClient.post<APIResponse<any>>('/api/community/connect', { userId, targetUserId, message });
        return response.data.data;
      } catch (error) {
        handleApiError(error, 'community.connectWithMember');
        throw error;
      }
    },

    // Join an event
    joinEvent: async (userId: string, eventId: string): Promise<any> => {
      try {
        const response = await apiClient.post<APIResponse<any>>('/api/community/events/join', { userId, eventId });
        return response.data.data;
      } catch (error) {
        handleApiError(error, 'community.joinEvent');
        throw error;
      }
    }
  },

  // Utility functions for API management
  utils: {
    // Get loading state for a specific API call
    getLoadingState: (endpoint: string, method: string = 'GET'): LoadingState => {
      return getLoadingState(`${method.toUpperCase()}_${endpoint}`);
    },

    // Clear all loading states
    clearAllLoadingStates: (): void => {
      globalLoadingState = {};
      window.dispatchEvent(new CustomEvent('loadingStateChange', { 
        detail: { key: 'all', state: { isLoading: false, error: null } } 
      }));
    },

    // Test API connectivity
    testConnection: async (): Promise<boolean> => {
      try {
        await apiClient.get('/api/health');
        return true;
      } catch (error) {
        console.error('API connection test failed:', error);
        return false;
      }
    },

    // Get API base URL
    getBaseURL: (): string => {
      return API_BASE_URL;
    }
  }
};

export default apiClient;