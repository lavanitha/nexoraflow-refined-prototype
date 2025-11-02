import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  delta?: string;
  icon?: React.ReactNode;
  gradient?: string;
}

function getDefaultIconAndGradient(title: string) {
  const t = title.toLowerCase();
  if (t.includes('goals')) {
    return {
      gradient: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v8m0 0l-3-3m3 3l3-3" />
        </svg>
      )
    };
  }
  if (t.includes('learning') || t.includes('time')) {
    return {
      gradient: 'linear-gradient(135deg,#10B981,#34D399)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3" />
          <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
        </svg>
      )
    };
  }
  if (t.includes('connection') || t.includes('connections') || t.includes('network')) {
    return {
      gradient: 'linear-gradient(135deg,#06B6D4,#0891B2)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a4 4 0 00-4-4h-1" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20H2v-2a4 4 0 014-4h1" />
          <circle cx="12" cy="7" r="3" strokeWidth={1.5} />
        </svg>
      )
    };
  }
  // fallback (money / income)
  return {
    gradient: 'linear-gradient(135deg,#F97316,#FB923C)',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 1.567-3 3.5S10.343 15 12 15s3-1.567 3-3.5S13.657 8 12 8z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v2m0 14v2" />
      </svg>
    )
  };
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, delta, icon, gradient }) => {
  const fallback = getDefaultIconAndGradient(title);
  const bg = gradient || fallback.gradient;
  const iconNode = icon || fallback.icon;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white" style={{ background: bg }}>
            {iconNode}
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{title}</p>
          </div>
        </div>
        {delta && <div className="text-sm text-green-500 font-medium">{delta}</div>}
      </div>
      {subtitle && <p className="text-xs text-gray-400 mt-3">{subtitle}</p>}
    </div>
  );
};

export default MetricCard;

 
