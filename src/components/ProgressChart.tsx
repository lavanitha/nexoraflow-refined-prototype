import React from 'react';

export interface ProgressChartProps {
  data: number[];
  labels?: string[];
  height?: number;
  color?: string;
  showGrid?: boolean;
  animated?: boolean;
}

const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  labels,
  height = 120,
  color = '#3B82F6',
  showGrid = true,
  animated = true
}) => {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  const normalizedData = data.map(value => ((value - minValue) / range) * 0.8 + 0.1);

  const pathData = normalizedData
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = (1 - value) * 100;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const areaPath = `${pathData} L 100 100 L 0 100 Z`;

  return (
    <div className="relative" style={{ height }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="overflow-visible"
      >
        {showGrid && (
          <defs>
            <pattern
              id="grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
        )}
        
        {showGrid && (
          <rect width="100" height="100" fill="url(#grid)" />
        )}
        
        {/* Area fill */}
        <path
          d={areaPath}
          fill={`${color}20`}
          className={animated ? 'transition-all duration-1000 ease-out' : ''}
        />
        
        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={animated ? 'transition-all duration-1000 ease-out' : ''}
        />
        
        {/* Data points */}
        {normalizedData.map((value, index) => (
          <circle
            key={index}
            cx={(index / (data.length - 1)) * 100}
            cy={(1 - value) * 100}
            r="2"
            fill={color}
            className={`${animated ? 'transition-all duration-1000 ease-out' : ''} hover:r-3`}
          />
        ))}
      </svg>
      
      {labels && (
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {labels.map((label, index) => (
            <span key={index}>{label}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressChart;