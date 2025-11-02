import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  loading?: boolean;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  variant = 'default',
  size = 'md',
  hover = true,
  clickable = false,
  onClick,
  loading = false,
  style,
}) => {
  const baseClasses = 'group rounded-xl transition-all duration-300 ease-out transform-gpu relative overflow-hidden';
  
  const variantClasses = {
    default: 'bg-white border border-gray-200 shadow-soft',
    elevated: 'bg-white shadow-medium border-0',
    outlined: 'bg-transparent border-2 border-gray-200 shadow-none hover:border-primary-200',
    filled: 'bg-gray-50 border border-gray-100 shadow-soft hover:bg-gray-100',
    gradient: 'bg-gradient-to-br from-nexora-500 to-primary-600 text-white border-0 shadow-medium hover:from-nexora-600 hover:to-primary-700',
  };

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const hoverClasses = hover
    ? clickable
      ? 'hover:shadow-strong hover:-translate-y-2 hover:scale-105 cursor-pointer'
      : 'hover:shadow-medium hover:-translate-y-1 hover:scale-102'
    : '';

  const clickableClasses = clickable ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 active:scale-95' : '';

  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${hoverClasses}
    ${clickableClasses}
    ${loading ? 'animate-pulse-soft' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const handleClick = () => {
    if (clickable && onClick && !loading) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (clickable && onClick && !loading && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={combinedClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? 'button' : undefined}
      aria-disabled={loading}
      style={style}
    >
      {/* Shimmer effect for hover */}
      {hover && !loading && (
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
      )}
      
      {/* Ripple effect for clickable cards */}
      {clickable && !loading && (
        <div className="absolute inset-0 opacity-0 group-active:opacity-100 transition-opacity duration-200">
          <div className="absolute top-1/2 left-1/2 w-0 h-0 bg-primary-500/20 rounded-full group-active:w-96 group-active:h-96 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out" />
        </div>
      )}
      
      <div className="relative z-10">
        {(title || subtitle) && (
          <div className="mb-4">
            {title && (
              <h3 className={`font-semibold transition-all duration-200 group-hover:tracking-wide ${variant === 'gradient' ? 'text-white' : 'text-gray-900'} ${
                size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : size === 'lg' ? 'text-2xl' : 'text-3xl'
              }`}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p className={`mt-1 transition-all duration-200 ${variant === 'gradient' ? 'text-white/80' : 'text-gray-600'} ${
                size === 'sm' ? 'text-sm' : 'text-base'
              }`}>
                {subtitle}
              </p>
            )}
          </div>
        )}
        
        {loading ? (
          <div className="space-y-3">
            <div className="skeleton-text w-3/4"></div>
            <div className="skeleton-text w-1/2"></div>
            <div className="skeleton-text w-5/6"></div>
          </div>
        ) : (
          <div className="transition-all duration-200 group-hover:translate-x-1">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;