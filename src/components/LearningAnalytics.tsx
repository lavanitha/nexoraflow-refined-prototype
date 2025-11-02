import React from 'react';

interface ActivityData {
  value: number;
  label: string;
  detail?: string;
  icon?: string;
}

interface WeeklyActivity {
  day: string;
  hours: number;
}

interface FocusArea {
  category: string;
  percentage: number;
  color: string;
}

interface LearningVelocity {
  monthComparison: string;
  avgCompletion: string;
  bestStreak: number;
}

interface NextMilestone {
  badge: string;
  expertLevel: string;
  monthlyGoal: string;
  hoursRemaining: number;
}

interface Props {
  weeklyData: WeeklyActivity[];
  focusAreas: FocusArea[];
  monthlyProgress: {
    months: string[];
    enrolled: number[];
    completed: number[];
  };
  velocity: LearningVelocity;
  milestones: NextMilestone;
}

const LearningAnalytics: React.FC<Props> = ({
  weeklyData,
  focusAreas,
  monthlyProgress,
  velocity,
  milestones
}) => {
  const activityStats: ActivityData[] = [
    { value: 127, label: 'Total Hours', detail: '+8.5 this week' },
    { value: 5, label: 'Completed', detail: '3 this month' },
    { value: 3, label: 'Certificates', detail: '2 pending' },
    { value: 12, label: 'Streak', detail: 'days in a row' }
  ];

  return (
    <div className="space-y-6">
      {/* Activity Stats */}
      <div className="grid grid-cols-4 gap-8">
        {activityStats.map((stat, index) => (
          <div key={index}>
            <h3 className="text-sm text-gray-600">{stat.label}</h3>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Weekly Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Weekly Learning Activity</h2>
          <div className="h-48">
            <div className="relative h-full">
              {weeklyData.map((day, index) => (
                <div
                  key={index}
                  className="absolute bottom-0 w-[12%] bg-blue-600 rounded-t"
                  style={{
                    left: `${index * 14}%`,
                    height: `${day.hours * 25}%`
                  }}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            {weeklyData.map((day, index) => (
              <div key={index}>{day.day}</div>
            ))}
          </div>
        </div>

        {/* Focus Areas */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Learning Focus Areas</h2>
          <div className="relative h-48 w-48 mx-auto">
            <svg viewBox="0 0 100 100" className="transform -rotate-90">
              {focusAreas.map((area, index) => {
                const prevTotal = focusAreas
                  .slice(0, index)
                  .reduce((sum, a) => sum + a.percentage, 0);
                return (
                  <circle
                    key={index}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={area.color}
                    strokeWidth="20"
                    strokeDasharray={`${area.percentage} 100`}
                    strokeDashoffset={-prevTotal}
                    className="transition-all duration-1000"
                  />
                );
              })}
            </svg>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {focusAreas.map((area, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: area.color }}
                />
                <span className="text-sm">
                  {area.category} {area.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6-Month Progress */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">6-Month Learning Progress</h2>
        <div className="h-64 relative">
          {/* Progress Lines */}
          <div className="absolute inset-0">
            <svg className="w-full h-full">
              <path
                d={`M 0,${100 - monthlyProgress.enrolled[0]} ${monthlyProgress.months
                  .map(
                    (_, i) =>
                      `L ${(i * 100) / 5},${100 - monthlyProgress.enrolled[i]}`
                  )
                  .join(' ')}`}
                fill="none"
                stroke="#2563eb"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              <path
                d={`M 0,${100 - monthlyProgress.completed[0]} ${monthlyProgress.months
                  .map(
                    (_, i) =>
                      `L ${(i * 100) / 5},${100 - monthlyProgress.completed[i]}`
                  )
                  .join(' ')}`}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className="flex justify-between absolute bottom-0 w-full text-sm text-gray-600">
            {monthlyProgress.months.map((month) => (
              <div key={month}>{month}</div>
            ))}
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <div>
            <p className="text-sm text-green-600">Completed Courses: {monthlyProgress.completed[monthlyProgress.completed.length - 1]}</p>
            <p className="text-sm text-blue-600">Enrolled Courses: {monthlyProgress.enrolled[monthlyProgress.enrolled.length - 1]}</p>
          </div>
        </div>
      </div>

      {/* Learning Velocity & Next Milestones */}
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Learning Velocity</h2>
          <p className="text-sm text-gray-600">Your learning pace is accelerating</p>
          <div className="mt-4 space-y-2">
            <div>
              <p className="text-sm text-gray-600">This month:</p>
              <p className="font-bold text-green-600">{velocity.monthComparison} faster</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. completion:</p>
              <p className="font-bold">{velocity.avgCompletion}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Best streak:</p>
              <p className="font-bold">{velocity.bestStreak} days</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Next Milestones</h2>
          <p className="text-sm text-gray-600">Upcoming achievements</p>
          <div className="mt-4 space-y-2">
            <div>
              <p className="text-sm text-gray-600">100 hours badge:</p>
              <p className="font-bold">{milestones.hoursRemaining} hours to go</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Expert level:</p>
              <p className="font-bold">{milestones.expertLevel}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly goal:</p>
              <p className="font-bold">{milestones.monthlyGoal}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningAnalytics;