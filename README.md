# NexoraFlow Dashboard - Production Ready

A comprehensive career development platform with 10 fully implemented features for skills mapping, career prediction, side hustles, and more.

## 🚀 Features

1. **Side Hustle Generator** - AI-powered side hustle recommendations
2. **Skill DNA Mapping** - Interactive radial skill visualization
3. **Industry Trend Feed** - Real-time job market trends and insights
4. **Career Twin Simulation** - Compare career paths side-by-side
5. **Predictive Career Evolution** - Forecast skill and salary growth
6. **AI Resilience Coach** - Personalized coaching sessions and goals
7. **Achievement Center** - Gamified achievement tracking
8. **Learning Pathways** - Adaptive learning path generation
9. **Community Nexus** - Job opportunities and marketplace
10. **Skill Blockchain Passport** - Verified skill credentials

## 📁 Project Structure

```
nexoraflow-dashboard/
├── backend/
│   ├── routes/           # API route definitions
│   ├── controllers/      # Business logic handlers
│   ├── utils/           # Utilities (LLM, cache, rate limiter)
│   └── .env             # Environment variables (not committed)
├── src/
│   ├── api/             # Frontend API helpers
│   ├── pages/           # React page components
│   ├── components/      # Reusable UI components
│   └── hooks/          # Custom React hooks
└── docs/               # Documentation
```

## 🛠️ Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- API keys (OpenAI, RapidAPI - see `.env.example`)

### Installation

```bash
# Install dependencies
cd nexoraflow-dashboard
npm install

cd backend
npm install
```

### Environment Setup

1. Copy `.env.example` to `backend/.env`
2. Add your API keys:
   ```env
   OPENAI_API_KEY=sk-your-key
   RAPIDAPI_KEY=your-key
   LLM_API_KEY=your-key  # Optional
   ```

### Run Development Servers

```bash
# Terminal 1: Backend (Port 3002)
cd backend
npm run dev

# Terminal 2: Frontend (Port 5173)
cd ..
npm run dev
```

## 📚 Documentation

- [Implementation Guide](./docs/IMPLEMENTATION-GUIDE.md) - Complete feature documentation
- [Files Created/Modified](./docs/FILES-CREATED-MODIFIED.md) - File listing
- [Push Instructions](./PUSH-INSTRUCTIONS.md) - GitHub deployment guide

## 🔐 Security

- `.env` files are excluded from Git
- API keys are never exposed to client-side
- Sensitive data stored server-side only
- Rate limiting and caching implemented

## 🧪 Testing

```bash
# Backend health check
curl http://localhost:3002/api/health

# Test endpoints (see docs for full examples)
curl http://localhost:3002/api/skill-dna/profile
curl -X POST http://localhost:3002/api/sidehustle \
  -H "Content-Type: application/json" \
  -d '{"skills":["JavaScript"],"hoursPerWeek":10}'
```

## 📊 Implementation Status

| Feature | Backend | Frontend | Status |
|---------|---------|----------|--------|
| Side Hustle | ✅ | ✅ | Complete |
| Skill DNA | ✅ | ✅ | Complete |
| Trend Feed | ✅ | ✅ | Complete |
| Career Twin | ✅ | ✅ | Complete |
| Predictive Evolution | ✅ | ✅ | Complete |
| Resilience Coach | ✅ | ✅ | Complete|
| Achievement Center | ✅ | ✅ | Complete |
| Learning Pathways | ✅ | ✅ | Complete |
| Community Nexus | ✅ | ✅ | Complete|
| Blockchain Passport | ✅ | ✅ | Complete|

**Backend:** 100% ✅ | **Frontend:** 100% ✅

## 🚢 Deployment

### Quick Deploy (5 Minutes)

**Frontend (Vercel)**:
1. Import repo at https://vercel.com/new
2. Framework: Vite (auto-detected)
3. Set `VITE_API_BASE_URL` = your Render backend URL
4. Deploy ✅

**Backend (Render)**:
1. Create Web Service at https://dashboard.render.com/web/new
2. Root Directory: `backend`
3. Set environment variables (see DEPLOYMENT.md)
4. Deploy ✅

### Full Documentation

- **Quick Start**: [QUICK-DEPLOY.md](./QUICK-DEPLOY.md)
- **Complete Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Error Fix**: [VERCEL-ERROR-FIX.md](./VERCEL-ERROR-FIX.md)
- **Checklist**: [DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md)

## 📝 License

This project is part of the NexoraFlow platform.

## 👤 Author

Lavanitha (lavanitha.officildesk@gmail.com)

---

**Repository:** https://github.com/lavanitha-officildesk/nexoraflow-refined-prototype
