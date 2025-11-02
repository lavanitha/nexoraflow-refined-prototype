import React from 'react';
import type { CommunityEvent } from '../types';
import Button from './Button';

export interface EventCardProps {
  event: CommunityEvent;
  onJoin?: (eventId: string) => void;
  onLeave?: (eventId: string) => void;
  onViewDetails?: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onJoin,
  onLeave,
  onViewDetails
}) => {
  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'virtual': 'bg-blue-100 text-blue-800',
      'in-person': 'bg-green-100 text-green-800',
      'hybrid': 'bg-purple-100 text-purple-800'
    };
    return colors[type] || colors['virtual'];
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'networking': '🤝',
      'workshop': '🛠️',
      'webinar': '📺',
      'social': '🎉',
      'mentorship': '👨‍🏫'
    };
    return icons[category] || '📅';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const isEventFull = event.maxAttendees ? event.currentAttendees >= event.maxAttendees : false;
  const isEventPast = event.endDate < new Date();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">{getCategoryIcon(event.category)}</span>
            <h3 
              className="font-semibold text-gray-900 hover:text-primary-600 cursor-pointer"
              onClick={() => onViewDetails?.(event.id)}
            >
              {event.title}
            </h3>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {event.description}
          </p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(event.startDate)}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatTime(event.startDate)}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>
                {event.currentAttendees}
                {event.maxAttendees && ` / ${event.maxAttendees}`} attending
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mb-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEventTypeColor(event.type)}`}>
              {event.type}
            </span>
            
            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
              {event.category}
            </span>
            
            {event.cost && event.cost > 0 && (
              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                ${event.cost}
              </span>
            )}
            
            {event.cost === 0 && (
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Free
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
              {event.organizer.avatar || event.organizer.name.charAt(0)}
            </div>
            <span>Organized by {event.organizer.name}</span>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2 ml-4">
          {!isEventPast && (
            <>
              {event.isAttending ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onLeave?.(event.id)}
                  className="whitespace-nowrap"
                >
                  Leave Event
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onJoin?.(event.id)}
                  disabled={isEventFull}
                  className="whitespace-nowrap"
                >
                  {isEventFull ? 'Full' : 'Join Event'}
                </Button>
              )}
            </>
          )}
          
          {isEventPast && (
            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
              Past Event
            </span>
          )}
        </div>
      </div>
      
      {event.location && event.type !== 'virtual' && (
        <div className="flex items-center space-x-1 text-xs text-gray-500 mt-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{event.location}</span>
        </div>
      )}
      
      {event.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {event.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
              #{tag}
            </span>
          ))}
          {event.tags.length > 3 && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
              +{event.tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default EventCard;