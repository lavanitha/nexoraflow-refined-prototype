# Career Twin Simulation - Backend Integration

Complete end-to-end backend implementation for the Career Twin Simulation feature with LLM integration, caching, and rate limiting.

## Overview

The Career Twin Simulation allows users to compare two career paths side-by-side with AI-powered insights including:
- Skill overlap and gaps
- Salary and demand projections
- Timeline-based skill growth forecasts
- Transition roadmaps
- Confidence scores

## Environment Variables

Set the following environment variables in your `backend/.env` file:

### Required for LLM Integration
- `LLM_API_PROVIDER` - One of: `openai`, `gemini`, `openrouter` (default: `gemini`)
- `LLM_API_KEY` - API key for the selected provider
  - OpenAI: Get from https://platform.openai.com/api-keys
  - Gemini: Get from https://aistudio.google.com/app/apikey
  - OpenRouter: Get from https://openrouter.ai/keys

### Optional but Recommended
- `GEMINI_API_KEY` - Alternative Gemini API key (if using Gemini provider)
- `RAPIDAPI_KEY` - Adzuna job data API key (for salary/demand enrichment)
  - Get from https://rapidapi.com/baskarm28/api/adzuna
- `RAPIDAPI_HOST` - Adzuna API host (default: `baskarm28-adzuna-v1.p.rapidapi.com`)
- `MONGO_URI` - MongoDB connection string (enables save/history features)
  - Format: `mongodb://localhost:27017/nexoraflow` or MongoDB Atlas connection string

### Configuration
- `CACHE_TTL_MINUTES` - Cache duration in minutes (default: 360)
- `RATE_LIMIT_PER_HOUR` - Max requests per IP per hour (default: 30)
- `APP_ORIGIN` - Frontend origin URL (default: `http://localhost:5173`)
- `PORT` - Backend server port (default: 3002)

### Example .env file

```env
# LLM Configuration
LLM_API_PROVIDER=openai
LLM_API_KEY=sk-...

# Optional: Gemini (if provider is gemini)
GEMINI_API_KEY=...

# Optional: RapidAPI for job data
RAPIDAPI_KEY=...
RAPIDAPI_HOST=baskarm28-adzuna-v1.p.rapidapi.com

# Optional: MongoDB for save/history
MONGO_URI=mongodb://localhost:27017/nexoraflow

# Configuration
CACHE_TTL_MINUTES=360
RATE_LIMIT_PER_HOUR=30
APP_ORIGIN=http://localhost:5173
PORT=3002
```

## Installation

```bash
cd backend
npm install
```

No additional dependencies required (uses native Node.js modules).

## Running the Server

```bash
# Development
cd backend
npm run dev

# Production
npm start
```

Server runs on port 3002 by default (configurable via `PORT` env var).

## API Endpoints

### POST /api/compare

Compare two career paths.

**Request Body:**
```json
{
  "career1": "Frontend Engineer",
  "career2": "Data Scientist",
  "timelineYears": 2,
  "resolutionMonths": 24,
  "userSkills": [
    {"name": "JavaScript", "score": 72},
    {"name": "React", "score": 65}
  ],
  "location": "India",
  "experienceYears": 5,
  "userId": "user-123"
}
```

**Response:**
```json
{
  "success": true,
  "skill_overlap": ["JavaScript", "React"],
  "skill_gap_career1": ["Python", "Machine Learning"],
  "skill_gap_career2": ["SQL", "Statistics"],
  "demand_score": {"career1": 0.87, "career2": 0.76},
  "salary": {"career1": 870000, "career2": 910000, "currency": "INR"},
  "projected_skill_timeline": {
    "career1": [{"month": 0, "score": 68}, {"month": 24, "score": 82}],
    "career2": [{"month": 0, "score": 70}, {"month": 24, "score": 86}]
  },
  "transition_roadmap": [
    {"month": 1, "action": "Complete Python fundamentals course", "estimateHours": 40},
    {"month": 6, "action": "Build ML project portfolio", "estimateHours": 120},
    {"month": 12, "action": "Apply for data scientist positions", "estimateHours": 80}
  ],
  "confidence": 0.85,
  "sources": ["llm-openai", "rapidapi-adzuna"],
  "meta": {
    "model": "gpt-4o-mini",
    "tokensUsed": 450,
    "sources": ["llm-openai"],
    "cacheHit": false,
    "latencyMs": 1234
  }
}
```

### POST /api/save-comparison

Save comparison to database (requires `MONGO_URI`).

**Status:** 501 if DB not configured.

### GET /api/history?userId=user-123

Get comparison history (requires `MONGO_URI`).

**Status:** 501 if DB not configured.

### GET /api/compare/health

Health check endpoint.

**Response:**
```json
{
  "ok": true,
  "provider": "openai",
  "llm_key_set": true,
  "rapidapi_set": true,
  "mongo_set": false,
  "cacheSize": 5,
  "rateLimit": 30,
  "stats": {
    "totalRequests": 12,
    "uniqueIPs": 3
  }
}
```

## Testing

### Unit Tests

```bash
cd backend
npm test
```

Tests cover:
- Valid LLM JSON parsing
- Malformed JSON retry logic
- Deterministic fallback generation
- Cache operations
- Rate limiting
- RapidAPI integration

### Manual Testing with cURL

**Basic comparison (all required fields):**
```bash
curl -X POST http://localhost:3002/api/compare \
  -H "Content-Type: application/json" \
  -d '{
    "career1": "Frontend Engineer",
    "career2": "Data Scientist",
    "timelineYears": 2,
    "resolutionMonths": 24,
    "userSkills": [
      {"name": "JavaScript", "score": 72},
      {"name": "React", "score": 65},
      {"name": "SQL", "score": 45}
    ]
  }'
```

**With optional fields:**
```bash
curl -X POST http://localhost:3002/api/compare \
  -H "Content-Type: application/json" \
  -d '{
    "career1": "Frontend Engineer",
    "career2": "Data Scientist",
    "timelineYears": 2,
    "resolutionMonths": 24,
    "userSkills": [
      {"name": "JavaScript", "score": 72},
      {"name": "React", "score": 65}
    ],
    "location": "India",
    "experienceYears": 5,
    "userId": "user-123"
  }'
```

**Health check:**
```bash
curl http://localhost:3002/api/compare/health
```

### Example Output (With LLM API Key)

If LLM API key is configured, response includes AI-generated insights:

```json
{
  "success": true,
  "skill_overlap": ["JavaScript", "React", "TypeScript"],
  "skill_gap_career1": ["Python", "Machine Learning", "Statistics"],
  "skill_gap_career2": ["UI/UX Design", "CSS Frameworks", "Web Performance"],
  "demand_score": {"career1": 0.87, "career2": 0.76},
  "salary": {"career1": 870000, "career2": 910000, "currency": "INR"},
  "projected_skill_timeline": {
    "career1": [
      {"month": 0, "score": 68},
      {"month": 6, "score": 73},
      {"month": 12, "score": 77},
      {"month": 18, "score": 80},
      {"month": 24, "score": 82}
    ],
    "career2": [
      {"month": 0, "score": 55},
      {"month": 6, "score": 65},
      {"month": 12, "score": 72},
      {"month": 18, "score": 79},
      {"month": 24, "score": 86}
    ]
  },
  "transition_roadmap": [
    {"month": 1, "action": "Complete Python fundamentals and statistics courses", "estimateHours": 40},
    {"month": 3, "action": "Build first ML project using scikit-learn", "estimateHours": 60},
    {"month": 6, "action": "Build portfolio of 3-4 data science projects", "estimateHours": 120},
    {"month": 12, "action": "Apply for data scientist positions and network", "estimateHours": 80}
  ],
  "confidence": 0.85,
  "sources": ["llm-openai", "rapidapi-adzuna"],
  "meta": {
    "model": "gpt-4o-mini",
    "tokensUsed": 450,
    "sources": ["llm-openai"],
    "cacheHit": false,
    "latencyMs": 1234
  }
}
```

### Example Output (Deterministic Fallback)

If LLM API key is not set, the system returns a deterministic fallback:

```json
{
  "success": true,
  "skill_overlap": ["JavaScript", "React"],
  "skill_gap_career1": ["Industry Knowledge", "Certifications"],
  "skill_gap_career2": ["Industry Knowledge", "Certifications"],
  "demand_score": {"career1": 0.5, "career2": 0.5},
  "salary": {"career1": 0, "career2": 0, "currency": "INR"},
  "projected_skill_timeline": {
    "career1": [{"month": 0, "score": 69}, {"month": 24, "score": 89}],
    "career2": [{"month": 0, "score": 69}, {"month": 24, "score": 93}]
  },
  "transition_roadmap": [
    {"month": 1, "action": "Complete foundational courses", "estimateHours": 40},
    {"month": 6, "action": "Build project portfolio", "estimateHours": 120},
    {"month": 12, "action": "Apply for positions and network", "estimateHours": 80}
  ],
  "confidence": 0.3,
  "sources": ["fallback-deterministic", "missing-llm-key"],
  "meta": {
    "model": "deterministic-fallback",
    "tokensUsed": 0,
    "sources": ["fallback-deterministic", "missing-llm-key"],
    "cacheHit": false,
    "latencyMs": 5
  }
}
```

## Features

### LLM Provider Support

**OpenAI:**
- Models: `gpt-4o-mini`, `gpt-4o`
- Endpoint: `https://api.openai.com/v1/chat/completions`

**Gemini:**
- Models: `gemini-1.5-flash`
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`

**OpenRouter:**
- Models: `openai/gpt-4o-mini`, `anthropic/claude-3-haiku`, etc.
- Endpoint: `https://openrouter.ai/api/v1/chat/completions`

### Caching

- In-memory cache with configurable TTL
- Cache key: hash of `career1|career2|location|timeline|userSkills`
- Automatic cleanup of expired entries
- Cache hits return immediately (~5ms latency)

### Rate Limiting

- Per-IP rate limiting (default: 30 requests/hour)
- Health check endpoint excluded
- Cleanup of expired rate limit records
- Returns 429 status with `retryAfter` header

### Error Handling

- Input validation (field presence, lengths, ranges)
- LLM timeout protection (25s max)
- Automatic JSON retry on malformed responses
- Deterministic fallback on complete LLM failure
- Graceful degradation when RapidAPI unavailable

## Frontend Integration

### Import API Helper

```typescript
import { compareCareers, saveComparison, checkHealth } from '../api/careerCompare';
```

### Example Usage

```typescript
// Compare careers
const result = await compareCareers({
  career1: 'Frontend Engineer',
  career2: 'Data Scientist',
  timelineYears: 2,
  resolutionMonths: 24,
  userSkills: [
    { name: 'JavaScript', score: 72 },
    { name: 'React', score: 65 }
  ],
  location: 'India'
});

// Check health
const health = await checkHealth();
console.log(health.llm_key_set); // true/false
```

## Architecture

```
backend/
├── routes/
│   └── compare.js          # Route definitions
├── controllers/
│   └── compareController.js # Request handlers
├── utils/
│   ├── llmClient.js        # LLM provider abstraction
│   ├── cache.js            # In-memory cache
│   └── rateLimiter.js      # Rate limiting
└── tests/
    └── compare.test.js     # Unit tests

src/
└── api/
    └── careerCompare.js    # Frontend API helper
```

## Logging

Logs include:
- Cache hits/misses
- LLM model used
- Request latency
- API provider status

**Privacy:** User skill scores and PII are NOT logged.

## Troubleshooting

**LLM returns errors:**
- Check `LLM_API_KEY` is set correctly
- Verify `LLM_API_PROVIDER` is one of: openai, gemini, openrouter
- Check API key permissions/quota

**RapidAPI not working:**
- Verify `RAPIDAPI_KEY` and `RAPIDAPI_HOST`
- System falls back gracefully without RapidAPI data

**Rate limit hit:**
- Default is 30 requests/hour per IP
- Adjust via `RATE_LIMIT_PER_HOUR`

**Cache not working:**
- Cache is per-instance (lost on restart)
- Set `CACHE_TTL_MINUTES` to adjust expiry

## License

MIT

