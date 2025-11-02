import React, { useState, useEffect } from 'react';

export interface AnimatedCounterProps {
  value: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
  separator?: string;
  onComplete?: () => void;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 2000,
  delay = 0,
  prefix = '',
  suffix = '',
  className = '',
  decimals = 0,
  separator = ',',
  onComplete,
}) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
      
      const startTime = Date.now();
      const startValue = currentValue;
      const endValue = value;
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
          onComplete?.();
        }
      };
      
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, duration, delay, currentValue, onComplete]);

  const formatNumber = (num: number) => {
    const rounded = Number(num.toFixed(decimals));
    const parts = rounded.toString().split('.');
    
    // Add thousand separators
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    
    return parts.join('.');
  };

  return (
    <span className={`inline-block ${isAnimating ? 'animate-pulse-soft' : ''} ${className}`}>
      {prefix}
      <span className="tabular-nums">
        {formatNumber(currentValue)}
      </span>
      {suffix}
    </span>
  );
};

export default AnimatedCounter;