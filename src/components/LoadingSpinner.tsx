import React from 'react';

export interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray' | 'success' | 'warning' | 'error';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'ring';
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  variant = 'spinner',
  className = '',
  text,
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16',
  };

  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    white: 'text-white',
    gray: 'text-gray-600',
    success: 'text-success-600',
    warning: 'text-warning-600',
    error: 'text-error-600',
  };

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  };

  const SpinnerVariant = () => (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const DotsVariant = () => {
    const dotSize = {
      xs: 'w-1 h-1',
      sm: 'w-1.5 h-1.5',
      md: 'w-2 h-2',
      lg: 'w-3 h-3',
      xl: 'w-4 h-4',
      '2xl': 'w-5 h-5',
    };

    return (
      <div className="flex space-x-1">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`${dotSize[size]} bg-current rounded-full animate-pulse`}
            style={{
              animationDelay: `${index * 0.2}s`,
              animationDuration: '1.4s',
            }}
          />
        ))}
      </div>
    );
  };

  const PulseVariant = () => (
    <div
      className={`${sizeClasses[size]} bg-current rounded-full animate-pulse-soft opacity-75`}
    />
  );

  const BarsVariant = () => {
    const barWidth = {
      xs: 'w-0.5',
      sm: 'w-0.5',
      md: 'w-1',
      lg: 'w-1.5',
      xl: 'w-2',
      '2xl': 'w-3',
    };

    const barHeight = {
      xs: 'h-3',
      sm: 'h-4',
      md: 'h-6',
      lg: 'h-8',
      xl: 'h-12',
      '2xl': 'h-16',
    };

    return (
      <div className="flex items-end space-x-1">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`${barWidth[size]} ${barHeight[size]} bg-current animate-pulse`}
            style={{
              animationDelay: `${index * 0.15}s`,
              animationDuration: '1.2s',
              transform: 'scaleY(0.4)',
              transformOrigin: 'bottom',
            }}
          />
        ))}
      </div>
    );
  };

  const RingVariant = () => (
    <div className={`${sizeClasses[size]} relative`}>
      <div
        className={`absolute inset-0 rounded-full border-2 border-current opacity-25`}
      />
      <div
        className={`absolute inset-0 rounded-full border-2 border-transparent border-t-current animate-spin`}
      />
    </div>
  );

  const renderVariant = () => {
    switch (variant) {
      case 'dots':
        return <DotsVariant />;
      case 'pulse':
        return <PulseVariant />;
      case 'bars':
        return <BarsVariant />;
      case 'ring':
        return <RingVariant />;
      default:
        return <SpinnerVariant />;
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${colorClasses[color]} ${className}`}>
      {renderVariant()}
      {text && (
        <p className={`mt-2 ${textSizeClasses[size]} font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;