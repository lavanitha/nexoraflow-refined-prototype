import React from 'react';
import type { LearningPath } from '../types';
import { Button } from './';

export interface LearningPathCardProps {
  path: LearningPath;
  onContinue?: (pathId: string) => void;
  onViewDetails?: (pathId: string) => void;
}

const LearningPathCard: React.FC<LearningPathCardProps> = ({
  path,
  onContinue,
  onViewDetails
}) => {
  const getColorClasses = (color: string) => {
    const colorMap = {
      primary: {
        bg: 'bg-primary-600',
        text: 'text-primary-600',
        border: 'border-primary-200',
        bgLight: 'bg-primary-50'
      },
      green: {
        bg: 'bg-green-600',
        text: 'text-green-600',
        border: 'border-green-200',
        bgLight: 'bg-green-50'
      },
      purple: {
        bg: 'bg-purple-600',
        text: 'text-purple-600',
        border: 'border-purple-200',
        bgLight: 'bg-purple-50'
      },
      blue: {
        bg: 'bg-blue-600',
        text: 'text-blue-600',
        border: 'border-blue-200',
        bgLight: 'bg-blue-50'
      },
      orange: {
        bg: 'bg-orange-600',
        text: 'text-orange-600',
        border: 'border-orange-200',
        bgLight: 'bg-orange-50'
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.primary;
  };

  const colors = getColorClasses(path.color);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`border rounded-lg p-6 hover:shadow-md transition-all duration-200 ${colors.border} ${colors.bgLight}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{path.title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{path.description}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <span>{path.completedModules}/{path.totalModules} modules</span>
            <span>•</span>
            <span>{path.timeRemaining} remaining</span>
            <span>•</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(path.difficulty)}`}>
              {path.difficulty}
            </span>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {path.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className={`px-2 py-1 text-xs rounded-full ${colors.text} ${colors.bgLight} border ${colors.border}`}
              >
                {skill}
              </span>
            ))}
            {path.skills.length > 3 && (
              <span className="px-2 py-1 text-xs rounded-full text-gray-500 bg-gray-100">
                +{path.skills.length - 3} more
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-col space-y-2 ml-4">
          <Button
            variant={path.color === 'primary' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onContinue?.(path.id)}
          >
            Continue
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails?.(path.id)}
          >
            Details
          </Button>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium text-gray-900">{path.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${colors.bg}`}
            style={{ width: `${path.progress}%` }}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{path.weeklyHours} hrs/week</span>
          </div>
          
          {path.certificateIncluded && (
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span>Certificate</span>
            </div>
          )}
        </div>
        
        <div className="text-xs text-gray-500">
          {path.category}
        </div>
      </div>
    </div>
  );
};

export default LearningPathCard;