import React, { useState, useEffect } from 'react';

export interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error' | 'gradient';
  showLabel?: boolean;
  showPercentage?: boolean;
  label?: string;
  animated?: boolean;
  striped?: boolean;
  className?: string;
  duration?: number;
  delay?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  showPercentage = false,
  label,
  animated = true,
  striped = false,
  className = '',
  duration = 1000,
  delay = 0,
}) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const percentage = Math.min((value / max) * 100, 100);

  useEffect(() => {
    if (!animated) {
      setCurrentValue(percentage);
      return;
    }

    const timer = setTimeout(() => {
      setIsAnimating(true);
      
      const startTime = Date.now();
      const startValue = currentValue;
      const endValue = percentage;
      const difference = endValue - startValue;

      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const newValue = startValue + (difference * easeOut);
        
        setCurrentValue(newValue);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCurrentValue(endValue);
          setIsAnimating(false);
        }
      };
      
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [percentage, duration, delay, animated, currentValue]);

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const variantClasses = {
    default: 'bg-primary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
    gradient: 'bg-gradient-to-r from-primary-500 to-primary-600',
  };

  const backgroundClasses = {
    default: 'bg-primary-100',
    success: 'bg-success-100',
    warning: 'bg-warning-100',
    error: 'bg-error-100',
    gradient: 'bg-gray-200',
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Label and Percentage */}
      {(showLabel || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {showLabel && (
            <span className="text-sm font-medium text-gray-700">
              {label || 'Progress'}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm font-medium text-gray-500">
              {Math.round(currentValue)}%
            </span>
          )}
        </div>
      )}
      
      {/* Progress Bar Container */}
      <div className={`
        relative overflow-hidden rounded-full
        ${sizeClasses[size]}
        ${backgroundClasses[variant]}
        transition-all duration-200
      `}>
        {/* Progress Bar Fill */}
        <div
          className={`
            h-full rounded-full transition-all duration-300 ease-out relative overflow-hidden
            ${variantClasses[variant]}
            ${striped ? 'bg-stripes' : ''}
            ${isAnimating ? 'animate-pulse-soft' : ''}
          `}
          style={{
            width: `${currentValue}%`,
            transition: animated ? `width ${duration}ms ease-out` : 'none',
          }}
        >
          {/* Shimmer Effect */}
          {animated && (
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          )}
          
          {/* Striped Pattern */}
          {striped && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent bg-stripes animate-slide-right" />
          )}
        </div>
        
        {/* Glow Effect */}
        {variant === 'gradient' && currentValue > 0 && (
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full opacity-50 blur-sm"
            style={{ width: `${currentValue}%` }}
          />
        )}
      </div>
      
      {/* Value Display */}
      {!showPercentage && !showLabel && (
        <div className="mt-1 text-xs text-gray-500 text-center">
          {Math.round(currentValue)} / {max}
        </div>
      )}
    </div>
  );
};

// Circular Progress Bar Component
export interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'gradient';
  showLabel?: boolean;
  showPercentage?: boolean;
  label?: string;
  animated?: boolean;
  className?: string;
  duration?: number;
  delay?: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = 'default',
  showLabel = false,
  showPercentage = true,
  label,
  animated = true,
  className = '',
  duration = 1000,
  delay = 0,
}) => {
  const [currentValue, setCurrentValue] = useState(0);
  
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (currentValue / 100) * circumference;

  useEffect(() => {
    if (!animated) {
      setCurrentValue(percentage);
      return;
    }

    const timer = setTimeout(() => {
      const startTime = Date.now();
      const startValue = currentValue;
      const endValue = percentage;
      const difference = endValue - startValue;

      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const newValue = startValue + (difference * easeOut);
        
        setCurrentValue(newValue);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCurrentValue(endValue);
        }
      };
      
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [percentage, duration, delay, animated, currentValue]);

  const variantColors = {
    default: '#3B82F6',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    gradient: 'url(#gradient)',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Gradient Definition */}
        {variant === 'gradient' && (
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
          </defs>
        )}
        
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={variantColors[variant]}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
          style={{
            transition: animated ? `stroke-dashoffset ${duration}ms ease-out` : 'none',
          }}
        />
      </svg>
      
      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <span className="text-2xl font-bold text-gray-900">
            {Math.round(currentValue)}%
          </span>
        )}
        {showLabel && label && (
          <span className="text-sm text-gray-500 mt-1">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;