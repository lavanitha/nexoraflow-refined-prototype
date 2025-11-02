import React from 'react';

interface SkillProgressBarProps {
  name: string;
  level: string;
  progress: number;
}

const SkillProgressBar: React.FC<SkillProgressBarProps> = ({ name, level, progress }) => {
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'rgb(37, 99, 235)';
      case 'intermediate':
        return 'rgb(249, 115, 22)';
      case 'advanced':
        return 'rgb(22, 163, 74)';
      default:
        return 'rgb(37, 99, 235)';
    }
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-700">{name}</span>
        <span 
          className="text-sm"
          style={{ color: getLevelColor(level) }}
        >
          {level}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            backgroundColor: getLevelColor(level)
          }}
        />
      </div>
    </div>
  );
};

export default SkillProgressBar;