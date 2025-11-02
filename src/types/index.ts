// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: UserPreferences;
  stats: UserStats;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
}

export interface UserStats {
  totalAchievements: number;
  learningProgress: number;
  communityRank: number;
  coachingSessions: number;
}

// Dashboard Types
export interface DashboardData {
  metrics: DashboardMetrics;
  recentActivity: ActivityItem[];
  recommendations: Recommendation[];
  quickActions: QuickAction[];
}

export interface DashboardMetrics {
  totalProgress: number;
  activeGoals: number;
  completedTasks: number;
  communityConnections: number;
}

export interface ActivityItem {
  id: number;
  type: 'achievement' | 'community' | 'learning' | 'coaching';
  message: string;
  timestamp: Date;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
}

// API Types
export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface GeminiAdviceRequest {
  userId: string;
  context: string;
  category: 'coaching' | 'learning' | 'hustle' | 'achievement';
}

export interface GeminiAdviceResponse {
  advice: string;
  confidence: number;
  suggestions: string[];
  followUpQuestions: string[];
}

// Component Props Types
export interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

// Side Hustle Types
export interface SideHustleOpportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  timeCommitment: string;
  earningPotential: {
    min: number;
    max: number;
    period: 'hour' | 'week' | 'month';
  };
  startupCost: {
    amount: string;
    level: 'Low' | 'Medium' | 'High';
  };
  requiredSkills: string[];
  matchScore: number;
  icon: string;
}

export interface SideHustleFilters {
  category: string;
  timeCommitment: string;
  earningPotential: string;
  skillLevel: string;
}

export interface SuccessStory {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  story: string;
  earnings: string;
  timeframe: string;
  category: string;
}

// Achievement and Gamification Types
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: Date;
  category: 'coaching' | 'learning' | 'community' | 'hustle' | 'general';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  reward: string;
  xpReward: number;
  deadline?: Date;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isActive: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  points: number;
  level: number;
  isCurrentUser: boolean;
  badge?: string;
}

export interface UserLevel {
  level: number;
  title: string;
  currentXP: number;
  requiredXP: number;
  progressPercentage: number;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  category: 'cosmetic' | 'feature' | 'discount' | 'exclusive';
  available: boolean;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface GamificationStats {
  totalXP: number;
  level: UserLevel;
  achievementsEarned: number;
  totalAchievements: number;
  challengesCompleted: number;
  activeChallenges: number;
  leaderboardRank: number;
  streakDays: number;
}

// Learning Pathways Types
export interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  totalModules: number;
  completedModules: number;
  progress: number;
  estimatedTime: string;
  timeRemaining: string;
  color: 'primary' | 'green' | 'purple' | 'blue' | 'orange';
  skills: string[];
  certificateIncluded: boolean;
  weeklyHours: number;
  isActive: boolean;
  startDate?: Date;
  completionDate?: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  rating: number;
  studentsEnrolled: number;
  price: number;
  category: string;
  skills: string[];
  modules: CourseModule[];
  thumbnail?: string;
  isRecommended: boolean;
  matchScore?: number;
}

export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
  type: 'video' | 'reading' | 'quiz' | 'assignment' | 'project';
}

export interface SkillAssessment {
  id: string;
  skillName: string;
  currentLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  progress: number;
  lastAssessed?: Date;
  recommendedCourses: string[];
  strengths: string[];
  improvementAreas: string[];
}

export interface LearningAnalytics {
  weeklyGoal: {
    target: number;
    completed: number;
    unit: 'hours' | 'modules' | 'courses';
  };
  totalStats: {
    coursesCompleted: number;
    hoursLearned: number;
    certificatesEarned: number;
    completionRate: number;
  };
  streakDays: number;
  weeklyActivity: number[];
  skillProgress: SkillProgress[];
  learningVelocity: {
    thisWeek: number;
    lastWeek: number;
    trend: 'up' | 'down' | 'stable';
  };
}

export interface SkillProgress {
  skill: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  progress: number;
  color: string;
}

export interface LearningRecommendation {
  id: string;
  type: 'course' | 'path' | 'skill' | 'assessment';
  title: string;
  description: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  difficulty: string;
}

// Community Types
export interface CommunityMember {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  location?: string;
  skills: string[];
  interests: string[];
  connectionStatus: 'connected' | 'pending' | 'not_connected';
  mutualConnections: number;
  joinDate: Date;
  isOnline: boolean;
  lastActive?: Date;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: CommunityMember;
  category: string;
  tags: string[];
  replies: number;
  likes: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
  isLocked: boolean;
  hasLiked: boolean;
}

export interface ForumReply {
  id: string;
  content: string;
  author: CommunityMember;
  postId: string;
  parentReplyId?: string;
  likes: number;
  createdAt: Date;
  hasLiked: boolean;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  type: 'virtual' | 'in-person' | 'hybrid';
  category: 'networking' | 'workshop' | 'webinar' | 'social' | 'mentorship';
  startDate: Date;
  endDate: Date;
  timezone: string;
  location?: string;
  maxAttendees?: number;
  currentAttendees: number;
  organizer: CommunityMember;
  attendees: CommunityMember[];
  isAttending: boolean;
  registrationRequired: boolean;
  cost?: number;
  tags: string[];
  meetingLink?: string;
}

export interface MentorshipProfile {
  id: string;
  user: CommunityMember;
  type: 'mentor' | 'mentee';
  expertise: string[];
  lookingFor: string[];
  experience: string;
  availability: 'high' | 'medium' | 'low';
  preferredMeetingType: 'virtual' | 'in-person' | 'both';
  languages: string[];
  timezone: string;
  rating?: number;
  reviewCount: number;
  isActive: boolean;
  matchScore?: number;
}

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'team' | 'community';
  category: string;
  startDate: Date;
  endDate: Date;
  participants: number;
  maxParticipants?: number;
  reward: string;
  xpReward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'upcoming' | 'active' | 'completed';
  isParticipating: boolean;
  progress?: number;
  leaderboard: ChallengeLeaderboardEntry[];
}

export interface ChallengeLeaderboardEntry {
  rank: number;
  participant: CommunityMember;
  score: number;
  progress: number;
  isCurrentUser: boolean;
}

export interface CommunityStats {
  totalMembers: number;
  activeMembers: number;
  postsToday: number;
  eventsThisMonth: number;
  onlineNow: number;
  newMembersThisWeek: number;
}

export interface ConnectionRequest {
  id: string;
  from: CommunityMember;
  to: CommunityMember;
  message?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
}

// Error Types
export const ErrorType = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  GEMINI_API_ERROR: 'GEMINI_API_ERROR'
} as const;

export type ErrorType = typeof ErrorType[keyof typeof ErrorType];