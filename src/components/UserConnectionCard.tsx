import React from 'react';
import type { CommunityMember } from '../types';
import Button from './Button';

export interface UserConnectionCardProps {
  member: CommunityMember;
  onConnect?: (memberId: string) => void;
  onViewProfile?: (memberId: string) => void;
  showConnectionButton?: boolean;
}

const UserConnectionCard: React.FC<UserConnectionCardProps> = ({
  member,
  onConnect,
  onViewProfile,
  showConnectionButton = true
}) => {
  const getConnectionButtonText = () => {
    switch (member.connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'pending':
        return 'Pending';
      default:
        return 'Connect';
    }
  };

  const getConnectionButtonVariant = () => {
    switch (member.connectionStatus) {
      case 'connected':
        return 'outline' as const;
      case 'pending':
        return 'ghost' as const;
      default:
        return 'primary' as const;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-3">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {member.avatar || member.name.charAt(0)}
          </div>
          {member.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 truncate">{member.name}</h3>
              <p className="text-sm text-gray-600 truncate">{member.role}</p>
              {member.location && (
                <p className="text-xs text-gray-500 mt-1">{member.location}</p>
              )}
            </div>
            
            {showConnectionButton && onConnect && (
              <Button
                size="sm"
                variant={getConnectionButtonVariant()}
                onClick={() => onConnect(member.id)}
                disabled={member.connectionStatus === 'pending'}
                className="ml-2"
              >
                {getConnectionButtonText()}
              </Button>
            )}
          </div>
          
          <div className="mt-2">
            <div className="flex flex-wrap gap-1">
              {member.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full"
                >
                  {skill}
                </span>
              ))}
              {member.skills.length > 3 && (
                <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                  +{member.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
          
          {member.mutualConnections > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              {member.mutualConnections} mutual connection{member.mutualConnections !== 1 ? 's' : ''}
            </p>
          )}
          
          <div className="flex items-center space-x-2 mt-3">
            <button
              onClick={() => onViewProfile?.(member.id)}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              View Profile
            </button>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-500">
              Joined {member.joinDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserConnectionCard;