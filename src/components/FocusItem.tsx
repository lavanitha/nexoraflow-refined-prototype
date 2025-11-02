import React from 'react';

interface FocusItemProps {
  title: string;
  desc: string;
  category?: string;
  duration?: string;
  priority?: string;
}

const FocusItem: React.FC<FocusItemProps> = ({ title, desc, category, duration, priority }) => (
  <div className="border border-gray-100 rounded-lg p-4">
    <div className="flex items-start gap-4">
      <div className="w-5 h-5 rounded-full border-2 border-gray-300 mt-1"></div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{title}</h3>
          {priority && <span className="text-xs text-red-500">{priority}</span>}
        </div>
        <p className="text-gray-500 text-sm mt-1">{desc}</p>
        <div className="flex items-center justify-between mt-3 text-sm">
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <span className="w-5 h-5 rounded-lg bg-blue-100 flex items-center justify-center">{category?.charAt(0)}</span>
            {category}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">{duration}</span>
            <button className="text-blue-600 font-medium">Start</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default FocusItem;
 
