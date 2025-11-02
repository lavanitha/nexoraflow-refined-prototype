import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import ErrorBoundary from './components/ErrorBoundary';
import DashboardHome from './pages/DashboardHome.tsx';
import SideHustleDiscoveryHub from './pages/SideHustleDiscoveryHub.tsx';
import AIResilienceCoachCenter from './pages/AIResilienceCoachCenter.tsx';
import AchievementGamificationCenter from './pages/AchievementGamificationCenter.tsx';
import AdaptiveLearningPathways from './pages/AdaptiveLearningPathways.tsx';
import CommunityNexusHub from './pages/CommunityNexusHub.tsx';
import SkillDNAMapping from './pages/SkillDNAMapping.tsx';
import CareerTwinSimulation from './pages/CareerTwinSimulation.tsx';
import PredictiveCareerEvolution from './pages/PredictiveCareerEvolution.tsx';
import IndustryTrendFeed from './pages/IndustryTrendFeed.tsx';
import FailurePathwayForecasting from './pages/FailurePathwayForecasting.tsx';
import SkillBlockchainPassport from './pages/SkillBlockchainPassport.tsx';
import { ToastProvider } from './contexts/ToastContext.tsx';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<ErrorBoundary><DashboardHome /></ErrorBoundary>} />
            <Route path="/side-hustle" element={<SideHustleDiscoveryHub />} />
            <Route path="/resilience-coach" element={<AIResilienceCoachCenter />} />
            <Route path="/achievements" element={<AchievementGamificationCenter />} />
            <Route path="/learning-pathways" element={<AdaptiveLearningPathways />} />
            <Route path="/community" element={<CommunityNexusHub />} />
            <Route path="/community/skill-dna" element={<SkillDNAMapping />} />
            <Route path="/career-twin" element={<CareerTwinSimulation />} />
            <Route path="/predictive-evolution" element={<PredictiveCareerEvolution />} />
            <Route path="/industry-trend" element={<IndustryTrendFeed />} />
            <Route path="/failure-pathway" element={<FailurePathwayForecasting />} />
            <Route path="/skill-passport" element={<SkillBlockchainPassport />} />
          </Routes>
        </Layout>
      </Router>
    </ToastProvider>
  );
}

export default App;