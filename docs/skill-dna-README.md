# Skill DNA Mapping - Integration Guide

## Overview

The Skill DNA Mapping feature provides an interactive visualization of user skills through a **Radial Map** and **Skill Matrix**. Users can view skill clusters, proficiency levels, generate learning pathways, and apply micro-learning actions. The feature integrates with OpenAI for embeddings and skill clustering (Pinecone optional).

## Features

- **Radial Map Visualization**: Skills positioned by cluster (angle) and proficiency (radius)
- **Skill Matrix Visualization**: Skills grouped by category and proficiency level
- **MicroLearn Actions**: Apply +2% proficiency boost to skills
- **Generate Pathway**: Create projected growth timeline over 24 months
- **Skill Details Modal**: View detailed information, related skills, micro-learning suggestions
- **Pin/Unpin Skills**: Save important skills to localStorage
- **Gap Radar**: Identify skill gaps and improvement opportunities
- **Career Opportunity Matching**: Top opportunity recommendations based on skill strengths

## API Endpoints

### `GET /api/skill-dna/profile`

Returns the complete skill profile with clusters, radial coordinates, matrix data, and snapshot information.

**Response:**
```json
{
  "success": true,
  "skills": [
    {
      "id": "js",
      "name": "JavaScript",
      "category": "Core",
      "proficiency": 75,
      "exp": 2.5,
      "related": ["React", "Node.js"],
      "pinned": false
    }
  ],
  "radialCoords": {
    "js": {
      "angle": 0,
      "radius": 0.75
    }
  },
  "matrixData": {
    "js": {
      "categoryIndex": 0,
      "categoryCount": 7,
      "proficiency": 75,
      "level": "intermediate"
    }
  },
  "clusters": [
    {
      "id": "core",
      "name": "Core",
      "angle": 0,
      "skills": ["js"]
    }
  ],
  "snapshot": {
    "topOpportunity": "Frontend Engineer",
    "gapRadar": [
      {
        "name": "Machine Learning",
        "gap": 40,
        "currentProficiency": 30
      }
    ],
    "totalSkills": 7,
    "avgProficiency": 57
  },
  "cached": false
}
```

### `POST /api/skill-dna/simulate`

Simulates skill updates based on actions.

**Request Body:**
```json
{
  "action": "microlearn" | "generatePathway",
  "payload": {
    "skillId": "js",  // Optional for microlearn
    "months": 24      // Required for generatePathway
  }
}
```

**Response (microlearn):**
```json
{
  "success": true,
  "action": "microlearn",
  "updatedSkills": [
    {
      "id": "js",
      "proficiency": 77
    }
  ]
}
```

**Response (generatePathway):**
```json
{
  "success": true,
  "action": "generatePathway",
  "timeline": [
    {
      "month": 0,
      "skills": [
        { "id": "js", "proficiency": 75 }
      ],
      "avgProficiency": 57
    }
  ],
  "projectedSkills": [
    {
      "id": "js",
      "proficiency": 75,
      "projectedProficiency": 85,
      "growthRate": 0.3
    }
  ]
}
```

### `POST /api/skill-dna/embeddings` (Optional)

Generates embeddings for skills using OpenAI.

**Request Body:**
```json
{
  "skills": [
    {
      "id": "js",
      "name": "JavaScript",
      "category": "Core"
    }
  ]
}
```

## Environment Variables

Add to `backend/.env`:

```env
# Required
OPENAI_API_KEY=sk-your-openai-key-here

# Optional (for Pinecone integration)
PINECONE_API_KEY=your-pinecone-key
PINECONE_ENV=us-east1-gcp
PINECONE_INDEX=skill-dna
```

## Frontend Integration

### Hooks

**`useSkillDNA`** (`src/hooks/useSkillDNA.js`)

```javascript
const { loading, profile, error, fetchProfile, simulate } = useSkillDNA();

// Fetch profile
await fetchProfile();

// Simulate microlearn
await simulate('microlearn', { skillId: 'js' });

// Generate pathway
await simulate('generatePathway', { months: 24 });
```

### Components

**`SkillDetailModal`** (`src/components/SkillDetailModal.tsx`)

Modal component for displaying detailed skill information.

**Props:**
- `skill`: SkillDetail object
- `isOpen`: boolean
- `onClose`: () => void
- `onPin`: (skillId: string) => void
- `onMicroLearn`: (skillId: string) => void
- `isPinned`: boolean

### localStorage

Pinned skills are saved to `localStorage['nexora_skill_pins']` as a JSON array of skill IDs.

## Usage Example

```bash
# Fetch profile
curl http://localhost:3002/api/skill-dna/profile

# Apply microlearn to all skills
curl -X POST http://localhost:3002/api/skill-dna/simulate \
  -H "Content-Type: application/json" \
  -d '{"action":"microlearn","payload":{}}'

# Apply microlearn to specific skill
curl -X POST http://localhost:3002/api/skill-dna/simulate \
  -H "Content-Type: application/json" \
  -d '{"action":"microlearn","payload":{"skillId":"js"}}'

# Generate pathway
curl -X POST http://localhost:3002/api/skill-dna/simulate \
  -H "Content-Type: application/json" \
  -d '{"action":"generatePathway","payload":{"months":24}}'
```

## Architecture

### Backend

- **Routes**: `backend/routes/skillDNA.js` - API route definitions
- **Controller**: `backend/controllers/skillDNAController.js` - Request handlers
- **Skill Engine**: `backend/utils/skillEngine.js` - Cluster computation, radial coords, simulations
- **Embeddings**: `backend/utils/skillEmbeddings.js` - OpenAI/Pinecone integration

### Frontend

- **Page**: `src/pages/SkillDNAMapping.tsx` - Main page component
- **Hook**: `src/hooks/useSkillDNA.js` - API integration hook
- **Modal**: `src/components/SkillDetailModal.tsx` - Skill detail modal
- **API Helper**: `src/api/skillDNA.js` - API helper functions

## Key Features Implementation

### Radial Map

- Skills positioned by cluster angle (from embeddings) and proficiency radius
- Uses `profile.radialCoords` from API for accurate positioning
- Click skills to open detail modal

### Skill Matrix

- Skills grouped by category
- Color-coded by proficiency level (yellow=beginner, blue=intermediate, green=expert)
- Uses `profile.matrixData` for positioning

### MicroLearn

- Adds +2% proficiency to selected skill(s)
- Updates backend cache
- Refreshes frontend profile automatically

### Generate Pathway

- Creates projected growth timeline over specified months
- Updates Career Twin visualization
- Shows average proficiency progression

### Gap Radar

- Identifies top 3 skill gaps
- Shows gap percentage to reach 70% proficiency
- Provides quick MicroLearn actions

## Caching & Rate Limiting

- **Cache**: In-memory with 10-minute TTL
- **Rate Limiting**: 20 requests/minute per IP

## Error Handling

- Graceful fallback to demo data if API unavailable
- Toast notifications for success/error states
- Loading indicators during API calls
- Offline mode warning when API fails

## Testing

```bash
# Run backend tests
cd backend
npm test -- skillDNA

# Test endpoints manually
npm run dev  # Start backend on :3002
# Then use curl commands above
```

## Troubleshooting

1. **"OPENAI_API_KEY not configured"**
   - Ensure `OPENAI_API_KEY` is set in `backend/.env`
   - Restart backend server after adding key

2. **Skills not updating after MicroLearn**
   - Check browser console for errors
   - Verify profile is cached (check network tab)
   - Refresh page if needed

3. **Radial map not showing correct positions**
   - Ensure `profile.radialCoords` is populated
   - Check that skills have valid `proficiency` values
   - Verify clusters are computed correctly

4. **Pathway timeline empty**
   - Call `/api/skill-dna/simulate` with `action: "generatePathway"` first
   - Check that `months` parameter is valid (0-24)

