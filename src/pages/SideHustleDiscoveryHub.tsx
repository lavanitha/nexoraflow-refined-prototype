import React, { useState, useMemo, useEffect, useRef } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import IdeaModal from '../components/IdeaModal';
import { useSideHustle } from '../hooks/useSideHustle';
import { useToast } from '../contexts/ToastContext';
import type { SideHustleOpportunity, SideHustleFilters, SuccessStory } from '../types';

// Mock data for opportunities
const mockOpportunities: SideHustleOpportunity[] = [
  {
    id: '1',
    title: 'Freelance Web Development',
    description: 'Use your coding skills to build websites for small businesses and entrepreneurs.',
    category: 'Freelancing',
    skillLevel: 'Intermediate',
    timeCommitment: '10-15 hours/week',
    earningPotential: { min: 500, max: 2000, period: 'month' },
    startupCost: { amount: '$0-100', level: 'Low' },
    requiredSkills: ['HTML/CSS', 'JavaScript', 'React', 'Node.js'],
    matchScore: 95,
    icon: 'code'
  },
  {
    id: '2',
    title: 'Online Course Creation',
    description: 'Share your expertise by creating and selling online courses on platforms like Udemy.',
    category: 'Content Creation',
    skillLevel: 'Beginner',
    timeCommitment: '5-10 hours/week',
    earningPotential: { min: 200, max: 1500, period: 'month' },
    startupCost: { amount: '$50-200', level: 'Low' },
    requiredSkills: ['Subject Expertise', 'Video Editing', 'Communication'],
    matchScore: 88,
    icon: 'academic-cap'
  },
  {
    id: '3',
    title: 'E-commerce Store',
    description: 'Start your own online store selling products through dropshipping or your own inventory.',
    category: 'E-commerce',
    skillLevel: 'Intermediate',
    timeCommitment: '15-20 hours/week',
    earningPotential: { min: 300, max: 5000, period: 'month' },
    startupCost: { amount: '$200-1000', level: 'Medium' },
    requiredSkills: ['Marketing', 'Customer Service', 'Product Research'],
    matchScore: 82,
    icon: 'shopping-cart'
  },
  {
    id: '4',
    title: 'Digital Marketing Consulting',
    description: 'Help businesses grow their online presence through strategic digital marketing.',
    category: 'Consulting',
    skillLevel: 'Advanced',
    timeCommitment: '8-12 hours/week',
    earningPotential: { min: 800, max: 3000, period: 'month' },
    startupCost: { amount: '$100-300', level: 'Low' },
    requiredSkills: ['SEO', 'Social Media', 'Analytics', 'Strategy'],
    matchScore: 90,
    icon: 'chart-bar'
  },
  {
    id: '5',
    title: 'Virtual Assistant Services',
    description: 'Provide administrative support to busy entrepreneurs and small business owners.',
    category: 'Freelancing',
    skillLevel: 'Beginner',
    timeCommitment: '10-20 hours/week',
    earningPotential: { min: 400, max: 1200, period: 'month' },
    startupCost: { amount: '$0-50', level: 'Low' },
    requiredSkills: ['Organization', 'Communication', 'Basic Tech Skills'],
    matchScore: 75,
    icon: 'user-group'
  },
  {
    id: '6',
    title: 'Content Writing & Copywriting',
    description: 'Write compelling content for websites, blogs, and marketing materials.',
    category: 'Content Creation',
    skillLevel: 'Intermediate',
    timeCommitment: '8-15 hours/week',
    earningPotential: { min: 300, max: 1800, period: 'month' },
    startupCost: { amount: '$0-100', level: 'Low' },
    requiredSkills: ['Writing', 'Research', 'SEO', 'Marketing'],
    matchScore: 85,
    icon: 'pencil-alt'
  }
];

// Mock data for success stories
const mockSuccessStories: SuccessStory[] = [
  {
    id: '1',
    name: 'Sarah M.',
    role: 'Freelance Designer',
    story: 'Started with small logo designs and now earning $3000/month working with established brands. The key was building a strong portfolio and networking consistently.',
    earnings: '$3,000/month',
    timeframe: '18 months',
    category: 'Freelancing'
  },
  {
    id: '2',
    name: 'Mike R.',
    role: 'Online Tutor',
    story: 'Teaching math online in my spare time has helped me pay off student loans faster than expected. Started with just 2 hours/week and now teach 15 hours.',
    earnings: '$1,800/month',
    timeframe: '12 months',
    category: 'Content Creation'
  },
  {
    id: '3',
    name: 'Jessica L.',
    role: 'E-commerce Entrepreneur',
    story: 'Launched a dropshipping store for eco-friendly products. After initial struggles, found my niche and now have a sustainable business.',
    earnings: '$4,500/month',
    timeframe: '24 months',
    category: 'E-commerce'
  },
  {
    id: '4',
    name: 'David K.',
    role: 'Digital Marketing Consultant',
    story: 'Leveraged my corporate marketing experience to help small businesses. Now working with 8 regular clients and loving the flexibility.',
    earnings: '$5,200/month',
    timeframe: '15 months',
    category: 'Consulting'
  }
];

const SideHustleDiscoveryHub: React.FC = () => {
  const [filters, setFilters] = useState<SideHustleFilters>({
    category: 'All Categories',
    timeCommitment: 'All Time Commitments',
    earningPotential: 'All Earning Levels',
    skillLevel: 'All Skill Levels'
  });

  const [searchInput, setSearchInput] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSkillLevels, setSelectedSkillLevels] = useState<string[]>([]);
  const [selectedTimeCommitments, setSelectedTimeCommitments] = useState<string[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [savedIdeas, setSavedIdeas] = useState<any[]>([]);
  const [useGeneratedIdeas, setUseGeneratedIdeas] = useState(false);

  const { loading, ideas, error, rawResponse, generateIdeas, retry } = useSideHustle();
  const { showSuccess, showError, showInfo } = useToast();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load saved ideas from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nexora_sidehustle_favs');
      if (saved) {
        setSavedIdeas(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load saved ideas:', e);
    }
  }, []);

  // Convert generated ideas to display format
  const displayOpportunities = useMemo(() => {
    if (useGeneratedIdeas && ideas.length > 0) {
      return ideas.map((idea, idx) => ({
        id: `generated-${idx}`,
        title: idea.title,
        description: idea.description,
        category: 'Generated',
        skillLevel: idea.confidence >= 4 ? 'Advanced' : idea.confidence >= 3 ? 'Intermediate' : 'Beginner',
        timeCommitment: idea.time_commitment,
        earningPotential: {
          min: parseInt(idea.earning_potential.match(/\$(\d+)/)?.[1] || '0'),
          max: parseInt(idea.earning_potential.match(/\$(\d+).*\$(\d+)/)?.[2] || idea.earning_potential.match(/\$(\d+)/)?.[1] || '0'),
          period: 'month' as const,
        },
        startupCost: { amount: 'TBD', level: 'Low' as const },
        requiredSkills: idea.skills,
        matchScore: idea.confidence * 20, // Convert 1-5 to 0-100
        icon: 'chart-bar',
        _rawIdea: idea, // Store raw idea for modal
      }));
    }
    // Fallback to mock data
    return mockOpportunities.filter(opportunity => {
      if (filters.category !== 'All Categories' && opportunity.category !== filters.category) {
        return false;
      }
      if (filters.skillLevel !== 'All Skill Levels' && opportunity.skillLevel !== filters.skillLevel) {
        return false;
      }
      return true;
    });
  }, [useGeneratedIdeas, ideas, filters]);

  // Filter opportunities based on selected filters
  const filteredOpportunities = displayOpportunities;

  const handleFilterChange = (filterType: keyof SideHustleFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Parse hours from time commitment string
  const parseHoursFromTimeCommitment = (timeStr: string): number => {
    const match = timeStr.match(/(\d+)-(\d+)/);
    if (match) {
      return Math.round((parseInt(match[1]) + parseInt(match[2])) / 2);
    }
    return 10; // Default
  };

  // Handle generate button
  const handleGenerate = async () => {
    try {
      // Gather inputs
      const skills = searchInput.trim() ? searchInput.split(',').map(s => s.trim()).filter(Boolean) : [];
      const interests = searchInput.trim() || undefined;
      const hoursPerWeek = selectedTimeCommitments.length > 0
        ? parseHoursFromTimeCommitment(selectedTimeCommitments[0])
        : 10;
      
      const filtersPayload: any = {};
      if (selectedCategories.length > 0) {
        filtersPayload.category = selectedCategories;
      }
      if (selectedSkillLevels.length > 0) {
        filtersPayload.skillLevel = selectedSkillLevels[0]; // Use first selected
      }

      const payload: any = {
        hoursPerWeek,
        tone: 'professional',
      };

      if (skills.length > 0) {
        payload.skills = skills;
      }
      if (interests && !skills.length) {
        payload.interests = interests;
      }
      if (Object.keys(filtersPayload).length > 0) {
        payload.filters = filtersPayload;
      }

      const generatedIdeas = await generateIdeas(payload);
      setUseGeneratedIdeas(true);
      showSuccess('Ideas Generated', `Generated ${generatedIdeas.length} personalized side-hustle ideas!`);
    } catch (err: any) {
      showError('Generation Failed', err.message || 'Failed to generate ideas');
    }
  };

  // Handle regenerate
  const handleRegenerate = () => {
    handleGenerate();
  };

  // Handle Get Started button
  const handleGetStarted = (opportunity: any) => {
    if (opportunity._rawIdea) {
      setSelectedIdea(opportunity._rawIdea);
      setModalOpen(true);
    } else {
      showInfo('Details', 'Full details coming soon for this opportunity');
    }
  };

  // Handle Save idea
  const handleSaveIdea = (idea: any) => {
    try {
      const updated = [...savedIdeas, { ...idea, savedAt: new Date().toISOString() }];
      localStorage.setItem('nexora_sidehustle_favs', JSON.stringify(updated));
      setSavedIdeas(updated);
      showSuccess('Idea Saved', 'Idea saved to favorites');
    } catch (e) {
      showError('Save Failed', 'Failed to save idea');
    }
  };

  // Check if idea is saved
  const isIdeaSaved = (idea: any) => {
    return savedIdeas.some(saved => saved.title === idea.title);
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-blue-100 text-blue-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getMatchScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 80) return 'Good Match';
    if (score >= 70) return 'Fair Match';
    return 'Low Match';
  };

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ReactElement } = {
      code: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      'academic-cap': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      ),
      'shopping-cart': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
        </svg>
      ),
      'chart-bar': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      'user-group': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      'pencil-alt': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    };
    return icons[iconName] || icons.code;
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="text-center py-12 bg-white">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900">Discover Your Perfect <span className="text-primary-600">Side Hustle</span></h1>
        <p className="mt-4 text-gray-600 max-w-3xl mx-auto">Transform your skills into income with AI-powered opportunity matching. Get personalized recommendations based on your expertise, interests, and goals.</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button variant="primary" size="lg" leftIcon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14"/></svg>}>
            Take Skills Assessment
          </Button>
          <Button variant="outline" size="lg">Watch Demo</Button>
        </div>

        {/* Stats row */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-extrabold text-green-500">2,847</div>
            <div className="text-sm text-gray-500">Success Stories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-extrabold text-green-600">$2.1K</div>
            <div className="text-sm text-gray-500">Avg Monthly Earnings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-extrabold text-orange-400">156</div>
            <div className="text-sm text-gray-500">Opportunity Types</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-extrabold text-indigo-600">94%</div>
            <div className="text-sm text-gray-500">Success Rate</div>
          </div>
        </div>

        {/* Search + Generate */}
        <div className="mt-8 max-w-5xl mx-auto flex items-center gap-4 px-4">
          <input
            ref={searchInputRef}
            placeholder="Enter skills or interests (e.g., JavaScript, React, web development)"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500"
          />
          {!useGeneratedIdeas && (
            <Button
              variant="primary"
              onClick={handleGenerate}
              loading={loading}
              leftIcon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>}
            >
              Generate Ideas
            </Button>
          )}
          {useGeneratedIdeas && (
            <Button
              variant="outline"
              onClick={handleRegenerate}
              loading={loading}
            >
              Regenerate
            </Button>
          )}
          <div className="text-sm text-gray-500">{filteredOpportunities.length} {useGeneratedIdeas ? 'generated' : ''} opportunities found</div>
        </div>
        {error && (
          <div className="mt-4 max-w-5xl mx-auto px-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">Error: {error}</p>
              {rawResponse && (
                <details className="mt-2">
                  <summary className="text-sm text-red-600 cursor-pointer">Show raw response</summary>
                  <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto max-h-40">{rawResponse}</pre>
                </details>
              )}
              <Button variant="outline" size="sm" onClick={handleRegenerate} className="mt-2">
                Retry
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Main content: filters + listings */}
      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-12 lg:col-span-3">
          <Card title="Filters" className="sticky top-24">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Categories</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  {['Content Creation', 'E-commerce', 'Freelancing', 'Consulting', 'Online Services'].map((cat) => (
                    <label key={cat} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([...selectedCategories, cat]);
                          } else {
                            setSelectedCategories(selectedCategories.filter(c => c !== cat));
                          }
                        }}
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Difficulty Level</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                    <label key={level} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedSkillLevels.includes(level)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSkillLevels([...selectedSkillLevels, level]);
                          } else {
                            setSelectedSkillLevels(selectedSkillLevels.filter(l => l !== level));
                          }
                        }}
                      />
                      {level}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Time Commitment</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  {['5-10 hours/week', '10-20 hours/week', '20-30 hours/week', '30+ hours/week'].map((time) => (
                    <label key={time} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedTimeCommitments.includes(time)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTimeCommitments([time]); // Only one selection for hours
                          } else {
                            setSelectedTimeCommitments([]);
                          }
                        }}
                      />
                      {time}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </aside>

        <main className="col-span-12 lg:col-span-9">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOpportunities.map((opportunity) => (
              <Card key={opportunity.id} hover clickable className="h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-primary-50 rounded-lg text-primary-600">
                    {getIcon(opportunity.icon)}
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getMatchScoreColor(opportunity.matchScore)}`}>
                    {opportunity._rawIdea 
                      ? (opportunity._rawIdea.confidence >= 4 ? 'Excellent Match' : opportunity._rawIdea.confidence >= 3 ? 'Good Match' : 'Fair Match')
                      : getMatchScoreLabel(opportunity.matchScore)}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{opportunity.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{opportunity.description}</p>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Earning Potential:</span>
                    <span className="font-medium text-green-600">${opportunity.earningPotential.min}-{opportunity.earningPotential.max}/month</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Time Investment:</span>
                    <span className="font-medium text-gray-900">{opportunity.timeCommitment}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-600 mb-2">Required Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.requiredSkills.slice(0,3).map((skill,i)=> (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">{skill}</span>
                    ))}
                    {opportunity.requiredSkills.length>3 && <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">+{opportunity.requiredSkills.length-3} more</span>}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    className="text-sm text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => handleGetStarted(opportunity)}
                  >
                    View Details
                  </button>
                  <Button
                    variant="primary"
                    onClick={() => handleGetStarted(opportunity)}
                  >
                    Get Started
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>

      {/* Idea Modal */}
      <IdeaModal
        idea={selectedIdea}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedIdea(null);
        }}
        onSave={handleSaveIdea}
        isSaved={selectedIdea ? isIdeaSaved(selectedIdea) : false}
      />
    </div>
  );
};

export default SideHustleDiscoveryHub;