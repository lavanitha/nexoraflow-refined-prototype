import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import type { Achievement, Challenge, LeaderboardEntry, UserLevel, Reward, GamificationStats } from '../types';

const AchievementGamificationCenter: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'achievements' | 'challenges' | 'leaderboard' | 'rewards'>('achievements');
  const [achievementFilter, setAchievementFilter] = useState<'all' | 'earned' | 'unearned'>('all');
  const [rewardFilter, setRewardFilter] = useState<'all' | 'available' | 'locked'>('all');
  const [showRedeemModal, setShowRedeemModal] = useState<string | null>(null);

  // Mock data - in real app this would come from API
  const userLevel: UserLevel = {
    level: 12,
    title: 'Resilience Champion',
    currentXP: 2450,
    requiredXP: 3000,
    progressPercentage: 82
  };

  const gamificationStats: GamificationStats = {
    totalXP: 2450,
    level: userLevel,
    achievementsEarned: 8,
    totalAchievements: 15,
    challengesCompleted: 12,
    activeChallenges: 3,
    leaderboardRank: 3,
    streakDays: 7
  };

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Completed your first coaching session',
      icon: '🎯',
      earned: true,
      earnedDate: new Date('2024-01-15'),
      category: 'coaching',
      rarity: 'common',
      xpReward: 50
    },
    {
      id: '2',
      title: 'Streak Master',
      description: '7 days of consistent progress',
      icon: '🔥',
      earned: true,
      earnedDate: new Date('2024-01-22'),
      category: 'general',
      rarity: 'rare',
      xpReward: 100
    },
    {
      id: '3',
      title: 'Knowledge Seeker',
      description: 'Completed 5 learning modules',
      icon: '📚',
      earned: true,
      earnedDate: new Date('2024-01-28'),
      category: 'learning',
      rarity: 'common',
      xpReward: 75
    },
    {
      id: '4',
      title: 'Community Helper',
      description: 'Helped 10 community members',
      icon: '🤝',
      earned: false,
      category: 'community',
      rarity: 'epic',
      xpReward: 200
    },
    {
      id: '5',
      title: 'Goal Crusher',
      description: 'Achieved 3 major goals',
      icon: '💪',
      earned: false,
      category: 'general',
      rarity: 'rare',
      xpReward: 150
    },
    {
      id: '6',
      title: 'Mentor',
      description: 'Mentored a new user',
      icon: '👨‍🏫',
      earned: false,
      category: 'community',
      rarity: 'legendary',
      xpReward: 300
    }
  ];

  const challenges: Challenge[] = [
    {
      id: '1',
      title: '30-Day Consistency Challenge',
      description: 'Complete daily activities for 30 consecutive days',
      progress: 23,
      total: 30,
      reward: '500 XP + Consistency Badge',
      xpReward: 500,
      deadline: new Date('2024-02-15'),
      category: 'consistency',
      difficulty: 'hard',
      isActive: true
    },
    {
      id: '2',
      title: 'Learning Sprint',
      description: 'Complete 5 learning modules this week',
      progress: 3,
      total: 5,
      reward: '300 XP',
      xpReward: 300,
      deadline: new Date('2024-02-10'),
      category: 'learning',
      difficulty: 'medium',
      isActive: true
    },
    {
      id: '3',
      title: 'Community Engagement',
      description: 'Help 10 community members this month',
      progress: 7,
      total: 10,
      reward: '200 XP + Helper Badge',
      xpReward: 200,
      deadline: new Date('2024-02-28'),
      category: 'community',
      difficulty: 'easy',
      isActive: true
    }
  ];

  const leaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      userId: '1',
      name: 'Alex Chen',
      avatar: '👨‍💻',
      points: 3250,
      level: 15,
      isCurrentUser: false,
      badge: '🏆'
    },
    {
      rank: 2,
      userId: '2',
      name: 'Sarah Johnson',
      avatar: '👩‍🎓',
      points: 3100,
      level: 14,
      isCurrentUser: false,
      badge: '🥈'
    },
    {
      rank: 3,
      userId: 'current',
      name: 'You',
      avatar: '👤',
      points: 2450,
      level: 12,
      isCurrentUser: true,
      badge: '🥉'
    },
    {
      rank: 4,
      userId: '4',
      name: 'Mike Rodriguez',
      avatar: '👨‍🚀',
      points: 2380,
      level: 12,
      isCurrentUser: false
    },
    {
      rank: 5,
      userId: '5',
      name: 'Emma Wilson',
      avatar: '👩‍💼',
      points: 2200,
      level: 11,
      isCurrentUser: false
    }
  ];

  const rewards: Reward[] = [
    {
      id: '1',
      title: 'Premium Theme',
      description: 'Unlock exclusive dark theme with animations',
      cost: 500,
      category: 'cosmetic',
      available: true,
      icon: '🎨',
      rarity: 'common'
    },
    {
      id: '2',
      title: 'Custom Badge',
      description: 'Create your own achievement badge',
      cost: 750,
      category: 'cosmetic',
      available: true,
      icon: '🏅',
      rarity: 'rare'
    },
    {
      id: '3',
      title: '1-on-1 Coaching',
      description: 'Personal coaching session with expert',
      cost: 1000,
      category: 'feature',
      available: false,
      icon: '🎯',
      rarity: 'legendary'
    },
    {
      id: '4',
      title: 'Course Discount',
      description: '50% off any premium course',
      cost: 300,
      category: 'discount',
      available: true,
      icon: '🎓',
      rarity: 'common'
    }
  ];

  const filteredAchievements = achievements.filter(achievement => {
    if (achievementFilter === 'earned') return achievement.earned;
    if (achievementFilter === 'unearned') return !achievement.earned;
    return true;
  });

  const filteredRewards = rewards.filter(reward => {
    if (rewardFilter === 'available') return reward.available;
    if (rewardFilter === 'locked') return !reward.available;
    return true;
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleRedeemReward = (rewardId: string) => {
    setShowRedeemModal(rewardId);
  };

  const confirmRedemption = () => {
    // In real app, this would make API call
    console.log('Redeeming reward:', showRedeemModal);
    setShowRedeemModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card title="Achievement Gamification Center" subtitle="Track your progress, earn achievements, and compete with others in your journey to success.">
        <div></div>
      </Card>

      {/* Level and Progress */}
      <Card variant="gradient" className="text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-3xl font-bold mb-1">Level {userLevel.level}</h2>
            <p className="text-white/80 text-lg">{userLevel.title}</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                🔥 {gamificationStats.streakDays} day streak
              </span>
              <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                #{gamificationStats.leaderboardRank} on leaderboard
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/90 text-lg font-semibold">
              XP: {userLevel.currentXP.toLocaleString()} / {userLevel.requiredXP.toLocaleString()}
            </p>
            <p className="text-sm text-white/70">
              {userLevel.requiredXP - userLevel.currentXP} XP to next level
            </p>
          </div>
        </div>
        
        <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-white h-4 rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${userLevel.progressPercentage}%` }}
          />
        </div>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card size="sm" className="text-center">
          <div className="text-2xl font-bold text-primary-600">{gamificationStats.achievementsEarned}</div>
          <div className="text-sm text-gray-600">Achievements</div>
        </Card>
        <Card size="sm" className="text-center">
          <div className="text-2xl font-bold text-secondary-600">{gamificationStats.activeChallenges}</div>
          <div className="text-sm text-gray-600">Active Challenges</div>
        </Card>
        <Card size="sm" className="text-center">
          <div className="text-2xl font-bold text-success-600">{gamificationStats.challengesCompleted}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </Card>
        <Card size="sm" className="text-center">
          <div className="text-2xl font-bold text-warning-600">#{gamificationStats.leaderboardRank}</div>
          <div className="text-sm text-gray-600">Rank</div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'achievements', label: 'Achievements', count: achievements.length },
            { key: 'challenges', label: 'Challenges', count: challenges.length },
            { key: 'leaderboard', label: 'Leaderboard', count: leaderboard.length },
            { key: 'rewards', label: 'Rewards', count: rewards.length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedTab === tab.key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {selectedTab === 'achievements' && (
        <div className="space-y-6">
          {/* Achievement Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Achievements' },
              { key: 'earned', label: 'Earned' },
              { key: 'unearned', label: 'Not Earned' }
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={achievementFilter === filter.key ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setAchievementFilter(filter.key as any)}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          {/* Achievement Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAchievements.map((achievement) => (
              <Card
                key={achievement.id}
                hover={true}
                className={`transition-all duration-200 ${
                  achievement.earned 
                    ? 'border-green-200 bg-green-50 shadow-md' 
                    : 'border-gray-200 bg-gray-50 opacity-75'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`text-3xl ${achievement.earned ? 'grayscale-0' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-semibold ${achievement.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                        {achievement.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRarityColor(achievement.rarity)}`}>
                        {achievement.rarity}
                      </span>
                    </div>
                    <p className={`text-sm mb-3 ${achievement.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                      {achievement.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary-600">
                        +{achievement.xpReward} XP
                      </span>
                      {achievement.earned && achievement.earnedDate && (
                        <span className="text-xs text-gray-500">
                          {achievement.earnedDate.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'challenges' && (
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <Card key={challenge.id} hover={true}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <div className="flex-1 mb-2 sm:mb-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                  {challenge.deadline && (
                    <p className="text-xs text-gray-500">
                      Deadline: {challenge.deadline.toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full">
                    {challenge.reward}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-600">
                      {challenge.progress}/{challenge.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary-600">
                    {Math.round((challenge.progress / challenge.total) * 100)}%
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedTab === 'leaderboard' && (
        <Card>
          <div className="space-y-3">
            {leaderboard.map((user) => (
              <div 
                key={user.userId} 
                className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-200 ${
                  user.isCurrentUser 
                    ? 'bg-primary-50 border-2 border-primary-200 shadow-sm' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  user.rank === 1 ? 'bg-yellow-400 text-yellow-900 shadow-md' :
                  user.rank === 2 ? 'bg-gray-300 text-gray-700 shadow-md' :
                  user.rank === 3 ? 'bg-orange-400 text-orange-900 shadow-md' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {user.badge || user.rank}
                </div>
                
                <div className="text-2xl">{user.avatar}</div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className={`font-semibold ${user.isCurrentUser ? 'text-primary-900' : 'text-gray-900'}`}>
                      {user.name}
                    </p>
                    {user.isCurrentUser && (
                      <span className="px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Level {user.level}</p>
                </div>
                
                <div className="text-right">
                  <p className={`font-bold ${user.isCurrentUser ? 'text-primary-700' : 'text-gray-900'}`}>
                    {user.points.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">XP</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {selectedTab === 'rewards' && (
        <div className="space-y-6">
          {/* Reward Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Rewards' },
              { key: 'available', label: 'Available' },
              { key: 'locked', label: 'Locked' }
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={rewardFilter === filter.key ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setRewardFilter(filter.key as any)}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          {/* Current XP Display */}
          <Card size="sm" className="bg-primary-50 border-primary-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {gamificationStats.totalXP.toLocaleString()} XP
              </div>
              <div className="text-sm text-primary-700">Available to spend</div>
            </div>
          </Card>

          {/* Rewards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRewards.map((reward) => (
              <Card
                key={reward.id}
                hover={reward.available}
                className={`transition-all duration-200 ${
                  reward.available 
                    ? 'border-green-200 hover:shadow-md' 
                    : 'border-gray-200 bg-gray-50 opacity-75'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`text-3xl ${reward.available ? 'grayscale-0' : 'grayscale'}`}>
                    {reward.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-semibold ${reward.available ? 'text-gray-900' : 'text-gray-500'}`}>
                        {reward.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRarityColor(reward.rarity)}`}>
                        {reward.rarity}
                      </span>
                    </div>
                    <p className={`text-sm mb-4 ${reward.available ? 'text-gray-600' : 'text-gray-400'}`}>
                      {reward.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary-600">
                        {reward.cost} XP
                      </span>
                      <Button
                        variant={reward.available ? 'primary' : 'outline'}
                        size="sm"
                        disabled={!reward.available}
                        onClick={() => reward.available && handleRedeemReward(reward.id)}
                      >
                        {reward.available ? 'Redeem' : 'Locked'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Redeem Modal */}
      {showRedeemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Redemption</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to redeem this reward? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowRedeemModal(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={confirmRedemption}
                className="flex-1"
              >
                Confirm
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AchievementGamificationCenter;