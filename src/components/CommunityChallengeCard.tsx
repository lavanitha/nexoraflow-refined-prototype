import React from 'react';
import type { CommunityChallenge } from '../types';
import Button from './Button';

export interface CommunityChallengeCardProps {
  challenge: CommunityChallenge;
  onJoin?: (challengeId: string) => void;
  onLeave?: (challengeId: string) => void;
  onViewDetails?: (challengeId: string) => void;
}

const CommunityChallengeCard: React.FC<CommunityChallengeCardProps> = ({
  challenge,
  onJoin,
  onLeave,
  onViewDetails
}) => {
  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      'easy': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'hard': 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || colors['medium'];
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'upcoming': 'bg-blue-100 text-blue-800',
      'active': 'bg-green-100 text-green-800',
      'completed': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors['upcoming'];
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      'individual': '👤',
      'team': '👥',
      'community': '🌍'
    };
    return icons[type] || '🏆';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysRemaining = () => {
    const now = new Date();
    const diffTime = challenge.endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();
  const isExpired = daysRemaining < 0;
  const isStartingSoon = challenge.status === 'upcoming' && daysRemaining <= 7;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-xl">{getTypeIcon(challenge.type)}</span>
          <div>
            <h3 
              className="font-semibold text-gray-900 hover:text-primary-600 cursor-pointer"
              onClick={() => onViewDetails?.(challenge.id)}
            >
              {challenge.title}
            </h3>
            <p className="text-sm text-gray-600">{challenge.category}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-1">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(challenge.status)}`}>
            {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
          </span>
          
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(challenge.difficulty)}`}>
            {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
          </span>
        </div>
      </div>
      
      <p className="text-sm text-gray-700 mb-4 line-clamp-2">
        {challenge.description}
      </p>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Duration:</span>
          <span className="font-medium text-gray-900">
            {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Participants:</span>
          <span className="font-medium text-gray-900">
            {challenge.participants}
            {challenge.maxParticipants && ` / ${challenge.maxParticipants}`}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Reward:</span>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900">{challenge.reward}</span>
            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
              +{challenge.xpReward} XP
            </span>
          </div>
        </div>
        
        {!isExpired && challenge.status !== 'completed' && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Time remaining:</span>
            <span className={`font-medium ${
              daysRemaining <= 3 ? 'text-red-600' : 
              daysRemaining <= 7 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
      
      {challenge.isParticipating && challenge.progress !== undefined && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">Your Progress:</span>
            <span className="font-medium text-gray-900">{challenge.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${challenge.progress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {challenge.leaderboard.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Top Participants:</h4>
          <div className="space-y-1">
            {challenge.leaderboard.slice(0, 3).map((entry, index) => (
              <div key={entry.participant.id} className="flex items-center space-x-2 text-sm">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === 0 ? 'bg-yellow-100 text-yellow-800' :
                  index === 1 ? 'bg-gray-100 text-gray-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {entry.rank}
                </span>
                <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                  {entry.participant.avatar || entry.participant.name.charAt(0)}
                </div>
                <span className={`flex-1 ${entry.isCurrentUser ? 'font-semibold text-primary-600' : 'text-gray-700'}`}>
                  {entry.participant.name}
                </span>
                <span className="text-gray-600">{entry.score} pts</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        {challenge.status === 'upcoming' && (
          <>
            {challenge.isParticipating ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onLeave?.(challenge.id)}
                className="flex-1"
              >
                Leave Challenge
              </Button>
            ) : (
              <Button
                size="sm"
                variant="primary"
                onClick={() => onJoin?.(challenge.id)}
                disabled={challenge.maxParticipants ? challenge.participants >= challenge.maxParticipants : false}
                className="flex-1"
              >
                {challenge.maxParticipants && challenge.participants >= challenge.maxParticipants 
                  ? 'Full' 
                  : 'Join Challenge'
                }
              </Button>
            )}
          </>
        )}
        
        {challenge.status === 'active' && !challenge.isParticipating && (
          <Button
            size="sm"
            variant="primary"
            onClick={() => onJoin?.(challenge.id)}
            disabled={challenge.maxParticipants ? challenge.participants >= challenge.maxParticipants : false}
            className="flex-1"
          >
            Join Now
          </Button>
        )}
        
        {challenge.status === 'completed' && (
          <div className="flex-1 text-center py-2 text-sm text-gray-500">
            Challenge Completed
          </div>
        )}
        
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onViewDetails?.(challenge.id)}
        >
          View Details
        </Button>
      </div>
      
      {isStartingSoon && (
        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800 font-medium">
            🚀 Starting soon! Join now to participate.
          </p>
        </div>
      )}
    </div>
  );
};

export default CommunityChallengeCard;