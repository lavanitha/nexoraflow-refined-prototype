import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';

interface CoachingSession {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'scheduled';
  type: 'stress' | 'anxiety' | 'confidence' | 'relationships' | 'goals';
}

interface ResilienceMetric {
  name: string;
  score: number;
  maxScore: number;
  color: string;
  trend: 'up' | 'down' | 'stable';
}

interface Goal {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  category: 'wellness' | 'mindfulness' | 'relationships' | 'career';
}

interface AdviceCard {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
}

const AIResilienceCoachCenter: React.FC = () => {
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [sessionInput, setSessionInput] = useState('');
  const [showAssessment, setShowAssessment] = useState(false);
  const [assessmentStep, setAssessmentStep] = useState(0);
  const [newGoal, setNewGoal] = useState('');
  const [showGoalForm, setShowGoalForm] = useState(false);

  // Mock data
  const resilienceMetrics: ResilienceMetric[] = [
    { name: 'Resilience Score', score: 78, maxScore: 100, color: 'bg-primary-600', trend: 'up' },
    { name: 'Emotional Intelligence', score: 85, maxScore: 100, color: 'bg-green-600', trend: 'up' },
    { name: 'Stress Management', score: 72, maxScore: 100, color: 'bg-blue-600', trend: 'stable' },
    { name: 'Adaptability', score: 68, maxScore: 100, color: 'bg-purple-600', trend: 'up' },
    { name: 'Self-Awareness', score: 82, maxScore: 100, color: 'bg-indigo-600', trend: 'up' },
  ];

  const recentSessions: CoachingSession[] = [
    {
      id: '1',
      title: 'Stress Management Session',
      description: 'Worked on breathing techniques and cognitive reframing for work-related stress.',
      date: '2 days ago',
      duration: '45 minutes',
      status: 'completed',
      type: 'stress'
    },
    {
      id: '2',
      title: 'Confidence Building Workshop',
      description: 'Explored self-talk patterns and developed positive affirmation strategies.',
      date: '5 days ago',
      duration: '30 minutes',
      status: 'completed',
      type: 'confidence'
    },
    {
      id: '3',
      title: 'Anxiety Management Techniques',
      description: 'Learned grounding exercises and mindfulness practices for anxiety relief.',
      date: '1 week ago',
      duration: '40 minutes',
      status: 'completed',
      type: 'anxiety'
    }
  ];

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Practice daily meditation',
      description: '10 minutes of mindfulness meditation each morning',
      completed: false,
      dueDate: '2024-01-15',
      category: 'mindfulness'
    },
    {
      id: '2',
      title: 'Complete stress assessment',
      description: 'Take comprehensive stress evaluation',
      completed: true,
      dueDate: '2024-01-10',
      category: 'wellness'
    },
    {
      id: '3',
      title: 'Improve sleep schedule',
      description: 'Maintain consistent 8-hour sleep routine',
      completed: false,
      dueDate: '2024-01-20',
      category: 'wellness'
    }
  ]);

  const adviceCards: AdviceCard[] = [
    {
      id: '1',
      title: 'Morning Mindfulness',
      content: 'Start your day with 5 minutes of deep breathing. This simple practice can reduce stress hormones and improve focus throughout the day.',
      category: 'Mindfulness',
      priority: 'high',
      actionable: true
    },
    {
      id: '2',
      title: 'Stress Response Pattern',
      content: 'Your recent sessions show you respond well to cognitive reframing techniques. Consider applying the "3-2-1" method when facing challenges.',
      category: 'Stress Management',
      priority: 'medium',
      actionable: true
    },
    {
      id: '3',
      title: 'Social Connection',
      content: 'Building stronger relationships can boost resilience by 40%. Consider scheduling regular check-ins with friends or family.',
      category: 'Relationships',
      priority: 'medium',
      actionable: true
    }
  ];

  const assessmentQuestions = [
    "How would you rate your current stress level?",
    "How well do you handle unexpected changes?",
    "How confident do you feel in your ability to overcome challenges?",
    "How satisfied are you with your current coping strategies?"
  ];

  const handleStartSession = () => {
    if (sessionInput.trim()) {
      // mark session active and send initial message into the chat
      setActiveSession('new-session');
      // Use the local mock engine to handle the initial input
      sendUserMessage(sessionInput);
      setSessionInput('');
    }
  };

  // --- Chatbot / Recommendation engine (self-contained, runs in-browser) ---
  // A simple chat implementation with keyword-based mock responses.
  interface ChatMessage {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    time: string;
  }

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Lightweight mock "NLP" response generator. Uses keywords to craft helpful
  // resilience and stress-management advice. All logic is local and deterministic
  // (no external APIs or model downloads required).
  const generateMockResponse = (text: string) => {
    const t = text.toLowerCase();
    // prioritize specific keywords
    if (t.includes('stress') || t.includes('stressed') || t.includes('pressure')) {
      return (
        "It sounds like you're feeling stressed. Try a 3-step grounding exercise: \n" +
        "1) Breathe: 4s inhale, 4s hold, 6s exhale for 2 minutes. \n" +
        "2) Name: Identify 3 things you can see, 2 you can touch, 1 you can hear. \n" +
        "3) Plan: Pick one small, achievable task (5-10 minutes) to regain control."
      );
    }
    if (t.includes('sleep') || t.includes('insomnia') || t.includes('tired')) {
      return (
        "Sleep concerns are common. Try a consistent wind-down routine: dim lights 60 minutes before bed, avoid screens, and do 10 minutes of deep-breathing or progressive muscle relaxation. \n" +
        "If this persists, consider tracking sleep for a week and sharing patterns with a clinician."
      );
    }
    if (t.includes('anxiety') || t.includes('panic')) {
      return (
        "For acute anxiety or panic, try grounding and short breathing exercises: \n" +
        "Box breathing: 4-4-4-4 for 3 cycles. If panic continues, move to a safe space and use sensory grounding. \n" +
        "If persistent, talk to a professional — reaching out is a strength."
      );
    }
    if (t.includes('confidence') || t.includes('self esteem') || t.includes('self-esteem')) {
      return (
        "To build confidence, list 3 recent wins each evening. Practice short, specific affirmations and set micro-goals (1-2 tasks per day) that you can complete reliably.\n" +
        "Over time, these small wins compound into stronger self-belief."
      );
    }
    if (t.includes('goal') || t.includes('motivat')) {
      return (
        "For goals and motivation, use the micro-goal approach: break a goal into 5-10 minute tasks, schedule them, and celebrate completion. \n" +
        "If motivation dips, try the 2-minute rule: start with 2 minutes — often you'll continue beyond that."
      );
    }
    // fallback answer that provides general resilience advice and an actionable step
    return (
      "Thanks for sharing — here's a simple plan you can try now:\n" +
      "1) Pause and breathe for 2 minutes.\n" +
      "2) Name one specific stressor (write it down).\n" +
      "3) Choose one tiny action to reduce it (e.g., send one email, take a short walk).\n" +
      "If you'd like, ask me for a breathing exercise, a grounding routine, or a short micro-goal."
    );
  };

  // Append a user message, then generate and append an AI response after a short delay
  const sendUserMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString() + '-u', sender: 'user', text: text.trim(), time: new Date().toLocaleTimeString() };
    setMessages((m) => [...m, userMsg]);
    setChatInput('');
    setIsTyping(true);

    // simulate 'thinking' time for the local mock engine
    setTimeout(() => {
      const aiText = generateMockResponse(text);
      const aiMsg: ChatMessage = { id: Date.now().toString() + '-a', sender: 'ai', text: aiText, time: new Date().toLocaleTimeString() };
      setMessages((m) => [...m, aiMsg]);
      setIsTyping(false);
      // ensure the session state reflects chat usage
      setActiveSession('chat-session');
    }, 700 + Math.floor(Math.random() * 600));
  };

  // handle Enter key to send
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (chatInput.trim()) sendUserMessage(chatInput);
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setActiveSession(null);
  };

  // ------------------ Start: Interactive panels (modals/drawers) ------------------
  // Mock 30-day progress data (30 points) for the sparkline/progress panel
  const progress30Days = Array.from({ length: 30 }).map((_, i) => {
    // create a gentle upward trend with random noise
    return 50 + Math.round(i * 0.6 + (Math.random() * 8 - 4));
  });

  // Modal state holds which panel is open and its payload
  const [panelOpen, setPanelOpen] = useState<{
    type: null | 'practice' | 'session' | 'progress';
    payload?: any;
  }>({ type: null });

  // Transient UI feedback (success message) state
  const [toast, setToast] = useState<string | null>(null);

  // Add a new session to recentSessions state (used for Repeat and after practice)
  // Note: we keep recentSessions as a const initially; convert to state copy for local updates
  const [localSessions, setLocalSessions] = useState<CoachingSession[]>(recentSessions);

  // Effect: close panel on Escape key
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPanelOpen({ type: null });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Open practice modal for a recommendation card
  const openPracticeModal = (advice: AdviceCard) => {
    setPanelOpen({ type: 'practice', payload: advice });
  };

  // Open session details modal
  const openSessionModal = (session: CoachingSession) => {
    setPanelOpen({ type: 'session', payload: session });
  };

  // Open progress panel
  const openProgressModal = () => {
    setPanelOpen({ type: 'progress', payload: { progress30Days } });
  };

  // Simulate starting a short practice: runs a fake timer then records a session and shows toast
  const startPracticeSimulation = (advice: AdviceCard) => {
    // close panel button will be disabled visually but we keep UX simple: show a countdown
    setToast('Practice started...');
    // simulate 5s practice
    setTimeout(() => {
      // add a mock completed session to localSessions
      const newSession: CoachingSession = {
        id: Date.now().toString(),
        title: `${advice.title} (Practice)`,
        description: advice.content,
        date: 'just now',
        duration: '5 minutes',
        status: 'completed',
        type: 'stress'
      };
      setLocalSessions((s) => [newSession, ...s]);
      setToast('Practice complete — +1 session recorded');
      // auto-close panel after short delay
      setTimeout(() => {
        setPanelOpen({ type: null });
        setToast(null);
      }, 1200);
    }, 5000);
  };

  // Simulate repeating a session: add entry and show transient success
  const repeatSession = (session: CoachingSession) => {
    const newSession: CoachingSession = {
      ...session,
      id: Date.now().toString(),
      date: 'just now',
    };
    setLocalSessions((s) => [newSession, ...s]);
    setToast('Session scheduled (simulated)');
    setTimeout(() => setToast(null), 2000);
  };

  // Simple inline Modal component (click outside to close)
  const Modal: React.FC<{ onClose: () => void; title?: string } & React.HTMLAttributes<HTMLDivElement>> = ({ onClose, title, children }) => {
    return (
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40"
        onClick={() => onClose()}
      >
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    );
  };

  // ------------------ End: Interactive panels ------------------

  const handleCompleteGoal = (goalId: string) => {
    setGoals(goals.map(goal => 
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal,
        description: '',
        completed: false,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        category: 'wellness'
      };
      setGoals([...goals, goal]);
      setNewGoal('');
      setShowGoalForm(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
          </svg>
        );
      case 'down':
        return (
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        );
    }
  };

  const getSessionTypeIcon = (type: string) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'stress':
        return (
          <svg className={`${iconClass} text-red-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'anxiety':
        return (
          <svg className={`${iconClass} text-yellow-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'confidence':
        return (
          <svg className={`${iconClass} text-green-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
      default:
        return (
          <svg className={`${iconClass} text-blue-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card title="AI Resilience Coach Center" subtitle="Build mental resilience and emotional intelligence with personalized AI coaching sessions.">
        <div></div>
      </Card>

      {/* Mood check-in + hero area */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <Card title="Daily Mood Check-In" size="lg">
            <p className="text-sm text-gray-600 mb-4">How are you feeling today?</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-4">
              {[
                {label: 'Happy', emoji: '😊'},
                {label: 'Calm', emoji: '🙂'},
                {label: 'Neutral', emoji: '😐'},
                {label: 'Sad', emoji: '😔'},
                {label: 'Anxious', emoji: '😰'},
                {label: 'Frustrated', emoji: '😤'}
              ].map((m) => (
                <button key={m.label} className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:shadow-sm">
                  <div className="text-2xl mb-2">{m.emoji}</div>
                  <div className="text-xs text-gray-600">{m.label}</div>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Energy Level</span>
                  <span className="text-sm text-gray-500">5/10</span>
                </div>
                <input type="range" min={0} max={10} defaultValue={5} className="w-full" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Stress Level</span>
                  <span className="text-sm text-gray-500">5/10</span>
                </div>
                <input type="range" min={0} max={10} defaultValue={5} className="w-full" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Motivation Level</span>
                  <span className="text-sm text-gray-500">5/10</span>
                </div>
                <input type="range" min={0} max={10} defaultValue={5} className="w-full" />
              </div>
            </div>

            <div className="mt-4">
              <Button variant="primary" fullWidth>Submit Check-In</Button>
            </div>
          </Card>
        </div>

        {/* Right timeline / quick summary column (matches screenshot) */}
        <aside className="space-y-6">
          <Card title="Resilience Journey">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold">7 Days</h4>
                <p className="text-xs text-gray-500">Track your emotional patterns and growth</p>
              </div>
            </div>
            <div className="space-y-4">
              {[{
                date: 'Mon, Jan 13', text: 'Started new project', score: 6,
              },{
                date: 'Tue, Jan 14', text: 'Difficult client meeting', score: 4,
              },{
                date: 'Wed, Jan 15', text: 'Team recognition', score: 7,
              }].map((t, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center">{i+1}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-700">{t.date}</div>
                      <div className="text-sm text-gray-500">Score: {t.score}/10</div>
                    </div>
                    <div className="text-xs text-gray-600">{t.text}</div>
                    <div className="mt-2 w-full bg-gray-200 h-2 rounded-full">
                      <div className="bg-orange-400 h-2 rounded-full" style={{ width: `${(t.score/10)*100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Content - Coaching Session */}
        <div className="xl:col-span-3 space-y-6">
          {/* Interactive Coaching Session */}
          <Card title="Start a Coaching Session" size="lg">
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-primary-100 rounded-xl">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">AI Coach Ready</h3>
                  <p className="text-sm text-gray-600">Powered by advanced emotional intelligence algorithms</p>
                </div>
              </div>
              
              {/* Chat UI: show initial prompt if no conversation yet, otherwise show message list */}
              {(!activeSession && messages.length === 0) ? (
                <>
                  <p className="text-gray-700 mb-4">
                    How are you feeling today? Share what's on your mind and let's work through it together.
                  </p>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                    rows={4}
                    placeholder="Tell me about your current challenges, goals, or what's been on your mind lately..."
                    value={sessionInput}
                    onChange={(e) => setSessionInput(e.target.value)}
                  />
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex space-x-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Stress Relief</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Confidence</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">Goal Setting</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="primary"
                        onClick={handleStartSession}
                        disabled={!sessionInput.trim()}
                      >
                        Start Session
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => { setSessionInput(''); setActiveSession(null); }}>
                        Clear
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col h-80">
                  {/* Messages container */}
                  <div className="flex-1 overflow-auto p-3 space-y-3" style={{ maxHeight: 320 }}>
                    {messages.map((m) => (
                      <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`${m.sender === 'user' ? 'bg-primary-600 text-white' : 'bg-white border'} rounded-lg p-3 max-w-[80%]`}> 
                          <div className="text-sm whitespace-pre-wrap">{m.text}</div>
                          <div className="text-xs text-gray-400 mt-2 text-right">{m.time}</div>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white border rounded-lg p-3">
                          <div className="text-sm text-gray-600">AI is typing<span className="animate-pulse">...</span></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input area */}
                  <div className="mt-3 pt-3 border-t">
                    <textarea
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a question or describe how you feel... (press Enter to send)"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                      rows={2}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-sm text-gray-500">Helpful prompts: "I feel stressed", "Can't sleep", "Need confidence"</div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={clearConversation}>Clear</Button>
                        <Button variant="primary" onClick={() => { if (chatInput.trim()) sendUserMessage(chatInput); }} disabled={!chatInput.trim()}>
                          Send
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Session Suggestions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 cursor-pointer transition-colors">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-gray-900">Stress Relief</h4>
                </div>
                <p className="text-sm text-gray-600">Quick techniques for immediate stress reduction</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 cursor-pointer transition-colors">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-gray-900">Confidence Building</h4>
                </div>
                <p className="text-sm text-gray-600">Boost self-esteem and inner strength</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 cursor-pointer transition-colors">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-gray-900">Goal Achievement</h4>
                </div>
                <p className="text-sm text-gray-600">Strategic planning for personal growth</p>
              </div>
            </div>
          </Card>

          {/* Recent Sessions */}
          <Card title="Recent Sessions">
            <div className="space-y-4">
              {recentSessions.map((session) => (
                <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      {getSessionTypeIcon(session.type)}
                      <h4 className="font-medium text-gray-900">{session.title}</h4>
                    </div>
                    <span className="text-sm text-gray-500">{session.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{session.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        {session.status === 'completed' ? 'Completed' : 'In Progress'}
                      </span>
                      <span className="text-xs text-gray-500">{session.duration}</span>
                    </div>
                    <Button variant="ghost" size="sm">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Personalized Advice Cards */}
          <Card title="Personalized Recommendations">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {adviceCards.map((advice) => (
                <div key={advice.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{advice.title}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      advice.priority === 'high' ? 'bg-red-100 text-red-800' :
                      advice.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {advice.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{advice.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{advice.category}</span>
                    {advice.actionable && (
                      <Button variant="outline" size="xs">Try This</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Tracking with Charts */}
          <Card title="Progress Tracking">
            <div className="space-y-4">
              {resilienceMetrics.map((metric, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-600">{metric.name}</span>
                    <div className="flex items-center space-x-1">
                      <span className="font-medium text-gray-900">{metric.score}/{metric.maxScore}</span>
                      {getTrendIcon(metric.trend)}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${metric.color} h-2 rounded-full transition-all duration-500`} 
                      style={{ width: `${(metric.score / metric.maxScore) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Progress Chart Placeholder */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-3">30-Day Progress</h4>
              <div className="h-32 bg-white rounded border flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2 2z" />
                  </svg>
                  <p className="text-xs text-gray-500">Progress visualization</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Resilience Assessment */}
          <Card title="Resilience Assessment">
            {!showAssessment ? (
              <>
                <p className="text-gray-600 text-sm mb-4">
                  Take a comprehensive assessment to evaluate your current resilience levels and get personalized recommendations.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Last assessment:</span>
                    <span className="text-gray-700">5 days ago</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Duration:</span>
                    <span className="text-gray-700">5-7 minutes</span>
                  </div>
                </div>
                <Button 
                  variant="secondary" 
                  fullWidth 
                  onClick={() => setShowAssessment(true)}
                >
                  Start Assessment
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">Question {assessmentStep + 1} of {assessmentQuestions.length}</h4>
                  <button 
                    onClick={() => setShowAssessment(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${((assessmentStep + 1) / assessmentQuestions.length) * 100}%` }}
                  ></div>
                </div>
                
                <p className="text-sm text-gray-700 mb-4">{assessmentQuestions[assessmentStep]}</p>
                
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      className="w-full text-left p-2 rounded border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                      onClick={() => {
                        if (assessmentStep < assessmentQuestions.length - 1) {
                          setAssessmentStep(assessmentStep + 1);
                        } else {
                          setShowAssessment(false);
                          setAssessmentStep(0);
                        }
                      }}
                    >
                      <span className="text-sm">{rating} - {
                        rating === 1 ? 'Very Poor' :
                        rating === 2 ? 'Poor' :
                        rating === 3 ? 'Average' :
                        rating === 4 ? 'Good' : 'Excellent'
                      }</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Goal Setting and Tracking */}
          <Card title="Resilience Goals">
            <div className="space-y-3 mb-4">
              {goals.map((goal) => (
                <div key={goal.id} className="flex items-start space-x-3">
                  <input 
                    type="checkbox" 
                    checked={goal.completed}
                    onChange={() => handleCompleteGoal(goal.id)}
                    className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500" 
                  />
                  <div className="flex-1">
                    <span className={`text-sm ${goal.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                      {goal.title}
                    </span>
                    {goal.description && (
                      <p className="text-xs text-gray-500 mt-1">{goal.description}</p>
                    )}
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        goal.category === 'wellness' ? 'bg-green-100 text-green-800' :
                        goal.category === 'mindfulness' ? 'bg-purple-100 text-purple-800' :
                        goal.category === 'relationships' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {goal.category}
                      </span>
                      <span className="text-xs text-gray-400">Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {!showGoalForm ? (
              <Button 
                variant="ghost" 
                size="sm" 
                fullWidth
                onClick={() => setShowGoalForm(true)}
                leftIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                }
              >
                Add New Goal
              </Button>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter your resilience goal..."
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <div className="flex space-x-2">
                  <Button variant="primary" size="sm" onClick={handleAddGoal}>
                    Add Goal
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => {
                    setShowGoalForm(false);
                    setNewGoal('');
                  }}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIResilienceCoachCenter;