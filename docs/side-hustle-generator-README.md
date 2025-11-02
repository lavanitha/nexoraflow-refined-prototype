# Side Hustle Generator - Integration Guide

## Overview

The Side Hustle Generator is a lightweight, end-to-end feature that integrates AI-powered side-hustle idea generation into the existing SideHustleDiscoveryHub page. Users can input skills/interests via the search bar, apply filters, and click "Generate Ideas" to receive 3-5 personalized side-hustle recommendations powered by OpenAI. Each generated idea displays in the existing card grid, and clicking "Get Started" opens a modal showing actionable first steps. Ideas can be saved to localStorage for later reference.

## UI Element → Feature Responsibility Mapping

**Overview:** The Side Hustle Generator integrates with the existing SideHustleDiscoveryHub page UI. Each UI element has a specific responsibility for gathering inputs or triggering actions.

### UI Element Mapping

1. **Search Bar** (Updated: line ~376 in SideHustleDiscoveryHub.tsx)
   - **Selector:** `<input ref={searchInputRef} placeholder="Enter skills or interests..."/>`
   - **State:** `searchInput` state variable
   - **Responsibility:** Collects user skills/interests input
   - **Integration:** Value extracted on "Generate Ideas" click, passed as `skills` array (if comma-separated) or `interests` string

2. **Filters Panel** (Updated: lines ~427-491)
   - **Categories Checkboxes:**
     - **Selector:** `input[type="checkbox"]` inside Categories section
     - **State:** `selectedCategories` array
     - **Integration:** Extracted as `filters.category[]` array
   - **Difficulty Level Checkboxes:**
     - **Selector:** `input[type="checkbox"]` inside Difficulty Level section
     - **State:** `selectedSkillLevels` array
     - **Integration:** First selected value mapped to `filters.skillLevel`
   - **Time Commitment Checkboxes:**
     - **Selector:** `input[type="checkbox"]` inside Time Commitment section
     - **State:** `selectedTimeCommitments` array (single selection)
     - **Integration:** Parsed to numeric `hoursPerWeek` (e.g., "5-10 hours/week" → 7.5)

3. **Generate/Regenerate Button** (Added: line ~383-401)
   - **Selector:** `Button` with `onClick={handleGenerate}` or `onClick={handleRegenerate}`
   - **Responsibility:** Triggers `/api/sidehustle` API call with collected inputs
   - **Integration:** Gathers all inputs, calls `generateIdeas()` hook, updates `ideas` state

4. **Card Grid** (Updated: lines ~496-549)
   - **Selector:** `grid grid-cols-1 md:grid-cols-2` containing `filteredOpportunities.map()`
   - **Responsibility:** Displays generated ideas or fallback mock data
   - **Integration:** `displayOpportunities` computed from `ideas` or `mockOpportunities`, includes `_rawIdea` property for modal

5. **Card "Get Started" Button** (Updated: line ~540-545)
   - **Selector:** `Button variant="primary"` with `onClick={() => handleGetStarted(opportunity)}`
   - **Responsibility:** Opens `IdeaModal` showing that idea's `first_steps[]` array
   - **Integration:** Checks for `opportunity._rawIdea`, sets `selectedIdea` state, opens modal

6. **Card "View Details" Button** (Updated: line ~534-539)
   - **Selector:** `button.text-sm` with `onClick={() => handleGetStarted(opportunity)}`
   - **Responsibility:** Same as "Get Started" - opens modal with full idea details
   - **Integration:** Same handler as "Get Started" button

## Setup

### Environment Variables

Add to `backend/.env`:
```env
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### Running Locally

1. **Backend:**
   ```bash
   cd backend
   npm install  # mongodb already added
   npm run dev  # Server runs on port 3002
   ```

2. **Frontend:**
   ```bash
   npm run dev  # Frontend runs on port 5173
   ```

3. **Test Endpoint:**
   ```bash
   curl -X POST http://localhost:3002/api/sidehustle \
     -H "Content-Type: application/json" \
     -d '{
       "skills": ["JavaScript", "React"],
       "interests": "web development",
       "hoursPerWeek": 10
     }'
   ```

## Architecture

- **Backend:** `backend/routes/sideHustle.js` → `backend/controllers/sideHustleController.js`
- **Frontend:** `src/hooks/useSideHustle.js` → `src/components/SideHustleGenerator.tsx`
- **Modal:** `src/components/IdeaModal.tsx`
- **Validation:** Simple inline validation (no external schema library)

## Features

- ✅ AI-powered idea generation via OpenAI
- ✅ Defensive JSON parsing with fallback extraction
- ✅ Per-IP rate limiting (30 req/min)
- ✅ In-memory caching (2 min TTL)
- ✅ localStorage persistence for favorites
- ✅ Error handling with retry
- ✅ Modal with first steps display

