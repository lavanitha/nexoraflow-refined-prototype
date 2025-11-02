import React from 'react';

interface RecommendationCardProps {
  title: string;
  description: string;
  category?: string;
  match?: number;
  tags?: string[];
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ title, description, category, match, tags = [] }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">R</div>
            <div>
              <h4 className="font-semibold text-gray-900">{title}</h4>
              <p className="text-xs text-gray-500">{category}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-3">{description}</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <span key={t} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">{t}</span>
            ))}
          </div>
        </div>
        <div className="ml-4 text-right">
          {match !== undefined && (
            <div className="text-xs font-semibold text-orange-500">{match}% match</div>
          )}
          <button className="mt-4 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg">Explore →</button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
