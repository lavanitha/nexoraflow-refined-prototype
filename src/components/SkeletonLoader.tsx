import React from 'react';

export interface SkeletonLoaderProps {
  variant?: 'text' | 'avatar' | 'card' | 'button' | 'image' | 'list' | 'table';
  width?: string | number;
  height?: string | number;
  lines?: number;
  className?: string;
  animate?: boolean;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'text',
  width,
  height,
  lines = 3,
  className = '',
  animate = true,
}) => {
  const baseClasses = `bg-gray-200 rounded ${animate ? 'animate-skeleton' : ''}`;
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4';
      case 'avatar':
        return 'w-10 h-10 rounded-full';
      case 'card':
        return 'h-32 rounded-lg';
      case 'button':
        return 'h-10 rounded-lg';
      case 'image':
        return 'h-48 rounded-lg';
      case 'list':
        return 'h-16 rounded-lg';
      case 'table':
        return 'h-12 rounded';
      default:
        return 'h-4';
    }
  };

  const style = {
    width: width || undefined,
    height: height || undefined,
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${getVariantClasses()}`}
            style={{
              ...style,
              width: index === lines - 1 ? '75%' : width || '100%',
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-skeleton" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-skeleton" />
              <div className="h-3 bg-gray-200 rounded w-3/4 animate-skeleton" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="flex space-x-4">
            <div className="w-1/4 h-12 bg-gray-200 rounded animate-skeleton" />
            <div className="w-1/3 h-12 bg-gray-200 rounded animate-skeleton" />
            <div className="w-1/4 h-12 bg-gray-200 rounded animate-skeleton" />
            <div className="w-1/6 h-12 bg-gray-200 rounded animate-skeleton" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${getVariantClasses()} ${className}`}
      style={style}
    />
  );
};

// Pre-built skeleton components for common use cases
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-6 bg-white rounded-xl border border-gray-200 ${className}`}>
    <div className="flex items-center space-x-3 mb-4">
      <SkeletonLoader variant="avatar" />
      <div className="flex-1">
        <SkeletonLoader variant="text" width="60%" className="mb-2" />
        <SkeletonLoader variant="text" width="40%" height="12px" />
      </div>
    </div>
    <SkeletonLoader variant="text" lines={3} />
    <div className="flex justify-between items-center mt-4">
      <SkeletonLoader variant="button" width="80px" />
      <SkeletonLoader variant="text" width="60px" height="12px" />
    </div>
  </div>
);

export const SkeletonDashboard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`space-y-6 ${className}`}>
    {/* Header */}
    <div className="flex justify-between items-center">
      <SkeletonLoader variant="text" width="200px" height="32px" />
      <SkeletonLoader variant="button" width="120px" />
    </div>
    
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="p-6 bg-white rounded-xl border border-gray-200">
          <SkeletonLoader variant="text" width="80%" className="mb-2" />
          <SkeletonLoader variant="text" width="120px" height="28px" className="mb-1" />
          <SkeletonLoader variant="text" width="60%" height="12px" />
        </div>
      ))}
    </div>
    
    {/* Main Content */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <SkeletonLoader variant="card" height="400px" />
      </div>
      <div className="space-y-4">
        <SkeletonLoader variant="card" height="180px" />
        <SkeletonLoader variant="card" height="180px" />
      </div>
    </div>
  </div>
);

export const SkeletonList: React.FC<{ items?: number; className?: string }> = ({ 
  items = 5, 
  className = '' 
}) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200">
        <SkeletonLoader variant="avatar" />
        <div className="flex-1 space-y-2">
          <SkeletonLoader variant="text" width="70%" />
          <SkeletonLoader variant="text" width="50%" height="12px" />
        </div>
        <SkeletonLoader variant="button" width="80px" />
      </div>
    ))}
  </div>
);

export default SkeletonLoader;