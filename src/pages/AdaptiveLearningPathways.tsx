import React, { useState } from 'react';
import { Card } from '../components';
import SkillProgressBar from '../components/SkillProgressBar';
import LearningAnalytics from '../components/LearningAnalytics';

const AdaptiveLearningPathways: React.FC = () => {
  const [activeTab, setActiveTab] = useState('discover');

  const tabs = [
    { id: 'discover', label: 'Discover Paths' },
    { id: 'progress', label: 'My Progress' },
    { id: 'assessment', label: 'Skill Assessment' },
    { id: 'analytics', label: 'Learning Analytics' }
  ];

  const skillAssessmentData = {
    assessedSkills: 8,
    totalSkills: 12,
    avgScore: 78,
    monthlyIncrease: 12
  };

  const techSkills = [
    { name: 'JavaScript', level: 'Intermediate', progress: 75 },
    { name: 'Python', level: 'Beginner', progress: 45 },
    { name: 'React', level: 'Advanced', progress: 90 },
    { name: 'Node.js', level: 'Not Assessed', progress: 0 }
  ];

  const businessSkills = [
    { name: 'Project Management', level: 'Intermediate', progress: 65 },
    { name: 'Data Analysis', level: 'Beginner', progress: 30 }
  ];

  const designSkills = [
    { name: 'UI/UX Design', level: 'Intermediate', progress: 70 },
    { name: 'Graphic Design', level: 'Beginner', progress: 40 },
    { name: 'Prototyping', level: 'Advanced', progress: 85 },
    { name: 'User Research', level: 'Not Assessed', progress: 0 }
  ];

  const learningProgress = {
    activePaths: 3,
    completed: 5,
    hoursLearned: 127,
    certificates: 3
  };

  const currentPaths = [
    {
      title: 'Data Science Fundamentals',
      category: 'Data Science',
      progress: 65,
      modules: { completed: 10, total: 16 },
      timeLeft: '3 weeks',
      lastActivity: '2 hours ago',
      nextMilestone: 'Module 11: ML Basics'
    },
    {
      title: 'UI/UX Design Principles',
      category: 'Design',
      progress: 30,
      modules: { completed: 6, total: 20 },
      timeLeft: '7 weeks',
      lastActivity: '1 day ago',
      nextMilestone: 'Module 7: Prototyping'
    }
  ];

  const recommendations = [
    {
      title: 'Full-Stack Web Development',
      subtitle: 'Fills your JavaScript skill gap',
      description: 'Master modern web development with React, Node.js, and cloud deployment. Build real-world applications from scratch.',
      matchScore: 92,
      reasons: [
        'Aligns with your career goal in tech',
        'High market demand for these skills',
        'Builds on your existing knowledge'
      ]
    },
    {
      title: 'Data Science Fundamentals',
      subtitle: 'High demand in current market',
      description: 'Learn Python, statistics, and machine learning to extract insights from data and make data-driven decisions.',
      matchScore: 85,
      reasons: [
        'Growing field with 25% job growth',
        'Average salary increase of $15k',
        'Complements your analytical skills'
      ]
    }
  ];

  const analyticsData = {
    weeklyData: [
      { day: 'Mon', hours: 2.5 },
      { day: 'Tue', hours: 1.8 },
      { day: 'Wed', hours: 3.2 },
      { day: 'Thu', hours: 2.0 },
      { day: 'Fri', hours: 4.0 },
      { day: 'Sat', hours: 1.5 },
      { day: 'Sun', hours: 2.8 }
    ],
    focusAreas: [
      { category: 'Technology', percentage: 45, color: '#3b82f6' },
      { category: 'Business', percentage: 30, color: '#10b981' },
      { category: 'Design', percentage: 15, color: '#f59e0b' },
      { category: 'Marketing', percentage: 10, color: '#ef4444' }
    ],
    monthlyProgress: {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      enrolled: [15, 20, 28, 32, 30, 35],
      completed: [12, 18, 25, 30, 28, 32]
    },
    velocity: {
      monthComparison: '+25%',
      avgCompletion: '3.2 days',
      bestStreak: 12
    },
    milestones: {
      badge: '100 hours',
      expertLevel: '2 courses to go',
      monthlyGoal: '85% completed',
      hoursRemaining: 8
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Adaptive Learning Pathways</h1>
        <p className="text-gray-600">Personalized skill development powered by AI intelligence</p>

        <div className="flex space-x-6 mt-6 border-b">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-2 text-sm ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                  : 'text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'analytics' ? (
        <LearningAnalytics {...analyticsData} />
      ) : (
        <>
          {/* Skill Assessment Center */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">Skill Assessment Center</h2>
                <p className="text-gray-600 mb-6">Evaluate your current skills and discover learning opportunities</p>
            
            <div className="grid grid-cols-3 gap-8">
              <div>
                <p className="text-sm text-gray-600">Assessed Skills</p>
                <p className="text-2xl font-bold mt-1">
                  {skillAssessmentData.assessedSkills}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    out of {skillAssessmentData.totalSkills} skills
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Score</p>
                <p className="text-2xl font-bold mt-1">
                  {skillAssessmentData.avgScore}%
                  <span className="text-sm font-normal text-green-500 ml-2">
                    +{skillAssessmentData.monthlyIncrease}% this month
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Next Goal</p>
                <p className="text-xl font-bold mt-1">JavaScript Advanced</p>
                <p className="text-sm text-gray-600">25% to complete</p>
              </div>
            </div>
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            View All Results
          </button>
        </div>
      </div>

      {/* Technology Skills */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Technology</h2>
        <div className="space-y-4">
          {techSkills.map((skill, index) => (
            <SkillProgressBar
              key={index}
              name={skill.name}
              level={skill.level}
              progress={skill.progress}
            />
          ))}
        </div>
      </div>

      {/* Business Skills */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Business</h2>
        <div className="space-y-4">
          {businessSkills.map((skill, index) => (
            <SkillProgressBar
              key={index}
              name={skill.name}
              level={skill.level}
              progress={skill.progress}
            />
          ))}
        </div>
      </div>

      {/* Design Skills */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Design</h2>
        <div className="space-y-4">
          {designSkills.map((skill, index) => (
            <SkillProgressBar
              key={index}
              name={skill.name}
              level={skill.level}
              progress={skill.progress}
            />
          ))}
        </div>
      </div>

      {/* Quick Skill Check */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Quick Skill Check</h2>
            <p className="text-gray-600">Take a 5-minute assessment to get personalized learning recommendations</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Start Quick Check →
          </button>
        </div>
      </div>

      {/* Learning Progress */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">Your Learning Progress</h2>
            <p className="text-gray-600">Track your journey across all enrolled pathways</p>
          </div>
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            View Analytics
          </button>
        </div>

        <div className="grid grid-cols-4 gap-8 mb-8">
          <div>
            <p className="text-sm text-gray-600">Active Paths</p>
            <p className="text-2xl font-bold mt-1">{learningProgress.activePaths}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold mt-1">{learningProgress.completed}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Hours Learned</p>
            <p className="text-2xl font-bold mt-1">{learningProgress.hoursLearned}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Certificates</p>
            <p className="text-2xl font-bold mt-1">{learningProgress.certificates}</p>
          </div>
        </div>

        <h3 className="font-semibold mb-4">Current Learning Paths</h3>
        <div className="space-y-6">
          {currentPaths.map((path, index) => (
            <div key={index} className="border-b pb-6 last:border-b-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
                    {path.title}
                  </h4>
                  <p className="text-sm text-gray-500">{path.category}</p>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Continue
                </button>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${path.progress}%` }}
                />
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>Modules: {path.modules.completed}/{path.modules.total}</span>
                <span>Time Left: {path.timeLeft}</span>
                <span>Last Activity: {path.lastActivity}</span>
                <span>Next Milestone: {path.nextMilestone}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI-Powered Recommendations */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">AI-Powered Recommendations</h2>
        <p className="text-gray-600 mb-6">Personalized learning paths based on your goals and market trends</p>

        <div className="grid grid-cols-2 gap-6">
          {recommendations.map((path, index) => (
            <div key={index} className="border rounded-lg p-6 relative">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">×</button>
              
              <h3 className="text-lg font-semibold mb-2">{path.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{path.subtitle}</p>
              <p className="mb-4">{path.description}</p>

              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Match Score</span>
                  <span className="text-sm text-green-500">{path.matchScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${path.matchScore}%` }}
                  />
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Why This Path?</h4>
                <ul className="space-y-2">
                  {path.reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-600">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Start Learning Path →
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 border rounded-lg">
          <div className="flex items-center mb-2">
            <span className="text-yellow-500 mr-2">💡</span>
            <h4 className="font-medium">AI Learning Insight</h4>
          </div>
          <p className="text-sm text-gray-600">
            Based on your current skill set and career goals, focusing on data analysis and automation skills could increase your earning potential by 35% within the next 6 months.
            Consider combining technical skills with business acumen for maximum impact.
          </p>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default AdaptiveLearningPathways;