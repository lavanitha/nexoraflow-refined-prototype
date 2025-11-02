import React from 'react';
import type { Course } from '../types';
import { Button } from './';

export interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: string) => void;
  onViewDetails?: (courseId: string) => void;
  compact?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onEnroll,
  onViewDetails,
  compact = false
}) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        <span className="font-medium text-sm">{rating}</span>
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-current' : 'fill-gray-300'}`}
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
            </svg>
          ))}
        </div>
      </div>
    );
  };

  if (compact) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-white">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1 mr-2">
            {course.title}
          </h3>
          {course.isRecommended && (
            <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
              Recommended
            </span>
          )}
        </div>
        
        <div className="space-y-2 text-sm text-gray-600 mb-3">
          <div className="flex justify-between">
            <span>Duration:</span>
            <span className="font-medium">{course.duration}</span>
          </div>
          <div className="flex justify-between">
            <span>Level:</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
              {course.level}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Rating:</span>
            {renderStars(course.rating)}
          </div>
          <div className="flex justify-between">
            <span>Students:</span>
            <span className="font-medium">{course.studentsEnrolled.toLocaleString()}</span>
          </div>
        </div>
        
        <Button
          variant="secondary"
          size="sm"
          fullWidth
          onClick={() => onEnroll?.(course.id)}
        >
          Enroll Now
        </Button>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 bg-white">
      {course.thumbnail && (
        <div className="h-32 bg-gradient-to-r from-primary-400 to-secondary-500 relative">
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1M9 10v5a2 2 0 002 2h2a2 2 0 002-2v-5" />
            </svg>
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 flex-1 mr-2">
            {course.title}
          </h3>
          {course.isRecommended && (
            <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
              Recommended
            </span>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">by {course.instructor}</span>
          {renderStars(course.rating)}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500">Duration:</span>
            <span className="font-medium ml-1">{course.duration}</span>
          </div>
          <div>
            <span className="text-gray-500">Students:</span>
            <span className="font-medium ml-1">{course.studentsEnrolled.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-500">Level:</span>
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
              {course.level}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Price:</span>
            <span className="font-medium ml-1">
              {course.price === 0 ? 'Free' : `$${course.price}`}
            </span>
          </div>
        </div>
        
        {course.skills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {course.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                >
                  {skill}
                </span>
              ))}
              {course.skills.length > 3 && (
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-500">
                  +{course.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="flex space-x-2">
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={() => onEnroll?.(course.id)}
          >
            Enroll Now
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(course.id)}
          >
            Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;