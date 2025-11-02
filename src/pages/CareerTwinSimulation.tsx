import React, { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { compareCareers, saveComparison, checkHealth } from '../api/careerCompare'; // API integration import

interface CareerPath {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  projectedSkill: number;
  salary: number;
  demand: number;
  skills: string[];
  growthData: number[];
  color: string;
}

const CareerTwinSimulation: React.FC = () => {
  const [timeline, setTimeline] = useState<number>(2); // years
  const [resolution, setResolution] = useState<number>(24); // months
  const [selectedCareer, setSelectedCareer] = useState<string>('frontend');
  const [showDetailsModal, setShowDetailsModal] = useState<string | null>(null);
  const [swapped, setSwapped] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); // Loading state for API calls
  const [simulationResult, setSimulationResult] = useState<any>(null); // Store API simulation result
  const [dbConfigured, setDbConfigured] = useState<boolean>(false); // Track if DB is configured
  const { showSuccess, showInfo, showError } = useToast();

  // Demo skills data
  const skills = [
    { name: 'JavaScript', level: 72 },
    { name: 'React', level: 65 },
    { name: 'SQL', level: 45 },
    { name: 'Communication', level: 84 },
  ];

  // Demo career paths
  const [careers] = useState<CareerPath[]>([
    {
      id: 'frontend',
      title: 'Frontend Engineer',
      subtitle: 'Top opportunity',
      description: 'Build client-facing web apps using modern front-end stacks. Strong demand for engineers.',
      projectedSkill: 82,
      salary: 870000,
      demand: 87,
      skills: ['JavaScript', 'React', 'UI/UX'],
      growthData: [65, 68, 72, 75, 78, 80, 82],
      color: '#6366f1', // indigo
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      subtitle: 'Alternative high-growth path',
      description: 'Work with data to extract insights, build ML models and produce business impact.',
      projectedSkill: 86,
      salary: 910000,
      demand: 76,
      skills: ['Python', 'SQL', 'Machine Learning'],
      growthData: [55, 60, 65, 70, 75, 80, 86],
      color: '#14b8a6', // teal
    },
    {
      id: 'devops',
      title: 'DevOps Engineer',
      subtitle: 'Infrastructure path',
      description: 'Automate deployment pipelines, manage cloud infrastructure, and ensure system reliability.',
      projectedSkill: 78,
      salary: 950000,
      demand: 82,
      skills: ['AWS', 'Docker', 'Kubernetes'],
      growthData: [60, 64, 68, 72, 75, 77, 78],
      color: '#8b5cf6', // purple
    },
  ]);

  // Get displayed careers (swapped if needed)
  const leftCareer = swapped ? careers[1] : careers[0];
  const rightCareer = swapped ? careers[0] : careers[1];

  // Calculate chart data based on timeline - use API result if available
  const getChartData = (career: CareerPath, careerKey: 'career1' | 'career2') => {
    // If we have simulation result, use it
    if (simulationResult?.projected_skill_timeline?.[careerKey]) {
      return simulationResult.projected_skill_timeline[careerKey];
    }
    
    // Fallback to demo data
    const months = timeline * 12;
    const steps = Math.floor(months / resolution);
    const data = [];
    const startSkill = 65;
    const endSkill = career.projectedSkill;
    
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const skill = startSkill + (endSkill - startSkill) * progress;
      data.push({ month: i * resolution, score: Math.round(skill) });
    }
    
    return data;
  };

  const leftChartData = getChartData(leftCareer, swapped ? 'career2' : 'career1');
  const rightChartData = getChartData(rightCareer, swapped ? 'career1' : 'career2');

  // Check if DB is configured on mount
  useEffect(() => {
    checkHealth().then((health) => {
      setDbConfigured(!!health.mongo_set);
    }).catch(() => {
      setDbConfigured(false);
    });
  }, []);

  // Run simulation when relevant parameters change
  useEffect(() => {
    // Use current careers based on swapped state
    const currentLeftCareer = swapped ? careers[1] : careers[0];
    const currentRightCareer = swapped ? careers[0] : careers[1];
    
    const executeSimulation = async () => {
      setLoading(true);
      try {
        const result = await compareCareers({
          career1: currentLeftCareer.title,
          career2: currentRightCareer.title,
          timelineYears: timeline,
          resolutionMonths: resolution,
          userSkills: skills.map(s => ({ name: s.name, score: s.level })),
          location: 'India',
        });
        setSimulationResult(result);
        // Only show success toast if simulation was triggered manually, not on mount
        if (simulationResult !== null) {
          showSuccess('Simulation Complete', 'Career comparison generated successfully');
        }
      } catch (error: any) {
        console.error('Simulation error:', error);
        showError('Simulation Failed', error.message || 'Failed to run simulation');
      } finally {
        setLoading(false);
      }
    };
    
    executeSimulation();
  }, [timeline, resolution, swapped]); // Re-run when these change

  // Handle swap sides
  const handleSwapSides = () => {
    setSwapped(!swapped);
    showInfo('Careers Swapped', 'Career comparison order has been swapped');
    // Simulation will automatically re-run via useEffect
  };

  // Handle reset scenario
  const handleResetScenario = () => {
    setTimeline(2);
    setResolution(24);
    setSwapped(false);
    setSelectedCareer('frontend');
    showInfo('Scenario Reset', 'All settings have been reset to defaults');
  };

  // Handle apply path
  const handleApplyPath = (careerId: string) => {
    console.log('Path applied:', careerId);
    showSuccess('Path Applied', 'Career path has been added to your learning plan');
  };

  // Handle view details
  const handleViewDetails = (careerId: string) => {
    setShowDetailsModal(careerId);
  };

  // Handle export snapshot
  const handleExportSnapshot = async () => {
    if (!dbConfigured) {
      showError('Database Not Configured', 'MONGO_URI is not set. Save functionality is disabled.');
      return;
    }
    if (!simulationResult) {
      showError('No Simulation', 'Please run a simulation first before saving.');
      return;
    }
    try {
      const result = await saveComparison({
        userId: 'user-' + Date.now(), // Temporary user ID - replace with actual user ID
        career1: leftCareer.title,
        career2: rightCareer.title,
        simulationResult: simulationResult,
        metadata: {
          timelineYears: timeline,
          resolutionMonths: resolution,
          createdAt: new Date().toISOString(),
        },
      });
      showSuccess('Snapshot Saved', 'Comparison saved to database successfully');
    } catch (error: any) {
      console.error('Save error:', error);
      showError('Save Failed', error.message || 'Failed to save comparison');
    }
  };

  // Handle share
  const handleShare = () => {
    // TODO: integrate share API
    console.log('Share simulation');
    showInfo('Share', 'Simulation link copied to clipboard');
  };

  // Close modal on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showDetailsModal) {
        setShowDetailsModal(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showDetailsModal]);

  // Get selected career details
  const selectedCareerData = careers.find(c => c.id === selectedCareer) || careers[0];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Career Twin Simulation</h1>
          <p className="text-gray-600 max-w-2xl">
            Compare two future career paths side-by-side — forecast skill growth, timelines, and salary. Interact with simulations and choose the path that fits goals.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleShare}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Share simulation"
          >
            Share
          </button>
          <button
            onClick={handleExportSnapshot}
            disabled={!dbConfigured || loading}
            className={`px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              !dbConfigured ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Export snapshot"
            title={!dbConfigured ? 'DB not configured' : 'Save comparison to database'}
          >
            Export Snapshot
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Simulation Controls */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Simulation Controls</h2>

            {/* Timeline (years) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeline (years)
              </label>
              <input
                type="number"
                min="1"
                max="6"
                value={timeline}
                onChange={(e) => setTimeline(Math.max(1, Math.min(6, Number(e.target.value))))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                aria-label="Timeline in years"
              />
            </div>

            {/* Resolution (months) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resolution (months)
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                aria-label="Resolution in months"
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={36}>36</option>
              </select>
            </div>

            {/* Your Skills */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Your Skills (quick demo)</h3>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm text-gray-900">{skill.name}</span>
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-semibold">
                      {skill.level}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <button
                onClick={handleSwapSides}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="Swap career comparison sides"
              >
                Swap Sides
              </button>
              <button
                onClick={handleResetScenario}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="Reset scenario"
              >
                Reset Scenario
              </button>
            </div>
          </div>
        </div>

        {/* Center Column - Compare Future Careers */}
        <div className="col-span-12 lg:col-span-6">
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Compare Future Careers</h2>
              <p className="text-sm text-gray-600">
                Compare two future career paths side-by-side — forecast skill growth, timelines, and salary.
              </p>
            </div>

            {/* Chart Area */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="relative" style={{ height: '300px' }}>
                <svg width="100%" height="100%" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet">
                  {/* Grid lines */}
                  {[0, 25, 50, 75, 100].map((val) => (
                    <g key={val}>
                      <line
                        x1="50"
                        y1={250 - val * 2}
                        x2="550"
                        y2={250 - val * 2}
                        stroke="#e5e7eb"
                        strokeWidth="1"
                      />
                      <text x="45" y={250 - val * 2 + 4} fontSize="10" fill="#6b7280" textAnchor="end">
                        {val}%
                      </text>
                    </g>
                  ))}

                  {/* Left career line */}
                  <polyline
                    points={leftChartData
                      .map((d, i) => `${50 + (i * 500) / Math.max(1, leftChartData.length - 1)},${250 - (d.score || d.skill) * 2}`)
                      .join(' ')}
                    fill="none"
                    stroke={leftCareer.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {leftChartData.map((d, i) => (
                    <circle
                      key={`left-${i}`}
                      cx={50 + (i * 500) / Math.max(1, leftChartData.length - 1)}
                      cy={250 - (d.score || d.skill) * 2}
                      r="4"
                      fill={leftCareer.color}
                    />
                  ))}

                  {/* Right career line */}
                  <polyline
                    points={rightChartData
                      .map((d, i) => `${50 + (i * 500) / Math.max(1, rightChartData.length - 1)},${250 - (d.score || d.skill) * 2}`)
                      .join(' ')}
                    fill="none"
                    stroke={rightCareer.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {rightChartData.map((d, i) => (
                    <circle
                      key={`right-${i}`}
                      cx={50 + (i * 500) / Math.max(1, rightChartData.length - 1)}
                      cy={250 - (d.score || d.skill) * 2}
                      r="4"
                      fill={rightCareer.color}
                    />
                  ))}

                  {/* X-axis labels */}
                  {leftChartData.map((d, i) => {
                    if (i % Math.ceil(leftChartData.length / 4) === 0 || i === leftChartData.length - 1) {
                      return (
                        <text
                          key={`label-${i}`}
                          x={50 + (i * 500) / Math.max(1, leftChartData.length - 1)}
                          y={270}
                          fontSize="10"
                          fill="#6b7280"
                          textAnchor="middle"
                        >
                          {d.month}m
                        </text>
                      );
                    }
                    return null;
                  })}
                </svg>

                {/* Chart Legend */}
                <div className="absolute top-4 right-4 flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: leftCareer.color }} />
                    <span className="text-xs text-gray-700">{leftCareer.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: rightCareer.color }} />
                    <span className="text-xs text-gray-700">{rightCareer.title}</span>
                  </div>
                </div>
              </div>

              {/* Projected values below chart - use API result if available */}
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Projected skill (end)</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {simulationResult?.projected_skill_timeline?.[swapped ? 'career2' : 'career1']?.[simulationResult.projected_skill_timeline[swapped ? 'career2' : 'career1'].length - 1]?.score || leftCareer.projectedSkill}%
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Salary: {simulationResult?.salary?.currency === 'INR' ? '₹' : '$'}
                    {(simulationResult?.salary?.[swapped ? 'career2' : 'career1'] || leftCareer.salary).toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Demand: {Math.round((simulationResult?.demand_score?.[swapped ? 'career2' : 'career1'] || leftCareer.demand / 100) * 100)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Projected skill (end)</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {simulationResult?.projected_skill_timeline?.[swapped ? 'career1' : 'career2']?.[simulationResult.projected_skill_timeline[swapped ? 'career1' : 'career2'].length - 1]?.score || rightCareer.projectedSkill}%
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Salary: {simulationResult?.salary?.currency === 'INR' ? '₹' : '$'}
                    {(simulationResult?.salary?.[swapped ? 'career1' : 'career2'] || rightCareer.salary).toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Demand: {Math.round((simulationResult?.demand_score?.[swapped ? 'career1' : 'career2'] || rightCareer.demand / 100) * 100)}%
                  </p>
                </div>
              </div>
              {loading && (
                <div className="text-center py-2 text-sm text-gray-500">
                  Running simulation...
                </div>
              )}
            </div>

            {/* Career Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Frontend Engineer Card */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-1">{leftCareer.title}</h3>
                <p className="text-xs text-gray-600 mb-3">{leftCareer.subtitle}</p>
                <p className="text-sm text-gray-700 mb-4">{leftCareer.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApplyPath(leftCareer.id)}
                    className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    aria-label={`Apply ${leftCareer.title} path`}
                  >
                    Apply Path
                  </button>
                  <button
                    onClick={() => handleViewDetails(leftCareer.id)}
                    className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    aria-label={`View ${leftCareer.title} details`}
                  >
                    View Details
                  </button>
                </div>
              </div>

              {/* Data Scientist Card */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-1">{rightCareer.title}</h3>
                <p className="text-xs text-gray-600 mb-3">{rightCareer.subtitle}</p>
                <p className="text-sm text-gray-700 mb-4">{rightCareer.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApplyPath(rightCareer.id)}
                    className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    aria-label={`Apply ${rightCareer.title} path`}
                  >
                    Apply Path
                  </button>
                  <button
                    onClick={() => handleViewDetails(rightCareer.id)}
                    className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    aria-label={`View ${rightCareer.title} details`}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="text-gray-600">Demand: </span>
                    <span className="font-semibold text-gray-900">{leftCareer.demand}% vs {rightCareer.demand}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Salary (end): </span>
                    <span className="font-semibold text-gray-900">
                      ₹{(leftCareer.salary / 1000).toFixed(0)}k vs ₹{(rightCareer.salary / 1000).toFixed(0)}k
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const nextCareer = careers.find(c => c.id !== leftCareer.id && c.id !== rightCareer.id) || careers[2];
                    setShowDetailsModal(nextCareer.id);
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  aria-label="View next career path"
                >
                  Next Path
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Scenario Snapshot */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Scenario Snapshot</h2>

            {/* Selected Career Details */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Selected Career Details</h3>
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-1">{selectedCareerData.title}</h4>
                <p className="text-xs text-gray-600">{selectedCareerData.subtitle}</p>
              </div>

              {/* Skill Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCareerData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Insights</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Use micro-projects to increase match scores quickly.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Consider demand & salary projections together—they shift with market trends.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Backup path suggestions reduce risk when the primary path shows variance.
                  </span>
                </li>
              </ul>
            </div>

            {/* CTA Section */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-3">Explore more paths to refine your career +</p>
              <button
                onClick={() => {
                  const nextCareer = careers.find(c => c.id !== selectedCareer) || careers[1];
                  setSelectedCareer(nextCareer.id);
                  setShowDetailsModal(nextCareer.id);
                }}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="Explore next path"
              >
                Next Path
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {showDetailsModal && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
          onClick={() => setShowDetailsModal(null)}
          aria-label="Career details modal backdrop"
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {(() => {
              const career = careers.find(c => c.id === showDetailsModal) || careers[0];
              return (
                <div className="p-6 space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between border-b border-gray-200 pb-4">
                    <div>
                      <h3 id="modal-title" className="text-xl font-bold text-gray-900">{career.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{career.subtitle}</p>
                    </div>
                    <button
                      onClick={() => setShowDetailsModal(null)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Close modal"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700">{career.description}</p>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-600 mb-1">Projected Skill</p>
                      <p className="text-2xl font-bold text-gray-900">{career.projectedSkill}%</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-600 mb-1">Salary</p>
                      <p className="text-2xl font-bold text-gray-900">₹{(career.salary / 1000).toFixed(0)}k</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-600 mb-1">Demand</p>
                      <p className="text-2xl font-bold text-gray-900">{career.demand}%</p>
                    </div>
                  </div>

                  {/* Growth Projection Sparkline */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Skill Growth Projection</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="h-32 flex items-end gap-2">
                        {career.growthData.map((value, idx) => {
                          const height = (value / 100) * 120;
                          return (
                            <div
                              key={idx}
                              className="flex-1 bg-primary-500 rounded-t"
                              style={{ height: `${height}px` }}
                              title={`Month ${idx * 4}: ${value}%`}
                            />
                          );
                        })}
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 mt-2">
                        <span>Start</span>
                        <span>End</span>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {career.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        handleApplyPath(career.id);
                        setShowDetailsModal(null);
                      }}
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      aria-label={`Apply ${career.title} path`}
                    >
                      Apply Path
                    </button>
                    <button
                      onClick={() => setShowDetailsModal(null)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      aria-label="Close modal"
                    >
                      Close
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerTwinSimulation;


