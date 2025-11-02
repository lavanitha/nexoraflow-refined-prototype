import React from 'react';
import { useNavigate } from 'react-router-dom';
import MetricCard from '../components/MetricCard';
import FocusItem from '../components/FocusItem';
import RecommendationCard from '../components/RecommendationCard';

// Floating CTA removed per design request

const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const metrics = {
    sideHustle: { completed: 3, total: 5, percentage: 60 },
    skillDevelopment: { completed: 7, total: 10, percentage: 70 },
    networkBuilding: { completed: 2, total: 3, percentage: 67 },
    wellnessGoals: { completed: 12, total: 14, percentage: 86 },
    summary: {
      activeGoals: '4/6',
      learningTime: '12h',
      connections: '28',
      sideIncome: '$1,240'
    }
  };

  const todayTasks = [
    { title: 'Complete React Portfolio Project', desc: 'Finish the e-commerce dashboard component and add responsive design', category: 'Skill Development', duration: '2h 30m', priority: 'high' },
    { title: 'Apply to 3 Freelance Gigs', desc: 'Submit proposals for web development projects on Upwork and Fiverr', category: 'Side Hustle', duration: '1h 15m', priority: 'high' },
    { title: 'Daily Mindfulness Session', desc: 'Complete 15-minute guided meditation for stress management', category: 'Wellness', duration: '15m', priority: 'low' }
  ];

  const recommendations = [
    { title: 'Freelance React Development', description: 'Based on your React skills and portfolio progress, try small freelance projects to build reputation.', match: 92 },
    { title: 'Advanced React Patterns', description: 'Enhance your React skills with render props, HOCs and custom hooks.', match: 88 }
  ];

  return (
    <div className="space-y-8">
      {/* Hero + action + small summary cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 bg-gradient-to-r from-white to-white/80 rounded-xl p-8">
          <p className="text-sm text-green-500 mb-2">● {new Date().toLocaleDateString()}</p>
          <h1 className="text-4xl font-bold mb-4">Welcome back, <span className="text-blue-600">Alex!</span></h1>
          <p className="text-gray-600 mb-6 max-w-2xl">You're making excellent progress on your career transformation journey. With 4 active goals and a 5-day learning streak, you're building momentum that will pay dividends.</p>
          <div className="flex gap-4">
            <button onClick={() => navigate('/dashboard/focus')} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold">Today's Focus</button>
            <button onClick={() => navigate('/dashboard/progress')} className="bg-white border border-gray-200 px-6 py-3 rounded-lg font-semibold">View Progress</button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">Side Hustle Launch</p>
                  <p className="font-semibold text-gray-900">Complete freelance portfolio</p>
                </div>
                <div className="text-orange-400 font-semibold">60%</div>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="w-12 h-12">
                  <svg viewBox="0 0 48 48" className="w-12 h-12">
                    <defs>
                      <linearGradient id="g-side" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F97316" />
                        <stop offset="100%" stopColor="#FB923C" />
                      </linearGradient>
                    </defs>
                    <circle cx="24" cy="24" r="18" fill="none" stroke="#EFF2F6" strokeWidth="6" />
                    <circle cx="24" cy="24" r="18" fill="none" stroke="url(#g-side)" strokeWidth="6" strokeDasharray="113" strokeDashoffset="45" strokeLinecap="round" transform="rotate(-90 24 24)" />
                    <text x="24" y="27" fontSize="10" textAnchor="middle" fill="#374151">3/5</text>
                  </svg>
                </div>
                <div className="text-sm text-gray-500">Progress</div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">Skill Development</p>
                  <p className="font-semibold text-gray-900">React mastery course</p>
                </div>
                <div className="text-yellow-400 font-semibold">70%</div>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="w-12 h-12">
                  <svg viewBox="0 0 48 48" className="w-12 h-12">
                    <defs>
                      <linearGradient id="g-skill" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#34D399" />
                      </linearGradient>
                    </defs>
                    <circle cx="24" cy="24" r="18" fill="none" stroke="#EFF2F6" strokeWidth="6" />
                    <circle cx="24" cy="24" r="18" fill="none" stroke="url(#g-skill)" strokeWidth="6" strokeDasharray="113" strokeDashoffset="34" strokeLinecap="round" transform="rotate(-90 24 24)" />
                    <text x="24" y="27" fontSize="10" textAnchor="middle" fill="#374151">7/10</text>
                  </svg>
                </div>
                <div className="text-sm text-gray-500">Progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary metric cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Active Goals" value={metrics.summary.activeGoals} subtitle="This month" delta="+2" />
        <MetricCard title="Learning Time" value={metrics.summary.learningTime} subtitle="This week" delta="+3h" />
        <MetricCard title="Connections" value={metrics.summary.connections} subtitle="Network size" delta="+5" />
        <MetricCard title="Side Income" value={metrics.summary.sideIncome} subtitle="This month" delta="+$340" />
      </div>

      {/* Three-column main area: Today's Focus | Progress Snapshot | Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Today's Focus</h3>
              <div className="text-sm text-gray-500">Refresh</div>
            </div>
            <div className="space-y-4">
              {todayTasks.map((t) => (
                <FocusItem key={t.title} {...t} />
              ))}
            </div>
            <div className="mt-4 border-t pt-3">
              <div className="text-xs text-gray-500">1 of 4 completed</div>
              <div className="mt-2 bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }} />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold">Progress Snapshot</h3>
                <p className="text-sm text-gray-500">Your achievements this week</p>
              </div>
              <div className="text-sm text-blue-600 font-medium">View All</div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col items-start gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">🧠</div>
                  <div>
                    <p className="text-sm text-gray-500">Skills Learned</p>
                    <p className="text-2xl font-bold text-indigo-700">3</p>
                    <p className="text-xs text-gray-400">+1 new skill</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">�</div>
                  <div>
                    <p className="text-sm text-gray-500">New Connections</p>
                    <p className="text-2xl font-bold text-teal-700">7</p>
                    <p className="text-xs text-gray-400">+2 this week</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Recent Achievements</h4>
              <div className="space-y-3">
                {[{
                  title: 'First Freelance Client',
                  desc: 'Successfully completed your first paid project',
                  score: '+100',
                  time: '2 hours ago',
                  color: 'bg-orange-500'
                },{
                  title: 'Learning Streak',
                  desc: 'Completed 7 days of continuous learning',
                  score: '+50',
                  time: '1 day ago',
                  color: 'bg-green-500'
                },{
                  title: 'Community Helper',
                  desc: 'Helped 5 community members with their questions',
                  score: '+75',
                  time: '3 days ago',
                  color: 'bg-emerald-500'
                }].map((a) => (
                  <div key={a.title} className="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
                    <div className={`w-10 h-10 rounded-xl ${a.color} flex items-center justify-center text-white`}>⭐</div>
                    <div className="flex-1">
                      <h4 className="font-medium">{a.title}</h4>
                      <p className="text-gray-500 text-sm">{a.desc}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-orange-500 font-semibold">{a.score}</div>
                      <div className="text-gray-400 text-xs">{a.time}</div>
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between mt-4 bg-white p-4 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white">💧</div>
                    <div>
                      <h4 className="font-semibold">Daily Streak</h4>
                      <p className="text-sm text-gray-500">Keep the momentum going!</p>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-orange-500">5</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold">Smart Recommendations</h3>
            <p className="text-sm text-gray-500">Personalized for Career Pivoteer</p>
            <div className="mt-4 space-y-4">
              {recommendations.map((r) => (
                <RecommendationCard key={r.title} {...r} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating CTA intentionally removed to avoid runtime errors and match requested design */}
    </div>
  );
};

export default DashboardHome;