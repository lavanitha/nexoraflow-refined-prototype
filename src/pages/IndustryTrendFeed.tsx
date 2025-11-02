import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../contexts/ToastContext';

// TODO: replace demoTrendData with backend API
// TODO: wire subscribe endpoint
// TODO: integrate real company logos & job links

interface TrendingRole {
  id: string;
  title: string;
  tag: 'NEW ROLE' | 'HOT ROLE' | 'TOP PAYING';
  description: string;
  postedAt: string;
  salaryRange: { min: number; max: number };
  openingsCount: number;
  companies: string[];
  requiredSkills: string[];
  location: string;
  experience: string;
  industry: string;
}

interface Company {
  id: string;
  name: string;
  logo: string; // placeholder or emoji
  featuredRole: string;
  openRoles: number;
}

const IndustryTrendFeed: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [experienceLevel, setExperienceLevel] = useState<string>('all');
  const [timeWindow, setTimeWindow] = useState<number>(30); // days
  const [subscribeAlerts, setSubscribeAlerts] = useState<boolean>(false);
  const [subscribeEmail, setSubscribeEmail] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [showRoleDetails, setShowRoleDetails] = useState<string | null>(null);
  const { showSuccess, showInfo } = useToast();

  // Demo trending roles data
  const allRoles: TrendingRole[] = [
    {
      id: 'prompt-engineer',
      title: 'Prompt Engineer',
      tag: 'NEW ROLE',
      description: 'Design and optimize AI prompts to enhance LLM performance and accuracy for production systems.',
      postedAt: '2 days ago',
      salaryRange: { min: 1200000, max: 1800000 },
      openingsCount: 1240,
      companies: ['OpenAI', 'Anthropic', 'Google'],
      requiredSkills: ['Python', 'NLP', 'Machine Learning'],
      location: 'Remote',
      experience: '2-5 years',
      industry: 'AI',
    },
    {
      id: 'ar-vr-developer',
      title: 'AR/VR Developer',
      tag: 'HOT ROLE',
      description: 'Build immersive experiences using Unity, Unreal Engine for AR/VR applications and metaverse platforms.',
      postedAt: '1 week ago',
      salaryRange: { min: 1000000, max: 1500000 },
      openingsCount: 980,
      companies: ['Meta', 'Apple', 'Microsoft'],
      requiredSkills: ['Unity', 'C#', '3D Graphics'],
      location: 'San Francisco',
      experience: '3-7 years',
      industry: 'Tech',
    },
    {
      id: 'autonomous-systems',
      title: 'Autonomous Systems Engineer',
      tag: 'TOP PAYING',
      description: 'Develop self-driving vehicles, robotics, and autonomous systems with focus on perception and control.',
      postedAt: '3 days ago',
      salaryRange: { min: 1500000, max: 2200000 },
      openingsCount: 650,
      companies: ['Tesla', 'Waymo', 'Rivian'],
      requiredSkills: ['C++', 'ROS', 'Computer Vision'],
      location: 'Silicon Valley',
      experience: '5+ years',
      industry: 'Automotive',
    },
    {
      id: 'cloud-security',
      title: 'Cloud Security Analyst',
      tag: 'HOT ROLE',
      description: 'Protect cloud infrastructure, implement security policies, and respond to cyber threats in AWS/Azure environments.',
      postedAt: '5 days ago',
      salaryRange: { min: 900000, max: 1400000 },
      openingsCount: 1850,
      companies: ['AWS', 'Microsoft', 'IBM'],
      requiredSkills: ['AWS', 'Security', 'Compliance'],
      location: 'Hybrid',
      experience: '2-6 years',
      industry: 'Cloud',
    },
    {
      id: 'data-storyteller',
      title: 'Data Storyteller',
      tag: 'NEW ROLE',
      description: 'Transform complex data into compelling narratives using visualization tools and communication techniques.',
      postedAt: '4 days ago',
      salaryRange: { min: 800000, max: 1200000 },
      openingsCount: 720,
      companies: ['Tableau', 'Spotify', 'Netflix'],
      requiredSkills: ['Data Visualization', 'Storytelling', 'Analytics'],
      location: 'Remote',
      experience: '1-4 years',
      industry: 'Data',
    },
    {
      id: 'edge-ai-engineer',
      title: 'Edge AI Engineer',
      tag: 'HOT ROLE',
      description: 'Deploy AI models on edge devices, optimize for low latency and offline inference in IoT ecosystems.',
      postedAt: '1 day ago',
      salaryRange: { min: 1100000, max: 1600000 },
      openingsCount: 890,
      companies: ['NVIDIA', 'Intel', 'Qualcomm'],
      requiredSkills: ['TensorFlow Lite', 'Edge Computing', 'Python'],
      location: 'Remote',
      experience: '3-6 years',
      industry: 'AI',
    },
  ];

  // Demo companies
  const companies: Company[] = [
    { id: 'openai', name: 'OpenAI', logo: '🤖', featuredRole: 'Prompt Engineer', openRoles: 12 },
    { id: 'meta', name: 'Meta', logo: '📱', featuredRole: 'AR/VR Developer', openRoles: 8 },
    { id: 'tesla', name: 'Tesla', logo: '⚡', featuredRole: 'Autonomous Systems', openRoles: 15 },
    { id: 'aws', name: 'AWS', logo: '☁️', featuredRole: 'Cloud Security', openRoles: 20 },
  ];

  // Filter roles based on selections
  const filteredRoles = allRoles.filter((role) => {
    if (selectedIndustry !== 'all' && role.industry !== selectedIndustry) return false;
    if (selectedLocation !== 'all' && role.location !== selectedLocation) return false;
    return true;
  });

  // Calculate summary metrics
  const totalTrendingRoles = filteredRoles.length;
  const avgSalary = filteredRoles.length > 0
    ? Math.round(
        filteredRoles.reduce((sum, role) => sum + (role.salaryRange.min + role.salaryRange.max) / 2, 0) /
          filteredRoles.length
      )
    : 0;

  // Format salary
  const formatSalary = (amount: number): string => {
    return `₹${(amount / 100000).toFixed(2).replace('.', ',')}L`;
  };

  // Format openings
  const formatOpenings = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  // Handle subscribe toggle
  const handleSubscribeToggle = () => {
    setSubscribeAlerts(!subscribeAlerts);
    if (!subscribeAlerts) {
      showInfo('Subscription', 'Please enter your email below to subscribe');
    }
  };

  // Handle subscribe submit
  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire subscribe endpoint
    console.log('Subscribe:', subscribeEmail);
    showSuccess('Subscribed!', `You'll receive alerts at ${subscribeEmail}`);
    setSubscribeEmail('');
    setSubscribeAlerts(false);
  };

  // Handle view openings
  const handleViewOpenings = (roleId: string) => {
    setShowRoleDetails(roleId);
  };

  // Handle apply
  const handleApply = (roleId: string, company: string) => {
    console.log('Apply placeholder:', { roleId, company });
    alert('Apply placeholder - connect to job application API');
    showInfo('Application', 'Job application functionality coming soon');
  };

  // Handle company click
  const handleCompanyClick = (companyId: string) => {
    setSelectedCompany(companyId);
  };

  // Close modals on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowRoleDetails(null);
        setSelectedCompany(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Get tag color
  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'NEW ROLE':
        return 'bg-green-100 text-green-800';
      case 'HOT ROLE':
        return 'bg-red-100 text-red-800';
      case 'TOP PAYING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get selected role
  const selectedRoleData = showRoleDetails
    ? allRoles.find((r) => r.id === showRoleDetails)
    : null;

  // Get selected company data
  const selectedCompanyData = selectedCompany
    ? companies.find((c) => c.id === selectedCompany)
    : null;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Industry Trend Feed</h1>
          <p className="text-gray-600 max-w-2xl">
            Explore emerging roles, salaries, and opportunities to navigate your career strategy.
          </p>
        </div>
        <button
          onClick={() => {
            showInfo('Get Updates', 'Updates feature coming soon');
            console.log('Get Updates clicked');
          }}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 whitespace-nowrap"
          aria-label="Get updates"
        >
          Get Updates
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Filters & Controls */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Filters & Controls</h2>

            {/* Industry Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                aria-label="Select industry"
              >
                <option value="all">All Industries</option>
                <option value="AI">AI</option>
                <option value="Cloud">Cloud</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Tech">Tech</option>
                <option value="Automotive">Automotive</option>
                <option value="Data">Data</option>
              </select>
            </div>

            {/* Location Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                aria-label="Select location"
              >
                <option value="all">All Locations</option>
                <option value="Remote">Remote</option>
                <option value="San Francisco">San Francisco</option>
                <option value="Silicon Valley">Silicon Valley</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                aria-label="Select experience level"
              >
                <option value="all">All Levels</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
              </select>
            </div>

            {/* Time Window Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Window (days)
              </label>
              <input
                type="range"
                min="7"
                max="90"
                value={timeWindow}
                onChange={(e) => setTimeWindow(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                aria-label="Time window slider"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>7 days</span>
                <span>{timeWindow} days</span>
              </div>
            </div>

            {/* Subscribe to Alerts Toggle */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">
                  Subscribe to Alerts
                </label>
                <button
                  onClick={handleSubscribeToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    subscribeAlerts ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                  role="switch"
                  aria-checked={subscribeAlerts}
                  aria-label="Toggle subscribe to alerts"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      subscribeAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              {subscribeAlerts && (
                <form onSubmit={handleSubscribeSubmit} className="mt-3">
                  <input
                    type="email"
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                    aria-label="Email address for subscription"
                  />
                  <button
                    type="submit"
                    className="w-full mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Center Column - Main Feed */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          {/* Top Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredRoles.slice(0, 3).map((role) => (
              <div
                key={role.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTagColor(role.tag)}`}>
                    {role.tag}
                  </span>
                  <span className="text-xs text-gray-500">{role.postedAt}</span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{role.title}</h3>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{role.description}</p>
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Salary:</span>
                    <span className="font-semibold text-gray-900">
                      {formatSalary(role.salaryRange.min)} - {formatSalary(role.salaryRange.max)} / yr
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Openings:</span>
                    <span className="font-semibold text-gray-900">{formatOpenings(role.openingsCount)}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleViewOpenings(role.id)}
                  className="w-full text-xs text-primary-600 hover:text-primary-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
                  aria-label={`View openings for ${role.title}`}
                >
                  View Openings →
                </button>
              </div>
            ))}
          </div>

          {/* Skill Watch Block */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Watch</h3>
            <div className="space-y-3">
              {filteredRoles.slice(0, 3).map((role) => (
                <div
                  key={role.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900">{role.title}</h4>
                    <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
                      <span>{role.location}</span>
                      <span>•</span>
                      <span>{formatSalary((role.salaryRange.min + role.salaryRange.max) / 2)} / yr</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleApply(role.id, role.companies[0])}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    aria-label={`Apply for ${role.title}`}
                  >
                    Apply
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Companies Hiring */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Companies Hiring</h3>
              <div className="space-y-2">
                {companies.slice(0, 3).map((company) => (
                  <div
                    key={company.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                    onClick={() => handleCompanyClick(company.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleCompanyClick(company.id);
                      }
                    }}
                    aria-label={`View ${company.name} roles`}
                  >
                    <span className="text-xl">{company.logo}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">{company.name}</p>
                      <p className="text-xs text-gray-600">{company.openRoles} roles</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Insights</h3>
              <ul className="space-y-2 text-xs text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>AI roles showing 40% growth YoY</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Remote positions increasing 25%</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Salary premiums up 15% vs 2023</span>
                </li>
              </ul>
            </div>

            {/* Trending Skills */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Trending Skills</h3>
              <div className="flex flex-wrap gap-2">
                {['AI/ML', 'Cloud', 'Security', 'Data'].map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Snapshot & Insights */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Snapshot & Insights</h2>

            {/* Quick Metrics */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Trending Roles</p>
                <p className="text-2xl font-bold text-gray-900">{totalTrendingRoles}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Salary</p>
                <p className="text-2xl font-bold text-primary-600">{formatSalary(avgSalary * 10000)} / yr</p>
              </div>
            </div>

            {/* Companies Hiring Teaser */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Companies Hiring</h3>
              <div className="space-y-3">
                {companies.slice(0, 2).map((company) => (
                  <div
                    key={company.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleCompanyClick(company.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleCompanyClick(company.id);
                      }
                    }}
                    aria-label={`View ${company.name} roles`}
                  >
                    <div className="text-2xl">{company.logo}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{company.name}</p>
                      <p className="text-xs text-gray-600">{company.featuredRole}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Insights</h3>
              <ul className="space-y-2 text-sm text-gray-700 mb-4">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Emerging roles in AI/ML sector show 40% year-over-year growth.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Remote work opportunities continue to expand across tech industries.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Salary ranges have increased 15% compared to 2023 baseline.</span>
                </li>
              </ul>
              <button
                onClick={() => {
                  showInfo('Explore Pathways', 'Opening learning pathways...');
                  console.log('Explore Pathways');
                }}
                className="w-full text-xs text-primary-600 hover:text-primary-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="Explore learning pathways"
              >
                Explore learning pathways →
              </button>
            </div>

            {/* CTA Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  showInfo('Explore Pathways', 'Opening pathway recommendations...');
                  console.log('Explore Pathways clicked');
                }}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="Explore pathways"
              >
                Explore Pathways
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Role Details Modal (View Openings) */}
      {showRoleDetails && selectedRoleData && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
          onClick={() => setShowRoleDetails(null)}
          aria-label="Role details modal backdrop"
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="role-modal-title"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-gray-200 pb-4">
                <div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mb-2 ${getTagColor(selectedRoleData.tag)}`}>
                    {selectedRoleData.tag}
                  </span>
                  <h3 id="role-modal-title" className="text-xl font-bold text-gray-900">{selectedRoleData.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedRoleData.description}</p>
                </div>
                <button
                  onClick={() => setShowRoleDetails(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Job Listings */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Open Positions</h4>
                <div className="space-y-3">
                  {selectedRoleData.companies.map((company, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{company}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
                          <span>{selectedRoleData.location}</span>
                          <span>•</span>
                          <span>
                            {formatSalary(selectedRoleData.salaryRange.min)} - {formatSalary(selectedRoleData.salaryRange.max)} / yr
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleApply(selectedRoleData.id, company)}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        aria-label={`Apply at ${company}`}
                      >
                        Apply
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Skills */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRoleData.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Company Roles Modal */}
      {selectedCompany && selectedCompanyData && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCompany(null)}
          aria-label="Company roles modal backdrop"
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="company-modal-title"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-gray-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{selectedCompanyData.logo}</div>
                  <div>
                    <h3 id="company-modal-title" className="text-xl font-bold text-gray-900">{selectedCompanyData.name}</h3>
                    <p className="text-sm text-gray-600">{selectedCompanyData.openRoles} open roles</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Featured Role */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Featured Role</h4>
                <p className="text-base font-medium text-gray-900 mb-1">{selectedCompanyData.featuredRole}</p>
                <button
                  onClick={() => {
                    const role = allRoles.find((r) => r.companies.includes(selectedCompanyData.name));
                    if (role) {
                      handleApply(role.id, selectedCompanyData.name);
                    }
                  }}
                  className="mt-3 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  aria-label={`Apply for ${selectedCompanyData.featuredRole} at ${selectedCompanyData.name}`}
                >
                  Apply Now
                </button>
              </div>

              {/* All Open Roles */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">All Open Roles</h4>
                <div className="space-y-3">
                  {allRoles
                    .filter((role) => role.companies.includes(selectedCompanyData.name))
                    .map((role) => (
                      <div
                        key={role.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{role.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{role.location} • {role.experience}</p>
                        </div>
                        <button
                          onClick={() => handleApply(role.id, selectedCompanyData.name)}
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                          aria-label={`Apply for ${role.title} at ${selectedCompanyData.name}`}
                        >
                          Apply
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustryTrendFeed;

