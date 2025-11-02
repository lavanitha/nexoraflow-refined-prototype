# Quick Deployment Guide

## 🚀 Fast Track (5 Minutes)

### 1. Backend on Render (2 minutes)

1. Go to: https://dashboard.render.com/web/new
2. Connect: `lavanitha/nexoraflow-refined-prototype`
3. Settings:
   - **Name**: `nexoraflow-backend`
   - **Root Directory**: `backend`
   - **Build**: `npm install`
   - **Start**: `node server.js`
4. Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   OPENAI_API_KEY=sk-your-key
   ```
5. Deploy → Copy URL: `https://xxx.onrender.com`

### 2. Frontend on Vercel (2 minutes)

1. Go to: https://vercel.com/new
2. Import: `lavanitha/nexoraflow-refined-prototype`
3. Framework: **Vite** (auto)
4. Environment Variables:
   ```
   VITE_API_BASE_URL=https://xxx.onrender.com
   ```
   (Use your Render URL from step 1)
5. Deploy → Copy URL: `https://xxx.vercel.app`

### 3. Update CORS (1 minute)

1. Go to Render → Environment
2. Add to `ALLOWED_ORIGINS`:
   ```
   https://your-vercel-url.vercel.app
   ```
3. Save → Auto redeploys

## ✅ Done!

Your app is live at: `https://xxx.vercel.app`

## 🧪 Test

```bash
# Backend
curl https://xxx.onrender.com/api/health

# Frontend (open in browser)
https://xxx.vercel.app
```

## 📝 Required API Keys

**Minimum to work:**
- `OPENAI_API_KEY` (required for most features)

**Optional (for specific features):**
- `RAPIDAPI_KEY` (Industry Trend Feed)
- `LLM_API_KEY` (Career Twin)
- `PINECONE_API_KEY` (Skill DNA embeddings)

## 🔗 Full Guide

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

