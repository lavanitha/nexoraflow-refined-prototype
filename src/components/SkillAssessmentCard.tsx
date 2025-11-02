import React from 'react';
import type { SkillAssessment } from '../types';
import { Button } from './';

export interface SkillAssessmentCardProps {
  assessment: SkillAssessment;
  onTakeAssessment?: (skillId: string) => void;
  onViewRecommendations?: (skillId: string) => void;
  compact?: boolean;
}

const SkillAssessmentCard: React.FC<SkillAssessmentCardProps> = ({
  assessment,
  onTakeAssessment,
  onViewRecommendations,
  compact = false
}) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return { bg: 'bg-red-100', text: 'text-red-800', progress: 'bg-red-500' };
      case 'Intermediate':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', progress: 'bg-yellow-500' };
      case 'Advanced':
        return { bg: 'bg-green-100', text: 'text-green-800', progress: 'bg-green-500' };
      case 'Expert':
        return { bg: 'bg-purple-100', text: 'text-purple-800', progress: 'bg-purple-500' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', progress: 'bg-gray-500' };
    }
  };

  const colors = getLevelColor(assessment.currentLevel);

  const formatDate = (date?: Date) => {
    if (!date) return 'Never assessed';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  if (compact) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">{assessment.skillName}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
            {assessment.currentLevel}
          </span>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Proficiency</span>
            <span className="font-medium">{assessment.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${colors.progress}`}
              style={{ width: `${assessment.progress}%` }}
            />
          </div>
        </div>
        
        <div className="text-xs text-gray-500 mb-3">
          Last assessed: {formatDate(assessment.lastAssessed)}
        </div>
        
        <Button
          variant="secondary"
          size="sm"
          fullWidth
          onClick={() => onTakeAssessment?.(assessment.id)}
        >
          Retake Assessment
        </Button>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{assessment.skillName}</h3>
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-sm text-gray-600">Current Level:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}>
              {assessment.currentLevel}
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{assessment.progress}%</div>
          <div className="text-xs text-gray-500">Proficiency</div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${colors.progress}`}
            style={{ width: `${assessment.progress}%` }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {assessment.strengths.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Strengths</h4>
            <div className="space-y-1">
              {assessment.strengths.slice(0, 3).map((strength, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-700">{strength}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {assessment.improvementAreas.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Areas to Improve</h4>
            <div className="space-y-1">
              {assessment.improvementAreas.slice(0, 3).map((area, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-sm text-gray-700">{area}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="text-xs text-gray-500 mb-4">
        Last assessed: {formatDate(assessment.lastAssessed)}
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onTakeAssessment?.(assessment.id)}
        >
          Retake Assessment
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewRecommendations?.(assessment.id)}
        >
          View Recommendations
        </Button>
      </div>
    </div>
  );
};

export default SkillAssessmentCard;