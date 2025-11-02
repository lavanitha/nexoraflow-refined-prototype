# NexoraFlow - Complete Implementation Guide

## Overview

This document outlines the end-to-end implementation of all 10 features in the NexoraFlow dashboard. Each feature is backed by server-side API endpoints that use environment variables for API keys and external services.

## Environment Variables

### Primary .env Location
```
C:\Users\lavan\Downloads\nexoraflow-dashboard-production-ready\nexoraflow-dashboard\backend\.env
```

### Required Environment Variables

| Variable | Used By | Purpose |
|----------|---------|---------|
| `OPENAI_API_KEY` | Side Hustle, Skill DNA, Trend Feed, Predictive Evolution, Resilience Coach, Learning Pathways | OpenAI GPT API for AI-powered features |
| `RAPIDAPI_KEY` | Career Twin, Trend Feed, Predictive Evolution, Community Nexus | RapidAPI for job/salary data (Adzuna) |
| `RAPIDAPI_HOST` | Career Twin, Trend Feed, Community Nexus | RapidAPI host (default: baskarm28-adzuna-v1.p.rapidapi.com) |
| `LLM_API_KEY` | Career Twin | LLM provider API key (OpenAI/Gemini/OpenRouter) |
| `LLM_API_PROVIDER` | Career Twin | LLM provider: 'openai', 'gemini', or 'openrouter' |
| `GEMINI_API_KEY` | Career Twin | Google Gemini API key (if using Gemini) |
| `PINECONE_API_KEY` | Skill DNA | Pinecone vector DB (optional) |
| `PINECONE_ENV` | Skill DNA | Pinecone environment (optional) |
| `PINECONE_INDEX` | Skill DNA | Pinecone index name (optional) |
| `MONGO_URI` | Career Twin, Achievement Center | MongoDB connection string (optional) |
| `CACHE_TTL_MINUTES` | All features | Cache TTL in minutes (default varies) |
| `RATE_LIMIT_PER_HOUR` | All features | Rate limit per IP per hour (default: 30) |
| `PORT` | Backend | Server port (default: 3002) |
| `NODE_ENV` | All | Environment: 'development' or 'production' |
| `VITE_API_BASE_URL` | Frontend | Backend API base URL (default: http://localhost:3002) |

## Feature Implementation Map

### 1. Side Hustle Generator ✓

**UI Element → Endpoint → Env Var:**
- Generate Ideas button → `POST /api/sidehustle` → `OPENAI_API_KEY`

**Backend:**
- Route: `backend/routes/sideHustle.js`
- Controller: `backend/controllers/sideHustleController.js`
- Caching: 2 min TTL
- Rate Limit: 30 req/min

**Frontend:**
- Hook: `src/hooks/useSideHustle.js`
- API: `src/api/careerCompare.js` (uses side hustle endpoint)
- Page: `src/pages/SideHustleDiscoveryHub.tsx`

**Test:**
```bash
curl -X POST http://localhost:3002/api/sidehustle \
  -H "Content-Type: application/json" \
  -d '{"skills":["JavaScript","React"],"hoursPerWeek":10}'
```

### 2. Skill DNA Mapping ✓

**UI Element → Endpoint → Env Var:**
- Profile load → `GET /api/skill-dna/profile` → `OPENAI_API_KEY`, `PINECONE_API_KEY` (optional)
- MicroLearn button → `POST /api/skill-dna/simulate` → `OPENAI_API_KEY`
- Generate Pathway → `POST /api/skill-dna/simulate` → `OPENAI_API_KEY`

**Backend:**
- Route: `backend/routes/skillDNA.js`
- Controller: `backend/controllers/skillDNAController.js`
- Utils: `backend/utils/skillEngine.js`, `backend/utils/skillEmbeddings.js`
- Caching: 10 min TTL
- Rate Limit: 20 req/min

**Frontend:**
- Hook: `src/hooks/useSkillDNA.js`
- API: `src/api/skillDNA.js`
- Component: `src/components/SkillDetailModal.tsx`
- Page: `src/pages/SkillDNAMapping.tsx`

**Test:**
```bash
curl http://localhost:3002/api/skill-dna/profile
curl -X POST http://localhost:3002/api/skill-dna/simulate \
  -H "Content-Type: application/json" \
  -d '{"action":"microlearn","payload":{}}'
```

### 3. Industry Trend Feed

**UI Element → Endpoint → Env Var:**
- Trends load → `GET /api/trend-feed/trends` → `OPENAI_API_KEY`, `RAPIDAPI_KEY` (optional)
- Subscribe button → `POST /api/trend-feed/subscribe` → None

**Backend:**
- Route: `backend/routes/trendFeed.js`
- Controller: `backend/controllers/trendFeedController.js`
- Utils: `backend/utils/rapidApiClient.js`
- Caching: 30 min TTL
- Rate Limit: 20 req/min

**Frontend:**
- API: `src/api/trendFeed.js`
- Page: `src/pages/IndustryTrendFeed.tsx`

**Test:**
```bash
curl "http://localhost:3002/api/trend-feed/trends?industry=AI&location=India&timeWindow=30"
```

### 4. Career Twin Simulation ✓

**UI Element → Endpoint → Env Var:**
- Simulation run → `POST /api/career-twin/simulate` → `LLM_API_KEY`, `RAPIDAPI_KEY` (optional)
- Save snapshot → `POST /api/career-twin/history` → `MONGO_URI` (optional)

**Backend:**
- Route: `backend/routes/careerTwin.js`
- Controller: `backend/controllers/careerTwinController.js`
- Utils: `backend/utils/llmClient.js`
- Caching: 6 hours TTL
- Rate Limit: Uses default limiter

**Frontend:**
- API: `src/api/careerCompare.js`
- Page: `src/pages/CareerTwinSimulation.tsx`

**Test:**
```bash
curl -X POST http://localhost:3002/api/career-twin/simulate \
  -H "Content-Type: application/json" \
  -d '{"career1":"Frontend Engineer","career2":"Backend Engineer","timelineYears":2}'
```

### 5. Predictive Career Evolution

**UI Element → Endpoint → Env Var:**
- Generate projection → `POST /api/predictive-evolution/project` → `OPENAI_API_KEY`, `RAPIDAPI_KEY` (optional)
- Export button → `POST /api/predictive-evolution/export` → None

**Backend:**
- Route: `backend/routes/predictiveEvolution.js`
- Controller: `backend/controllers/predictiveEvolutionController.js`
- Utils: `backend/utils/rapidApiClient.js`
- Caching: 60 min TTL
- Rate Limit: 15 req/min

**Frontend:**
- API: `src/api/predictiveEvolution.js`
- Page: `src/pages/PredictiveCareerEvolution.tsx`

**Test:**
```bash
curl -X POST http://localhost:3002/api/predictive-evolution/project \
  -H "Content-Type: application/json" \
  -d '{"careerId":"data-scientist","experienceLevel":50,"projectionWindow":5}'
```

### 6. AI Resilience Coach

**UI Element → Endpoint → Env Var:**
- Start session → `POST /api/resilience-coach/session` → `OPENAI_API_KEY`
- Create goal → `POST /api/resilience-coach/goals` → None
- Run assessment → `POST /api/resilience-coach/assessment` → None

**Backend:**
- Route: `backend/routes/resilienceCoach.js`
- Controller: `backend/controllers/resilienceCoachController.js`
- Storage: JSON files in `backend/data/`
- Caching: 10 min TTL
- Rate Limit: 10 req/min

**Frontend:**
- API: `src/api/resilienceCoach.js`
- Page: `src/pages/AIResilienceCoachCenter.tsx`

**Test:**
```bash
curl -X POST http://localhost:3002/api/resilience-coach/session \
  -H "Content-Type: application/json" \
  -d '{"input":"Feeling stressed about work deadlines","type":"stress"}'
```

### 7. Achievement Center

**UI Element → Endpoint → Env Var:**
- Get achievements → `GET /api/achievements` → None
- Save achievement → `POST /api/achievements` → None
- Export → `GET /api/achievements/export` → None

**Backend:**
- Route: `backend/routes/achievements.js` (new)
- Controller: `backend/controllers/achievementController.js`
- Storage: JSON files in `backend/data/`
- Rate Limit: 30 req/min

**Frontend:**
- API: Use existing achievement routes
- Page: `src/pages/AchievementGamificationCenter.tsx`

**Test:**
```bash
curl http://localhost:3002/api/achievements
curl -X POST http://localhost:3002/api/achievements \
  -H "Content-Type: application/json" \
  -d '{"achievement":{"id":"1","title":"First Skill","points":100}}'
```

### 8. Learning Pathways

**UI Element → Endpoint → Env Var:**
- Generate pathway → `POST /api/learning-pathways/generate` → `OPENAI_API_KEY`
- Micro-learn → `POST /api/learning-pathways/micro-learn` → `OPENAI_API_KEY`

**Backend:**
- Route: `backend/routes/learningPathways.js`
- Controller: `backend/controllers/learningPathwaysController.js`
- Storage: JSON files in `backend/data/`
- Caching: 60 min TTL
- Rate Limit: 15 req/min

**Frontend:**
- API: `src/api/learningPathways.js`
- Page: `src/pages/AdaptiveLearningPathways.tsx`

**Test:**
```bash
curl -X POST http://localhost:3002/api/learning-pathways/generate \
  -H "Content-Type: application/json" \
  -d '{"skills":["JavaScript","React"],"goals":"Frontend Development","timeframe":"6 months"}'
```

### 9. Community Nexus

**UI Element → Endpoint → Env Var:**
- Search opportunities → `GET /api/community-nexus/opportunities` → `RAPIDAPI_KEY` (optional)
- Get marketplace → `GET /api/community-nexus/marketplace` → None

**Backend:**
- Route: `backend/routes/communityNexus.js`
- Controller: `backend/controllers/communityNexusController.js`
- Utils: `backend/utils/rapidApiClient.js`
- Caching: 30 min TTL
- Rate Limit: 20 req/min

**Frontend:**
- API: `src/api/communityNexus.js`
- Page: `src/pages/CommunityNexusHub.tsx`

**Test:**
```bash
curl "http://localhost:3002/api/community-nexus/opportunities?query=JavaScript&category=Tech&location=India"
```

### 10. Skill Blockchain Passport

**UI Element → Endpoint → Env Var:**
- Get records → `GET /api/blockchain-passport/records` → None
- Verify record → `POST /api/blockchain-passport/verify` → None
- Export passport → `GET /api/blockchain-passport/export` → None

**Backend:**
- Route: `backend/routes/blockchainPassport.js`
- Controller: `backend/controllers/blockchainPassportController.js`
- Storage: JSON files in `backend/data/`
- Rate Limit: 20 req/min

**Frontend:**
- API: `src/api/blockchainPassport.js`
- Page: `src/pages/SkillBlockchainPassport.tsx`

**Test:**
```bash
curl http://localhost:3002/api/blockchain-passport/records
curl -X POST http://localhost:3002/api/blockchain-passport/verify \
  -H "Content-Type: application/json" \
  -d '{"title":"Python Programming","issuer":"Coursera","level":"EXPERT"}'
```

## Quick Start Guide

### 1. Setup Environment Variables

Edit `nexoraflow-dashboard/backend/.env`:

```env
# Required
OPENAI_API_KEY=sk-your-openai-key
RAPIDAPI_KEY=your-rapidapi-key
RAPIDAPI_HOST=baskarm28-adzuna-v1.p.rapidapi.com

# Career Twin
LLM_API_KEY=your-llm-key
LLM_API_PROVIDER=openai  # or 'gemini' or 'openrouter'
GEMINI_API_KEY=your-gemini-key  # if using Gemini

# Optional
PINECONE_API_KEY=your-pinecone-key
PINECONE_ENV=us-east1-gcp
PINECONE_INDEX=skill-dna
MONGO_URI=mongodb://localhost:27017/nexoraflow

# Configuration
CACHE_TTL_MINUTES=60
RATE_LIMIT_PER_HOUR=30
PORT=3002
NODE_ENV=development
```

### 2. Install Dependencies

```bash
cd nexoraflow-dashboard/backend
npm install

cd ../..
npm install  # Root dependencies
```

### 3. Start Backend

```bash
cd nexoraflow-dashboard/backend
npm run dev
```

Backend runs on `http://localhost:3002`

### 4. Start Frontend

```bash
cd nexoraflow-dashboard
npm run dev
```

Frontend runs on `http://localhost:5173`

### 5. Access Features

- Side Hustle: http://localhost:5173/side-hustle
- Skill DNA: http://localhost:5173/community/skill-dna
- Industry Trends: http://localhost:5173/industry-trend
- Career Twin: http://localhost:5173/career-twin
- Predictive Evolution: http://localhost:5173/predictive-evolution
- Resilience Coach: http://localhost:5173/resilience-coach
- Achievements: http://localhost:5173/achievements
- Learning Pathways: http://localhost:5173/learning-pathways
- Community Nexus: http://localhost:5173/community
- Blockchain Passport: http://localhost:5173/skill-passport

## Data Persistence

### JSON File Storage (Dev Mode)

The following features use JSON file storage in `backend/data/`:
- Resilience Coach: `resilience-sessions.json`, `resilience-goals.json`
- Achievement Center: `achievements.json`
- Learning Pathways: `learning-pathways.json`
- Blockchain Passport: `blockchain-passport.json`

**Note:** In production, these should use MongoDB or another database. The JSON file storage is for development only.

## Caching Strategy

All features implement in-memory caching with TTL:
- Side Hustle: 2 minutes
- Skill DNA: 10 minutes
- Trend Feed: 30 minutes
- Predictive Evolution: 60 minutes
- Resilience Coach: 10 minutes
- Learning Pathways: 60 minutes
- Community Nexus: 30 minutes

## Rate Limiting

All endpoints use per-IP rate limiting:
- Side Hustle: 30 req/min
- Skill DNA: 20 req/min
- Trend Feed: 20 req/min
- Predictive Evolution: 15 req/min
- Resilience Coach: 10 req/min
- Learning Pathways: 15 req/min
- Community Nexus: 20 req/min
- Blockchain Passport: 20 req/min

## Error Handling

All endpoints:
- Return structured JSON with `success` boolean
- Include friendly error messages
- Show stack traces only in development mode
- Gracefully fall back to demo data when APIs unavailable

## Missing API Keys

If a required API key is missing:
1. Feature shows "Offline mode" banner
2. Uses cached/fallback data if available
3. Returns deterministic responses where possible
4. Logs warning (not error) to console

## Testing

### Manual Testing

Each feature includes curl examples in its section above.

### Unit Tests

Run backend tests:
```bash
cd nexoraflow-dashboard/backend
npm test
```

## File Structure Summary

### Backend Files Created/Modified

**Controllers:**
- `backend/controllers/trendFeedController.js`
- `backend/controllers/predictiveEvolutionController.js`
- `backend/controllers/resilienceCoachController.js`
- `backend/controllers/achievementController.js`
- `backend/controllers/learningPathwaysController.js`
- `backend/controllers/communityNexusController.js`
- `backend/controllers/blockchainPassportController.js`

**Routes:**
- `backend/routes/trendFeed.js`
- `backend/routes/predictiveEvolution.js`
- `backend/routes/resilienceCoach.js`
- `backend/routes/achievements.js`
- `backend/routes/learningPathways.js`
- `backend/routes/communityNexus.js`
- `backend/routes/blockchainPassport.js`
- `backend/routes/index.js` (updated)

**Utils:**
- `backend/utils/rapidApiClient.js`

### Frontend Files Created

**API Helpers:**
- `src/api/trendFeed.js`
- `src/api/predictiveEvolution.js`
- `src/api/resilienceCoach.js`
- `src/api/learningPathways.js`
- `src/api/communityNexus.js`
- `src/api/blockchainPassport.js`

## Next Steps

1. **Wire Frontend Pages**: Add API calls to existing pages without changing UI
2. **Add Unit Tests**: Create tests for each controller
3. **Add Integration Tests**: Test end-to-end flows
4. **Production Setup**: Replace JSON file storage with MongoDB
5. **Monitoring**: Add logging and metrics collection

## Support

For issues or questions:
1. Check `.env` file for missing keys
2. Verify backend is running on port 3002
3. Check browser console for API errors
4. Review backend logs for detailed error messages

