import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useSkillDNA } from '../hooks/useSkillDNA';
import SkillDetailModal from '../components/SkillDetailModal';

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number; // 0-100 (renamed from level)
  exp: number; // years of experience
  related: string[];
  pinned?: boolean;
}

interface SkillDetail extends Skill {
  description?: string;
  suggestedActivities?: string[];
  careerMatches?: string[];
}

interface RadialCoords {
  [skillId: string]: {
    angle: number;
    radius: number;
    x?: number;
    y?: number;
  };
}

interface MatrixData {
  [skillId: string]: {
    categoryIndex: number;
    categoryCount: number;
    proficiency: number;
    level: string;
  };
}

type ViewType = 'radial' | 'matrix';

const SkillDNAMapping: React.FC = () => {
  const [viewType, setViewType] = useState<ViewType>('radial');
  const [timeline, setTimeline] = useState<number>(0); // 0-24 months
  const [pinnedSkills, setPinnedSkills] = useState<string[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<SkillDetail | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [pathwayTimeline, setPathwayTimeline] = useState<any[]>([]);
  const [topOpportunity, setTopOpportunity] = useState<string>('Frontend Engineer');
  const [gapRadar, setGapRadar] = useState<any[]>([]);
  
  const drawerRef = useRef<HTMLDivElement>(null);
  const { showSuccess, showInfo, showError, showWarning } = useToast();
  const { loading, profile, error, fetchProfile, simulate } = useSkillDNA();

  // Load pinned skills from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nexora_skill_pins');
      if (saved) {
        const parsed = JSON.parse(saved);
        setPinnedSkills(Array.isArray(parsed) ? parsed : []);
      }
    } catch (e) {
      console.error('Failed to load pinned skills:', e);
    }
  }, []);

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile().catch((err) => {
      showWarning('Offline Mode', 'Showing cached data. API unavailable.');
      console.error('Failed to fetch profile:', err);
    });
  }, []);

  // Update skills and data when profile changes
  const skills = useMemo(() => {
    if (profile?.skills) {
      return profile.skills.map(skill => ({
        ...skill,
        level: skill.proficiency || skill.level || 0, // Support both names
        pinned: pinnedSkills.includes(skill.id),
      }));
    }
    // Fallback demo data
    return [
      { id: 'js', name: 'JavaScript', category: 'Core', proficiency: 75, level: 75, exp: 2.5, related: ['React', 'Node.js'] },
      { id: 'react', name: 'React', category: 'Framework', proficiency: 70, level: 70, exp: 2, related: ['JavaScript', 'TypeScript'] },
      { id: 'sql', name: 'SQL', category: 'Database', proficiency: 45, level: 45, exp: 1, related: ['Database'] },
      { id: 'ml', name: 'Machine Learning', category: 'Advanced', proficiency: 30, level: 30, exp: 0.5, related: ['Python', 'Data'] },
      { id: 'cloud', name: 'Cloud (AWS)', category: 'Platform', proficiency: 50, level: 50, exp: 1.5, related: ['DevOps'] },
      { id: 'communication', name: 'Communication', category: 'Communication', proficiency: 65, level: 65, exp: 3, related: [] },
      { id: 'data-structures', name: 'Data Structures', category: 'Foundational', proficiency: 58, level: 58, exp: 1, related: ['Algorithms'] },
    ];
  }, [profile, pinnedSkills]);

  // Update snapshot data
  useEffect(() => {
    if (profile?.snapshot) {
      setTopOpportunity(profile.snapshot.topOpportunity || 'Frontend Engineer');
      setGapRadar(profile.snapshot.gapRadar || []);
    }
    if (profile?.pathwayTimeline) {
      setPathwayTimeline(profile.pathwayTimeline);
    }
  }, [profile]);

  // Calculate projected levels based on timeline and pathway
  const getProjectedLevel = (skill: Skill): number => {
    if (pathwayTimeline.length > 0) {
      // Use pathway timeline data if available
      const timelineEntry = pathwayTimeline.find(entry => 
        entry.month <= timeline && entry.skills?.some((s: any) => s.id === skill.id)
      );
      if (timelineEntry) {
        const skillEntry = timelineEntry.skills.find((s: any) => s.id === skill.id);
        if (skillEntry) {
          return skillEntry.proficiency;
        }
      }
    }
    // Fallback: simple projection
    const growth = (timeline / 24) * 10; // Max 10% growth over 24 months
    return Math.min(100, (skill.proficiency || skill.level || 0) + growth);
  };

  // Get skill level category
  const getLevelCategory = (level: number): 'beginner' | 'intermediate' | 'expert' => {
    if (level < 40) return 'beginner';
    if (level < 70) return 'intermediate';
    return 'expert';
  };

  // Get gap skills (lowest 3) - use gapRadar from API if available
  const gapSkills = useMemo(() => {
    if (gapRadar.length > 0) {
      return gapRadar.map(gap => {
        const skill = skills.find(s => s.name === gap.name);
        return skill || { id: gap.name.toLowerCase(), name: gap.name, proficiency: gap.currentProficiency || 0, level: gap.currentProficiency || 0, category: '', exp: 0, related: [] };
      });
    }
    return [...skills]
      .sort((a, b) => (a.proficiency || a.level || 0) - (b.proficiency || b.level || 0))
      .slice(0, 3);
  }, [gapRadar, skills]);

  // Handle skill click
  const handleSkillClick = useCallback((skill: Skill) => {
    // Use skill data from profile or create detail
    const skillDetail: SkillDetail = {
      ...skill,
      proficiency: skill.proficiency || skill.level || 0,
      description: `${skill.name} is a ${skill.category.toLowerCase()} skill with ${skill.proficiency || skill.level || 0}% proficiency.`,
      suggestedActivities: [
        `Complete ${skill.name} fundamentals tutorial`,
        `Build a project using ${skill.name}`,
        `Join ${skill.name} community and practice`,
      ],
      careerMatches: [topOpportunity, 'Full Stack Developer', 'Software Engineer'],
    };
    setSelectedSkill(skillDetail);
    setIsDrawerOpen(true);
  }, [topOpportunity]);

  // Handle pin/unpin
  const handlePinSkill = useCallback((skillId: string) => {
    setPinnedSkills(prev => {
      let updated;
      if (prev.includes(skillId)) {
        showInfo('Skill Unpinned', 'Skill removed from pinned list');
        updated = prev.filter(id => id !== skillId);
      } else {
        showSuccess('Skill Pinned', 'Skill added to pinned list');
        updated = [...prev, skillId];
      }
      // Save to localStorage
      try {
        localStorage.setItem('nexora_skill_pins', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save pinned skills:', e);
      }
      return updated;
    });
  }, [showSuccess, showInfo]);

  // Handle MicroLearn
  const handleMicroLearn = useCallback(async (skillId: string) => {
    try {
      showInfo('Applying MicroLearn', 'Updating skill proficiency...');
      await simulate('microlearn', { skillId });
      showSuccess('MicroLearn Applied', '+2% added to skill proficiency');
      // Profile will auto-refresh after simulate
    } catch (err: any) {
      showError('MicroLearn Failed', err.message || 'Failed to apply micro-learn');
    }
  }, [simulate, showSuccess, showInfo, showError]);

  // Close drawer on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isDrawerOpen]);

  // Handle drawer backdrop click
  const handleDrawerBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDrawerOpen(false);
    }
  };

  // Calculate radial positions for skills - use API coords if available
  const getRadialPosition = (skill: Skill, index: number, total: number) => {
    // Use API-provided radial coords if available
    if (profile?.radialCoords && profile.radialCoords[skill.id]) {
      const coords = profile.radialCoords[skill.id];
      const radius = 120 + coords.radius * 80; // Scale normalized radius
      const x = Math.cos(coords.angle) * radius;
      const y = Math.sin(coords.angle) * radius;
      return { x, y, angle: coords.angle };
    }
    // Fallback to calculated position
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const radius = 120 + (getProjectedLevel(skill) / 100) * 80;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y, angle };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Skill DNA Mapping</h1>
        <p className="text-gray-600">
          Interactive radial map + Skill Matrix wheel — visualize your skill clusters and proficiency tiers.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Controls */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Controls</h2>
            
            {/* Simulation Timeline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Simulation timeline
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="24"
                  value={timeline}
                  onChange={(e) => setTimeline(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  aria-label="Simulation timeline slider"
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Now</span>
                  <span>{timeline} months →</span>
                </div>
              </div>
            </div>

            {/* Pinned Skills */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Pinned Skills</h3>
              <p className="text-xs text-gray-600 mb-3">Pin important skills to monitor progress.</p>
              <div className="space-y-2">
                {pinnedSkills.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No pinned skills yet</p>
                ) : (
                  pinnedSkills.map(skillId => {
                    const skill = skills.find(s => s.id === skillId);
                    return skill ? (
                      <div
                        key={skillId}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                      >
                        <span className="text-sm text-gray-900">{skill.name}</span>
                        <button
                          onClick={() => handlePinSkill(skillId)}
                          className="text-primary-600 hover:text-primary-700 text-xs"
                          aria-label={`Unpin ${skill.name}`}
                        >
                          ×
                        </button>
                      </div>
                    ) : null;
                  })
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={async () => {
                    try {
                      showInfo('Applying MicroLearn', 'Updating all skills...');
                      await simulate('microlearn', {});
                      showSuccess('MicroLearn Applied', '+2% added to all skills');
                    } catch (err: any) {
                      showError('MicroLearn Failed', err.message || 'Failed to apply micro-learn');
                    }
                  }}
                  disabled={loading}
                  className="w-full bg-success-500 text-white px-4 py-2 rounded-lg hover:bg-success-600 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-success-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Apply Micro Learn"
                >
                  {loading ? 'Processing...' : 'Micro Learn: +2'}
                </button>
                <button
                  onClick={async () => {
                    try {
                      showInfo('Generating Pathway', 'Creating personalized learning pathway...');
                      const result = await simulate('generatePathway', { months: timeline || 24 });
                      if (result.timeline) {
                        setPathwayTimeline(result.timeline);
                      }
                      showSuccess('Pathway Generated', 'Personalized learning pathway created');
                    } catch (err: any) {
                      showError('Pathway Generation Failed', err.message || 'Failed to generate pathway');
                    }
                  }}
                  disabled={loading}
                  className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Generate Pathway"
                >
                  {loading ? 'Generating...' : 'Generate Pathway'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column - Visualization */}
        <div className="col-span-12 lg:col-span-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Your Skill DNA</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewType('radial')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    viewType === 'radial'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  aria-label="Switch to Radial Map view"
                  aria-pressed={viewType === 'radial'}
                >
                  Radial Map
                </button>
                <button
                  onClick={() => setViewType('matrix')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    viewType === 'matrix'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  aria-label="Switch to Skill Matrix view"
                  aria-pressed={viewType === 'matrix'}
                >
                  Skill Matrix
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">Interactive — click a skill to inspect</p>

            {/* Radial Map Visualization */}
            {viewType === 'radial' && (
              <div className="relative w-full" style={{ height: '500px' }}>
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 400 400"
                  className="mx-auto"
                  aria-label="Radial Map visualization"
                >
                  {/* Category sectors */}
                  {['Core', 'Platform', 'Database', 'Foundational', 'Advanced', 'Framework', 'Communication'].map(
                    (category, idx, arr) => {
                      const angle = (idx / arr.length) * 2 * Math.PI;
                      const angle2 = ((idx + 1) / arr.length) * 2 * Math.PI;
                      return (
                        <g key={category}>
                          <path
                            d={`M 200 200 L ${200 + Math.cos(angle - Math.PI / 2) * 200} ${200 + Math.sin(angle - Math.PI / 2) * 200} A 200 200 0 0 1 ${200 + Math.cos(angle2 - Math.PI / 2) * 200} ${200 + Math.sin(angle2 - Math.PI / 2) * 200} Z`}
                            fill="rgba(59, 130, 246, 0.05)"
                            stroke="rgba(59, 130, 246, 0.1)"
                          />
                          <text
                            x={200 + Math.cos((angle + angle2) / 2 - Math.PI / 2) * 180}
                            y={200 + Math.sin((angle + angle2) / 2 - Math.PI / 2) * 180}
                            textAnchor="middle"
                            className="text-xs fill-gray-600"
                            fontSize="12"
                          >
                            {category}
                          </text>
                        </g>
                      );
                    }
                  )}

                  {/* Center "You" */}
                  <circle cx="200" cy="200" r="30" fill="#2563eb" />
                  <text x="200" y="205" textAnchor="middle" className="text-white" fontSize="12" fontWeight="bold">
                    You
                  </text>

                  {/* Skill nodes */}
                  {skills.map((skill, idx) => {
                    const { x, y } = getRadialPosition(skill, idx, skills.length);
                    const projectedLevel = getProjectedLevel(skill);
                    const levelBarWidth = (projectedLevel / 100) * 40;

                    return (
                      <g
                        key={skill.id}
                        className="cursor-pointer hover:opacity-80 transition-opacity focus:outline-none"
                        onClick={() => handleSkillClick(skill)}
                        onKeyDown={(e: React.KeyboardEvent) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSkillClick(skill);
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={`${skill.name} - ${projectedLevel}% proficiency`}
                      >
                        {/* Connecting line */}
                        <line
                          x1="200"
                          y1="200"
                          x2={200 + x}
                          y2={200 + y}
                          stroke="rgba(59, 130, 246, 0.3)"
                          strokeWidth="1"
                        />
                        {/* Skill node */}
                        <circle
                          cx={200 + x}
                          cy={200 + y}
                          r="20"
                          fill="#2563eb"
                          stroke="white"
                          strokeWidth="2"
                        />
                        <text
                          x={200 + x}
                          y={200 + y + 35}
                          textAnchor="middle"
                          className="text-xs fill-gray-700"
                          fontSize="10"
                        >
                          {skill.name}
                        </text>
                        {/* Level bar */}
                        <rect
                          x={200 + x - 20}
                          y={200 + y + 25}
                          width={levelBarWidth}
                          height="3"
                          fill="#22c55e"
                          rx="1"
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}

            {/* Skill Matrix Visualization */}
            {viewType === 'matrix' && (
              <div className="space-y-4">
                <div className="relative w-full" style={{ height: '500px' }}>
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 400 400"
                    className="mx-auto"
                    aria-label="Skill Matrix visualization"
                  >
                    {/* Concentric rings */}
                    <circle cx="200" cy="200" r="60" fill="#fbbf24" opacity="0.3" />
                    <circle cx="200" cy="200" r="120" fill="#60a5fa" opacity="0.3" />
                    <circle cx="200" cy="200" r="180" fill="#22c55e" opacity="0.3" />

                    {/* Center label */}
                    <circle cx="200" cy="200" r="50" fill="#1e3a8a" />
                    <text x="200" y="195" textAnchor="middle" className="text-white" fontSize="10" fontWeight="bold">
                      SKILL
                    </text>
                    <text x="200" y="207" textAnchor="middle" className="text-white" fontSize="10" fontWeight="bold">
                      MATRIX
                    </text>

                    {/* Category sectors */}
                    {skills.reduce((acc, skill) => {
                      if (!acc.includes(skill.category)) acc.push(skill.category);
                      return acc;
                    }, [] as string[]).map((category, idx, arr) => {
                      const angle = (idx / arr.length) * 2 * Math.PI - Math.PI / 2;
                      const angle2 = ((idx + 1) / arr.length) * 2 * Math.PI - Math.PI / 2;
                      return (
                        <g key={category}>
                          <line
                            x1="200"
                            y1="200"
                            x2={200 + Math.cos(angle) * 180}
                            y2={200 + Math.sin(angle) * 180}
                            stroke="rgba(59, 130, 246, 0.2)"
                            strokeWidth="1"
                          />
                          <text
                            x={200 + Math.cos(angle) * 190}
                            y={200 + Math.sin(angle) * 190}
                            textAnchor="middle"
                            className="text-xs fill-gray-600"
                            fontSize="11"
                            transform={`rotate(${(angle * 180) / Math.PI + 90} ${200 + Math.cos(angle) * 190} ${200 + Math.sin(angle) * 190})`}
                          >
                            {category}
                          </text>
                        </g>
                      );
                    })}

                    {/* Skill nodes placed by level */}
                    {skills.map((skill, idx) => {
                      const categoryIndex = skills
                        .reduce((acc, s) => {
                          if (!acc.includes(s.category)) acc.push(s.category);
                          return acc;
                        }, [] as string[])
                        .indexOf(skill.category);
                      const categoryCount = skills.filter(s => s.category === skill.category).length;
                      const skillIndexInCategory = skills.filter(s => s.category === skill.category).indexOf(skill);
                      const angle = ((categoryIndex + skillIndexInCategory / categoryCount) / 
                        skills.reduce((acc, s) => {
                          if (!acc.includes(s.category)) acc.push(s.category);
                          return acc;
                        }, [] as string[]).length) * 2 * Math.PI - Math.PI / 2;
                      
                      const projectedLevel = getProjectedLevel(skill);
                      let radius = 90;
                      if (projectedLevel >= 70) radius = 150;
                      else if (projectedLevel >= 40) radius = 90;

                      const x = Math.cos(angle) * radius;
                      const y = Math.sin(angle) * radius;

                      return (
                        <g
                          key={skill.id}
                          className="cursor-pointer hover:opacity-80 transition-opacity focus:outline-none"
                          onClick={() => handleSkillClick(skill)}
                          onKeyDown={(e: React.KeyboardEvent) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleSkillClick(skill);
                            }
                          }}
                          tabIndex={0}
                          role="button"
                          aria-label={`${skill.name} - ${projectedLevel}% proficiency`}
                        >
                          <circle
                            cx={200 + x}
                            cy={200 + y}
                            r="12"
                            fill={projectedLevel >= 70 ? '#22c55e' : projectedLevel >= 40 ? '#60a5fa' : '#fbbf24'}
                            stroke="white"
                            strokeWidth="2"
                          />
                          <text
                            x={200 + x}
                            y={200 + y + 25}
                            textAnchor="middle"
                            className="text-xs fill-gray-700"
                            fontSize="9"
                          >
                            {skill.name}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-6 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span className="text-xs text-gray-600">Beginner</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-400" />
                    <span className="text-xs text-gray-600">Intermediate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="text-xs text-gray-600">Expert</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Snapshot */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Snapshot</h2>

            {/* Timeline */}
            <div>
              <p className="text-sm text-gray-600 mb-1">Timeline</p>
              <p className="text-lg font-semibold text-gray-900">{timeline} months</p>
            </div>

            {/* Top Opportunity */}
            <div>
              <p className="text-sm text-gray-600 mb-1">Top opportunity</p>
              <p className="text-lg font-semibold text-primary-600 mb-1">{topOpportunity}</p>
              <p className="text-xs text-gray-600">
                Recommended by predictive model based on your strengths.
              </p>
            </div>

            {/* Gap Radar */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-3">Gap Radar</p>
              <div className="space-y-2">
                {gapSkills.map(skill => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{skill.name}</p>
                      <p className="text-xs text-gray-600">
                        {gapRadar.find(g => g.name === skill.name) 
                          ? `Gap: ${gapRadar.find(g => g.name === skill.name).gap}% (${getProjectedLevel(skill).toFixed(0)}%)`
                          : `Projected ${getProjectedLevel(skill).toFixed(0)}%`}
                      </p>
                    </div>
                    <button
                      onClick={() => handleMicroLearn(skill.id)}
                      className="text-primary-600 hover:text-primary-700 text-xs font-medium"
                      aria-label={`Micro Learn for ${skill.name}`}
                    >
                      MicroLearn →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Twin */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">Career Twin</p>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-2">Skill Level</p>
                <div className="h-16 flex items-end gap-1">
                  {(pathwayTimeline.length > 0 
                    ? pathwayTimeline.filter((entry: any) => entry.month % 4 === 0 || entry.month === 0).slice(0, 6)
                    : [0, 4, 8, 12, 16, 20]
                  ).map((entry: any, idx: number) => {
                    const month = typeof entry === 'number' ? entry : entry.month;
                    const avgProficiency = typeof entry === 'number' ? 20 + (idx * 8) : entry.avgProficiency;
                    const height = Math.max(20, Math.min(60, (avgProficiency / 100) * 60));
                    return (
                      <div
                        key={month}
                        className="flex-1 bg-primary-500 rounded-t"
                        style={{ height: `${height}px` }}
                        aria-label={`Month ${month}`}
                        title={`Month ${month}: ${avgProficiency}%`}
                      />
                    );
                  })}
                </div>
                <p className="text-xs text-gray-600 mt-2">Months</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</p>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    showInfo('Extract Skills', 'Extracting skills from your profile...');
                    console.log('Extract Skills');
                  }}
                  className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  aria-label="Extract Skills"
                >
                  Extract Skills →
                </button>
                <button
                  onClick={() => {
                    showInfo('Skill Passport', 'Opening skill passport...');
                    console.log('Skill Passport');
                  }}
                  className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  aria-label="Skill Passport"
                >
                  Skill Passport →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          Loading Skill DNA...
        </div>
      )}

      {/* Skill Detail Modal */}
      <SkillDetailModal
        skill={selectedSkill ? {
          ...selectedSkill,
          proficiency: selectedSkill.proficiency || selectedSkill.level || 0,
        } : null}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedSkill(null);
        }}
        onPin={handlePinSkill}
        onMicroLearn={handleMicroLearn}
        isPinned={selectedSkill ? pinnedSkills.includes(selectedSkill.id) : false}
      />
    </div>
  );
};

export default SkillDNAMapping;

