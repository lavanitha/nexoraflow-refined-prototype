import React, { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';

// TODO: connect failure-risk model API
// TODO: fetch real job openings API
// TODO: wire reskill plan backend

interface Role {
  id: string;
  title: string;
  baseSalary: number;
  avgSalary: number;
  openings: number;
  riskProfile: {
    currentRisk: number;
    projectedRisk: number;
    missingSkills: string[];
  };
  backupCareers: {
    id: string;
    title: string;
    skills: string[];
    avgSalary: number;
    openings: number;
  }[];
  reskillPlan: {
    steps: string[];
    duration: string;
    difficulty: string;
  };
}

const FailurePathwayForecasting: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('backend-dev');
  const [experienceLevel, setExperienceLevel] = useState<number>(50);
  const [projectionWindow, setProjectionWindow] = useState<number>(5); // years
  const [riskTolerance, setRiskTolerance] = useState<number>(50);
  const [hoverYear, setHoverYear] = useState<number | null>(null);
  const [showReskillModal, setShowReskillModal] = useState<boolean>(false);
  const [selectedBackupCareer, setSelectedBackupCareer] = useState<string | null>(null);
  const { showSuccess, showInfo } = useToast();

  // Demo roles data
  const roles: Role[] = [
    {
      id: 'backend-dev',
      title: 'Backend Developer',
      baseSalary: 1100000,
      avgSalary: 1150000,
      openings: 8500,
      riskProfile: {
        currentRisk: 35,
        projectedRisk: 65,
        missingSkills: ['Cloud Architecture', 'Microservices', 'Kubernetes'],
      },
      backupCareers: [
        {
          id: 'devops',
          title: 'DevOps Engineer',
          skills: ['CI/CD', 'AWS', 'Docker'],
          avgSalary: 1200000,
          openings: 6200,
        },
        {
          id: 'cloud-architect',
          title: 'Cloud Architect',
          skills: ['AWS', 'Azure', 'System Design'],
          avgSalary: 1500000,
          openings: 3200,
        },
      ],
      reskillPlan: {
        steps: [
          'Complete Cloud Architecture fundamentals (2 months)',
          'Learn Kubernetes and containerization (3 months)',
          'Build microservices project portfolio (2 months)',
          'Get AWS/GCP certification (1 month)',
        ],
        duration: '8 months',
        difficulty: 'Intermediate',
      },
    },
    {
      id: 'frontend-engineer',
      title: 'Frontend Engineer',
      baseSalary: 1000000,
      avgSalary: 1050000,
      openings: 12000,
      riskProfile: {
        currentRisk: 40,
        projectedRisk: 70,
        missingSkills: ['React Native', 'Next.js', 'TypeScript Advanced'],
      },
      backupCareers: [
        {
          id: 'fullstack',
          title: 'Full Stack Developer',
          skills: ['React', 'Node.js', 'Database Design'],
          avgSalary: 1300000,
          openings: 9800,
        },
        {
          id: 'mobile-dev',
          title: 'Mobile Developer',
          skills: ['React Native', 'Flutter', 'iOS/Android'],
          avgSalary: 1150000,
          openings: 7500,
        },
      ],
      reskillPlan: {
        steps: [
          'Master Next.js and SSR concepts (2 months)',
          'Learn TypeScript advanced patterns (1.5 months)',
          'Build production React Native apps (3 months)',
          'Complete full-stack project showcase (1.5 months)',
        ],
        duration: '8 months',
        difficulty: 'Intermediate',
      },
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      baseSalary: 1200000,
      avgSalary: 1250000,
      openings: 6500,
      riskProfile: {
        currentRisk: 30,
        projectedRisk: 55,
        missingSkills: ['MLOps', 'Deep Learning', 'Production ML'],
      },
      backupCareers: [
        {
          id: 'ml-engineer',
          title: 'ML Engineer',
          skills: ['MLOps', 'TensorFlow', 'Model Deployment'],
          avgSalary: 1400000,
          openings: 4100,
        },
        {
          id: 'data-engineer',
          title: 'Data Engineer',
          skills: ['ETL', 'Data Pipelines', 'Big Data'],
          avgSalary: 1180000,
          openings: 7200,
        },
      ],
      reskillPlan: {
        steps: [
          'Complete MLOps specialization course (3 months)',
          'Build end-to-end ML production system (2 months)',
          'Learn deep learning frameworks (TensorFlow/PyTorch) (2 months)',
          'Deploy models to production environments (1 month)',
        ],
        duration: '8 months',
        difficulty: 'Advanced',
      },
    },
  ];

  const currentRole = roles.find((r) => r.id === selectedRole) || roles[0];

  // Calculate risk curve data (simple simulation model)
  const calculateRiskData = () => {
    const years = projectionWindow;
    const baseRisk = currentRole.riskProfile.currentRisk;
    const endRisk = currentRole.riskProfile.projectedRisk;
    const experienceFactor = 1 - experienceLevel / 100;
    const toleranceFactor = riskTolerance / 100;

    const riskPoints: number[] = [];
    const missingRiskPoints: number[] = [];

    for (let i = 0; i <= years; i++) {
      const progress = i / years;
      // Simulated risk growth with factors
      const risk = Math.min(
        100,
        baseRisk + (endRisk - baseRisk) * progress * (1 + experienceFactor * 0.3) * (1 + toleranceFactor * 0.2)
      );
      riskPoints.push(Math.round(risk));

      // Missing skills risk (complementary curve)
      const missingRisk = Math.min(100, risk * 0.85);
      missingRiskPoints.push(Math.round(missingRisk));
    }

    return { riskPoints, missingRiskPoints };
  };

  const { riskPoints, missingRiskPoints } = calculateRiskData();

  // Format salary
  const formatSalary = (amount: number): string => {
    return `₹${(amount / 100000).toFixed(2).replace('.', ',')}L`;
  };

  // Format salary full (₹11,50,000)
  const formatSalaryFull = (amount: number): string => {
    const formatted = amount.toLocaleString('en-IN');
    return `₹${formatted}`;
  };

  // Format openings
  const formatOpenings = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  // Get tooltip data for endpoint
  const getTooltipData = () => {
    const year = projectionWindow;
    const risk = riskPoints[riskPoints.length - 1];
    const missingRisk = missingRiskPoints[missingRiskPoints.length - 1];
    const jobPostings = Math.round(currentRole.openings * (1 - risk / 100));

    return {
      year,
      risk,
      missingRisk,
      jobPostings,
    };
  };

  const tooltipData = getTooltipData();

  // Handle download report
  const handleDownloadReport = () => {
    // TODO: implement export (html2canvas / server)
    console.log('Download Report:', {
      role: selectedRole,
      experienceLevel,
      projectionWindow,
      riskTolerance,
      riskData: riskPoints,
    });
    alert('Download Report placeholder - connect to export API');
    showInfo('Report Generation', 'Report download functionality coming soon');
  };

  // Handle apply for backup career
  const handleApplyBackupCareer = (careerId: string) => {
    console.log('Apply backup career:', careerId);
    alert('Apply placeholder - connect to job application API');
    showInfo('Application', 'Job application functionality coming soon');
  };

  // Handle reskill plan
  const handleReskillPlan = () => {
    setShowReskillModal(true);
  };

  // Close modals on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowReskillModal(false);
        setSelectedBackupCareer(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const chartHeight = 280;
  const chartWidth = 500;
  const maxRisk = 100;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Failure Pathway Forecasting</h1>
          <p className="text-gray-600 max-w-2xl">
            Analyze skill gaps, forecast job attrition risk, and suggest backup career options.
          </p>
        </div>
        <button
          onClick={handleDownloadReport}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 whitespace-nowrap"
          aria-label="Download report"
        >
          Download Report
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Inputs */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Inputs</h2>

            {/* Role Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                aria-label="Select role"
              >
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience Level Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                aria-label="Experience level slider"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Junior</span>
                <span>Senior</span>
              </div>
            </div>

            {/* Projection Window Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Projection Window (years)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={projectionWindow}
                onChange={(e) => setProjectionWindow(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                aria-label="Projection window in years"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>1 year</span>
                <span>{projectionWindow} years</span>
              </div>
            </div>

            {/* Risk Tolerance Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Risk Tolerance
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={riskTolerance}
                onChange={(e) => setRiskTolerance(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                aria-label="Risk tolerance slider"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column - Forecast Attrition Risk */}
        <div className="col-span-12 lg:col-span-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Forecast Attrition Risk</h2>

            {/* Risk Chart */}
            <div className="bg-gray-50 rounded-lg p-4 relative">
              <div className="relative" style={{ height: '350px' }}>
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 600 300"
                  preserveAspectRatio="xMidYMid meet"
                  className="overflow-visible"
                >
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

                  {/* X-axis labels (Years) */}
                  {Array.from({ length: projectionWindow + 1 }, (_, i) => i + 1).map((year) => {
                    const x = 50 + ((year - 1) / projectionWindow) * 500;
                    return (
                      <text
                        key={year}
                        x={x}
                        y={280}
                        fontSize="11"
                        fill="#6b7280"
                        textAnchor="middle"
                      >
                        {year}
                      </text>
                    );
                  })}

                  {/* Y-axis label */}
                  <text
                    x="20"
                    y="150"
                    fontSize="11"
                    fill="#6b7280"
                    textAnchor="middle"
                    transform="rotate(-90 20 150)"
                  >
                    Risk Level
                  </text>

                  {/* X-axis label */}
                  <text
                    x="300"
                    y="295"
                    fontSize="11"
                    fill="#6b7280"
                    textAnchor="middle"
                  >
                    Years
                  </text>

                  {/* Missing Risk area (light red fill) */}
                  <polygon
                    points={`50,250 ${missingRiskPoints
                      .map((value, index) => {
                        const x = 50 + (index / projectionWindow) * 500;
                        const y = 250 - (value / maxRisk) * 200;
                        return `${x},${y}`;
                      })
                      .join(' ')} 50 + ${(projectionWindow / projectionWindow) * 500},250`}
                    fill="rgba(239, 68, 68, 0.2)"
                    stroke="none"
                  />

                  {/* Attrition Risk line (red) */}
                  <polyline
                    points={riskPoints
                      .map((value, index) => {
                        const x = 50 + (index / projectionWindow) * 500;
                        const y = 250 - (value / maxRisk) * 200;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Risk points */}
                  {riskPoints.map((value, index) => {
                    const x = 50 + (index / projectionWindow) * 500;
                    const y = 250 - (value / maxRisk) * 200;
                    return (
                      <circle
                        key={index}
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#ef4444"
                      />
                    );
                  })}

                  {/* Tooltip line (vertical dashed at endpoint) */}
                  <line
                    x1={50 + ((projectionWindow - 1) / projectionWindow) * 500}
                    y1="50"
                    x2={50 + ((projectionWindow - 1) / projectionWindow) * 500}
                    y2="250"
                    stroke="#94a3b8"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                </svg>

                {/* Tooltip at endpoint */}
                <div
                  className="absolute bg-white rounded-lg shadow-lg border border-gray-200 p-3"
                  style={{
                    right: '20px',
                    top: '20px',
                    minWidth: '200px',
                  }}
                >
                  <div className="text-sm font-semibold text-gray-900 mb-2">
                    {tooltipData.year} {tooltipData.year === 1 ? 'Year' : 'Years'}
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Missing Risk:</span>
                      <span className="font-semibold text-gray-900">{tooltipData.missingRisk}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Attrition Risk:</span>
                      <span className="font-semibold text-red-600">{tooltipData.risk}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Job Postings:</span>
                      <span className="font-semibold text-gray-900">{formatOpenings(tooltipData.jobPostings)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Skills Gap Analysis */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Skills Gap Analysis</h3>
                <ul className="space-y-2 text-xs text-gray-700">
                  {currentRole.riskProfile.missingSkills.map((skill, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 text-red-500">•</span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Reskill and Evolve */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Reskill and Evolve</h3>
                <p className="text-xs text-gray-600 mb-3">
                  Duration: {currentRole.reskillPlan.duration}
                </p>
                <button
                  onClick={handleReskillPlan}
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  aria-label="View reskill plan"
                >
                  Reskill Plan
                </button>
              </div>

              {/* Backup Career Option */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Backup Career Option</h3>
                {currentRole.backupCareers[0] && (
                  <>
                    <p className="text-xs font-medium text-gray-900 mb-1">
                      {currentRole.backupCareers[0].title}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {currentRole.backupCareers[0].skills.slice(0, 2).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-gray-600">Avg Salary:</span>
                      <span className="font-semibold text-gray-900">
                        {formatSalary(currentRole.backupCareers[0].avgSalary * 10000)}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedBackupCareer(currentRole.backupCareers[0].id)}
                      className="w-full text-xs text-primary-600 hover:text-primary-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      aria-label={`Explore ${currentRole.backupCareers[0].title}`}
                    >
                      Explore More →
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Insights & Actions */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Insights & Actions</h2>

            {/* Risk Causes */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Risk Causes</h3>
              <ul className="space-y-2 text-xs text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2 text-red-500">•</span>
                  <span>Missing critical skills: {currentRole.riskProfile.missingSkills.slice(0, 2).join(', ')}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-red-500">•</span>
                  <span>Technology shift reducing demand for traditional skills</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-red-500">•</span>
                  <span>Market competition from new talent pools</span>
                </li>
              </ul>
            </div>

            {/* Recommended Mitigations */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Recommended Mitigations</h3>
              <div className="space-y-2">
                {[
                  'Complete reskill plan within 8 months',
                  'Build portfolio projects demonstrating new skills',
                  'Network with professionals in backup career paths',
                  'Consider side projects to bridge skill gaps',
                ].map((mitigation, index) => (
                  <label
                    key={index}
                    className="flex items-start cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      aria-label={mitigation}
                    />
                    <span className="text-xs text-gray-700">{mitigation}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="pt-4 border-t border-gray-200">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Avg Salary</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatSalary(currentRole.avgSalary * 10000)} / yr
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Job Openings</p>
                  <p className="text-lg font-bold text-primary-600">
                    {formatOpenings(currentRole.openings)}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  showInfo('Explore More', 'Opening additional resources...');
                  console.log('Explore More clicked');
                }}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="Explore more resources"
              >
                Explore More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reskill Plan Modal */}
      {showReskillModal && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
          onClick={() => setShowReskillModal(false)}
          aria-label="Reskill plan modal backdrop"
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="reskill-modal-title"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-gray-200 pb-4">
                <div>
                  <h3 id="reskill-modal-title" className="text-xl font-bold text-gray-900">
                    Reskill Plan - {currentRole.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Duration: {currentRole.reskillPlan.duration} • Difficulty: {currentRole.reskillPlan.difficulty}
                  </p>
                </div>
                <button
                  onClick={() => setShowReskillModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Steps */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Learning Steps</h4>
                <ol className="space-y-3">
                  {currentRole.reskillPlan.steps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-semibold mr-3">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-700 pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Action */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    showSuccess('Plan Saved', 'Reskill plan added to your learning goals');
                    setShowReskillModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  aria-label="Save reskill plan"
                >
                  Save Plan
                </button>
                <button
                  onClick={() => setShowReskillModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  aria-label="Close modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backup Career Modal */}
      {selectedBackupCareer && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedBackupCareer(null)}
          aria-label="Backup career modal backdrop"
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="backup-modal-title"
          >
            {(() => {
              const backupCareer = currentRole.backupCareers.find((c) => c.id === selectedBackupCareer);
              if (!backupCareer) return null;

              return (
                <div className="p-6 space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between border-b border-gray-200 pb-4">
                    <div>
                      <h3 id="backup-modal-title" className="text-xl font-bold text-gray-900">
                        {backupCareer.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Alternative career path with {formatOpenings(backupCareer.openings)} openings
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedBackupCareer(null)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Close modal"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Key Skills */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {backupCareer.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-600 mb-1">Avg Salary</p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatSalary(backupCareer.avgSalary * 10000)} / yr
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-600 mb-1">Openings</p>
                      <p className="text-lg font-bold text-primary-600">
                        {formatOpenings(backupCareer.openings)}
                      </p>
                    </div>
                  </div>

                  {/* Job Examples */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Example Openings</h4>
                    <div className="space-y-2">
                      {['Senior ' + backupCareer.title, 'Lead ' + backupCareer.title].map((title, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{title}</p>
                            <p className="text-xs text-gray-600 mt-1">Remote • Full-time</p>
                          </div>
                          <button
                            onClick={() => handleApplyBackupCareer(backupCareer.id)}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                            aria-label={`Apply for ${title}`}
                          >
                            Apply
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        showSuccess('Path Added', `${backupCareer.title} added to your career paths`);
                        setSelectedBackupCareer(null);
                      }}
                      className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      aria-label={`Add ${backupCareer.title} to career paths`}
                    >
                      Add to Paths
                    </button>
                    <button
                      onClick={() => setSelectedBackupCareer(null)}
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

export default FailurePathwayForecasting;

