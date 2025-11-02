import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../contexts/ToastContext';

// TODO: connect predictive-model API
// TODO: wire export snapshot / csv
// TODO: replace demo data with backend response

interface Skill {
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface CareerPath {
  id: string;
  title: string;
  baseSalary: number;
  projectedSalary: number;
  skillGrowth: number;
  openings: number;
  skillData: number[];
  salaryData: number[];
}

const PredictiveCareerEvolution: React.FC = () => {
  const [selectedCareer, setSelectedCareer] = useState<string>('data-scientist');
  const [experienceLevel, setExperienceLevel] = useState<number>(50);
  const [projectionWindow, setProjectionWindow] = useState<number>(5);
  const [hoverYear, setHoverYear] = useState<number | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState<string | null>(null);
  const chartRef = useRef<SVGSVGElement>(null);
  const { showSuccess, showInfo } = useToast();

  // Demo skills data
  const skills: Skill[] = [
    { name: 'Machine Learning', proficiency: 'Intermediate' },
    { name: 'Python', proficiency: 'Intermediate' },
    { name: 'Data Analysis', proficiency: 'Advanced' },
    { name: 'SQL', proficiency: 'Intermediate' },
  ];

  // Demo career paths
  const careers: CareerPath[] = [
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      baseSalary: 860000,
      projectedSalary: 1320000,
      skillGrowth: 52,
      openings: 12400,
      skillData: [60, 70, 80, 90, 99],
      salaryData: [86, 98, 110, 120, 132],
    },
    {
      id: 'frontend-engineer',
      title: 'Frontend Engineer',
      baseSalary: 870000,
      projectedSalary: 1280000,
      skillGrowth: 48,
      openings: 9800,
      skillData: [65, 75, 85, 92, 98],
      salaryData: [87, 100, 112, 122, 128],
    },
    {
      id: 'devops-engineer',
      title: 'DevOps Engineer',
      baseSalary: 950000,
      projectedSalary: 1400000,
      skillGrowth: 45,
      openings: 11000,
      skillData: [70, 78, 85, 91, 95],
      salaryData: [95, 108, 120, 132, 140],
    },
  ];

  const currentCareer = careers.find(c => c.id === selectedCareer) || careers[0];

  // Calculate projected data based on inputs
  const calculateProjections = () => {
    const years = projectionWindow;
    const skillStart = 60 + (experienceLevel / 100) * 20;
    const skillEnd = Math.min(99, skillStart + (currentCareer.skillGrowth / 100) * (years * 5));
    
    const salaryStart = currentCareer.baseSalary;
    const salaryEnd = currentCareer.projectedSalary;
    
    const skillPoints: number[] = [];
    const salaryPoints: number[] = [];
    
    for (let i = 0; i <= years; i++) {
      const progress = i / years;
      skillPoints.push(Math.round(skillStart + (skillEnd - skillStart) * progress));
      salaryPoints.push(Math.round(salaryStart + (salaryEnd - salaryStart) * progress));
    }
    
    return { skillPoints, salaryPoints, skillStart, skillEnd, salaryEnd };
  };

  const projections = calculateProjections();

  // Format salary (₹13,20,000)
  const formatSalary = (amount: number): string => {
    const lakhs = amount / 100000;
    const parts = lakhs.toFixed(2).split('.');
    return `₹${parts[0]},${parts[1]}L`;
  };

  // Format salary full (₹13,20,000)
  const formatSalaryFull = (amount: number): string => {
    const formatted = amount.toLocaleString('en-IN');
    return `₹${formatted}`;
  };

  // Format openings (12.4k)
  const formatOpenings = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  // Handle export data
  const handleExportData = () => {
    // TODO: implement export
    console.log('Export Data:', {
      career: selectedCareer,
      experienceLevel,
      projectionWindow,
      projections,
    });
    showSuccess('Data Export', 'Export functionality coming soon');
  };

  // Handle metric card click (view details)
  const handleViewDetails = (type: string) => {
    setShowDetailsModal(type);
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

  // Get tooltip data for hover year
  const getTooltipData = (year: number) => {
    const index = year - 1;
    if (index >= 0 && index < projections.skillPoints.length) {
      return {
        year,
        skill: projections.skillPoints[index],
        salary: projections.salaryPoints[index] * 10000, // Convert to full amount
        openings: currentCareer.openings + (year * 500),
      };
    }
    return null;
  };

  const tooltipData = hoverYear ? getTooltipData(hoverYear) : getTooltipData(projectionWindow);

  // Generate SVG path for line chart
  const generatePath = (points: number[], maxValue: number, height: number, isSalary: boolean = false) => {
    const width = 500;
    const xStep = width / (points.length - 1);
    const pointsString = points
      .map((value, index) => {
        const x = index * xStep;
        const y = height - (value / maxValue) * height;
        return `${x},${y}`;
      })
      .join(' ');
    return `M ${pointsString}`;
  };

  const maxSkill = 100;
  const maxSalary = 150;
  const chartHeight = 250;
  const chartWidth = 500;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Predictive Career Evolution Model</h1>
          <p className="text-gray-600 max-w-2xl">
            Forecast your career progress by predicting skill growth, salary, and open opportunities over time.
          </p>
        </div>
        <button
          onClick={handleExportData}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 whitespace-nowrap"
          aria-label="Export data"
        >
          Export Data
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Inputs */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Inputs</h2>

            {/* Career Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Career
              </label>
              <select
                value={selectedCareer}
                onChange={(e) => setSelectedCareer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                aria-label="Select career path"
              >
                {careers.map((career) => (
                  <option key={career.id} value={career.id}>
                    {career.title}
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
                <span>Beginner</span>
                <span>Expert</span>
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

            {/* Your Skills List */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Your Skills</h3>
              <div className="space-y-2">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm text-gray-900">{skill.name}</span>
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                      {skill.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center Column - Predicted Career Trajectory */}
        <div className="col-span-12 lg:col-span-6">
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Predicted Career Trajectory</h2>

            {/* Chart Area */}
            <div className="bg-gray-50 rounded-lg p-4 relative">
              <div className="relative" style={{ height: '350px' }}>
                <svg
                  ref={chartRef}
                  width="100%"
                  height="100%"
                  viewBox="0 0 600 300"
                  preserveAspectRatio="xMidYMid meet"
                  className="overflow-visible"
                >
                  {/* Grid lines */}
                  {[40, 60, 80, 100].map((val) => (
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
                    Skill Level
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

                  {/* Skill line (blue) */}
                  <polyline
                    points={projections.skillPoints
                      .map((value, index) => {
                        const x = 50 + (index / projectionWindow) * 500;
                        const y = 250 - (value / maxSkill) * 200;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {projections.skillPoints.map((value, index) => {
                    const x = 50 + (index / projectionWindow) * 500;
                    const y = 250 - (value / maxSkill) * 200;
                    return (
                      <circle
                        key={`skill-${index}`}
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#3b82f6"
                      />
                    );
                  })}

                  {/* Salary line (teal) */}
                  <polyline
                    points={projections.salaryPoints
                      .map((value, index) => {
                        const x = 50 + (index / projectionWindow) * 500;
                        const y = 250 - ((value / maxSalary) * 200);
                        return `${x},${y}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#14b8a6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {projections.salaryPoints.map((value, index) => {
                    const x = 50 + (index / projectionWindow) * 500;
                    const y = 250 - ((value / maxSalary) * 200);
                    return (
                      <circle
                        key={`salary-${index}`}
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#14b8a6"
                      />
                    );
                  })}

                  {/* Tooltip line (vertical dashed at end point) */}
                  {tooltipData && (
                    <g>
                      <line
                        x1={50 + ((projectionWindow - 1) / projectionWindow) * 500}
                        y1="50"
                        x2={50 + ((projectionWindow - 1) / projectionWindow) * 500}
                        y2="250"
                        stroke="#94a3b8"
                        strokeWidth="1"
                        strokeDasharray="4,4"
                      />
                    </g>
                  )}
                </svg>

                {/* Chart Legend */}
                <div className="absolute top-4 right-4 flex gap-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-blue-500" />
                    <span className="text-xs text-gray-700">Skill</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-teal-500" />
                    <span className="text-xs text-gray-700">Salary</span>
                  </div>
                </div>

                {/* Tooltip at end point */}
                {tooltipData && (
                  <div
                    className="absolute bg-white rounded-lg shadow-lg border border-gray-200 p-3"
                    style={{
                      right: '20px',
                      top: '50px',
                      minWidth: '180px',
                    }}
                  >
                    <div className="text-sm font-semibold text-gray-900 mb-2">
                      {tooltipData.year} {tooltipData.year === 1 ? 'Year' : 'Years'}
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Skill Level:</span>
                        <span className="font-semibold text-gray-900">{tooltipData.skill}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Salary:</span>
                        <span className="font-semibold text-gray-900">
                          {formatSalaryFull(tooltipData.salary)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Openings:</span>
                        <span className="font-semibold text-gray-900">{formatOpenings(tooltipData.openings)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Skill Growth Card */}
              <div
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewDetails('skill-growth')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleViewDetails('skill-growth');
                  }
                }}
                aria-label="View skill growth details"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Skill Growth</h3>
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  Project {currentCareer.skillGrowth}% skill growth to expert level
                </p>
              </div>

              {/* Salary Forecast Card */}
              <div
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewDetails('salary')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleViewDetails('salary');
                  }
                }}
                aria-label="View salary forecast details"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Salary Forecast</h3>
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-900 mb-1">
                  {formatSalary(currentCareer.projectedSalary * 10000)} / yr
                </p>
                <p className="text-xs text-gray-600">
                  Predict salary increase from {formatSalary(currentCareer.baseSalary * 10000)} to {formatSalary(currentCareer.projectedSalary * 10000)}
                </p>
              </div>

              {/* Top Opportunity Card */}
              <div
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewDetails('opportunity')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleViewDetails('opportunity');
                  }
                }}
                aria-label="View top opportunity details"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Top Opportunity</h3>
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-900 mb-1">
                  Senior {currentCareer.title}
                </p>
                <p className="text-xs text-gray-600">
                  Forecast {formatOpenings(currentCareer.openings)} job openings for your skills
                </p>
              </div>
            </div>

            {/* Repeated Metric Blocks (matching screenshot visual density) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Skill Growth</h3>
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  Project {currentCareer.skillGrowth}% skill growth to expert level
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Salary Forecast</h3>
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-900 mb-1">
                  {formatSalary(currentCareer.projectedSalary * 10000)} / yr
                </p>
                <p className="text-xs text-gray-600">
                  Predict salary increase from {formatSalary(currentCareer.baseSalary * 10000)} to {formatSalary(currentCareer.projectedSalary * 10000)}
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Top Opportunity</h3>
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-900 mb-1">
                  Senior {currentCareer.title}
                </p>
                <p className="text-xs text-gray-600">
                  Forecast {formatOpenings(currentCareer.openings)} job openings for your skills
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Insights / Snapshot */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Insights</h2>

            {/* Selected Career Details */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Career</h3>
              <h4 className="font-semibold text-gray-900 mb-3">{currentCareer.title}</h4>

              {/* Skill Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Top Insights */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Top Insights</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Skill growth trajectory shows {currentCareer.skillGrowth}% potential increase over {projectionWindow} years.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Salary projection indicates steady growth from {formatSalary(currentCareer.baseSalary * 10000)} to {formatSalary(currentCareer.projectedSalary * 10000)}.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Market demand shows {formatOpenings(currentCareer.openings)} projected openings, indicating strong career stability.
                  </span>
                </li>
              </ul>
            </div>

            {/* CTA Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  const nextCareer = careers.find(c => c.id !== selectedCareer) || careers[1];
                  setSelectedCareer(nextCareer.id);
                  showInfo('Career Updated', `Switched to ${nextCareer.title}`);
                }}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="Explore next career path"
              >
                Next Path
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
          onClick={() => setShowDetailsModal(null)}
          aria-label="Details modal backdrop"
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-gray-200 pb-4">
                <h3 id="modal-title" className="text-xl font-bold text-gray-900">
                  {showDetailsModal === 'skill-growth' && 'Skill Growth Forecast'}
                  {showDetailsModal === 'salary' && 'Salary Forecast'}
                  {showDetailsModal === 'opportunity' && 'Top Opportunity Analysis'}
                </h3>
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

              {/* Content */}
              {showDetailsModal === 'skill-growth' && (
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Based on your current experience level and projected growth trajectory, your skills in {currentCareer.title} are expected to increase by {currentCareer.skillGrowth}% over the next {projectionWindow} years.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Growth Projection</h4>
                    <div className="h-24 flex items-end gap-1">
                      {projections.skillPoints.map((value, idx) => {
                        const height = (value / 100) * 90;
                        return (
                          <div
                            key={idx}
                            className="flex-1 bg-primary-500 rounded-t"
                            style={{ height: `${height}px` }}
                            title={`Year ${idx + 1}: ${value}%`}
                          />
                        );
                      })}
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-2">
                      <span>Year 1</span>
                      <span>Year {projectionWindow}</span>
                    </div>
                  </div>
                </div>
              )}

              {showDetailsModal === 'salary' && (
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Salary forecast indicates a projected increase from {formatSalary(currentCareer.baseSalary * 10000)} to {formatSalary(currentCareer.projectedSalary * 10000)} over {projectionWindow} years, representing a {((currentCareer.projectedSalary - currentCareer.baseSalary) / currentCareer.baseSalary * 100).toFixed(1)}% growth.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Salary Projection</h4>
                    <div className="h-24 flex items-end gap-1">
                      {projections.salaryPoints.map((value, idx) => {
                        const height = (value / 150) * 90;
                        return (
                          <div
                            key={idx}
                            className="flex-1 bg-teal-500 rounded-t"
                            style={{ height: `${height}px` }}
                            title={`Year ${idx + 1}: ₹${value}L`}
                          />
                        );
                      })}
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-2">
                      <span>Year 1</span>
                      <span>Year {projectionWindow}</span>
                    </div>
                  </div>
                </div>
              )}

              {showDetailsModal === 'opportunity' && (
                <div className="space-y-4">
                  <p className="text-gray-700">
                    The job market for {currentCareer.title} shows strong demand with {formatOpenings(currentCareer.openings)} projected openings. Senior roles are particularly in demand, offering competitive salaries and growth opportunities.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Market Trends</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Current Openings:</span>
                        <span className="font-semibold text-gray-900">{formatOpenings(currentCareer.openings)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Projected Growth:</span>
                        <span className="font-semibold text-gray-900">+15% annually</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Average Salary:</span>
                        <span className="font-semibold text-gray-900">{formatSalary(currentCareer.projectedSalary * 10000)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictiveCareerEvolution;

