import React from 'react';
import type { MentorshipProfile } from '../types';
import Button from './Button';

export interface MentorshipCardProps {
  profile: MentorshipProfile;
  onConnect?: (profileId: string) => void;
  onViewProfile?: (profileId: string) => void;
  showMatchScore?: boolean;
}

const MentorshipCard: React.FC<MentorshipCardProps> = ({
  profile,
  onConnect,
  onViewProfile,
  showMatchScore = false
}) => {
  const getAvailabilityColor = (availability: string) => {
    const colors: Record<string, string> = {
      'high': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-red-100 text-red-800'
    };
    return colors[availability] || colors['medium'];
  };

  const getAvailabilityText = (availability: string) => {
    const texts: Record<string, string> = {
      'high': 'Highly Available',
      'medium': 'Moderately Available',
      'low': 'Limited Availability'
    };
    return texts[availability] || 'Available';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-xl">
            {profile.user.avatar || profile.user.name.charAt(0)}
          </div>
          {profile.user.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          )}
          {showMatchScore && profile.matchScore && (
            <div className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center">
              {profile.matchScore}%
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg">{profile.user.name}</h3>
              <p className="text-sm text-gray-600">{profile.user.role}</p>
              {profile.user.location && (
                <p className="text-xs text-gray-500 mt-1">{profile.user.location}</p>
              )}
            </div>
            
            <div className="flex flex-col items-end space-y-1">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                profile.type === 'mentor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
              }`}>
                {profile.type === 'mentor' ? '👨‍🏫 Mentor' : '🎓 Mentee'}
              </span>
              
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAvailabilityColor(profile.availability)}`}>
                {getAvailabilityText(profile.availability)}
              </span>
            </div>
          </div>
          
          {profile.rating && profile.reviewCount > 0 && (
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center space-x-1">
                {renderStars(Math.round(profile.rating))}
              </div>
              <span className="text-sm text-gray-600">
                {profile.rating.toFixed(1)} ({profile.reviewCount} reviews)
              </span>
            </div>
          )}
          
          <div className="mb-3">
            <p className="text-sm text-gray-700 line-clamp-2">{profile.experience}</p>
          </div>
          
          <div className="mb-3">
            <div className="mb-2">
              <h4 className="text-xs font-semibold text-gray-700 mb-1">
                {profile.type === 'mentor' ? 'Expertise:' : 'Looking to learn:'}
              </h4>
              <div className="flex flex-wrap gap-1">
                {profile.expertise.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {profile.expertise.length > 3 && (
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                    +{profile.expertise.length - 3} more
                  </span>
                )}
              </div>
            </div>
            
            {profile.lookingFor.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-1">
                  {profile.type === 'mentor' ? 'Interested in mentoring:' : 'Seeking help with:'}
                </h4>
                <div className="flex flex-wrap gap-1">
                  {profile.lookingFor.slice(0, 2).map((area, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                    >
                      {area}
                    </span>
                  ))}
                  {profile.lookingFor.length > 2 && (
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                      +{profile.lookingFor.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{profile.timezone}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>{profile.preferredMeetingType}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span>{profile.languages.join(', ')}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="primary"
              onClick={() => onConnect?.(profile.id)}
              className="flex-1"
            >
              {profile.type === 'mentor' ? 'Request Mentorship' : 'Offer to Mentor'}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewProfile?.(profile.user.id)}
            >
              View Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorshipCard;