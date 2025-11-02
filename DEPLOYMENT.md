# Deployment Guide - NexoraFlow Dashboard

Complete guide for deploying NexoraFlow to Vercel (Frontend) and Render (Backend).

## 📋 Prerequisites

- GitHub account with repository access
- Vercel account (free tier)
- Render account (free tier)
- API keys ready:
  - `OPENAI_API_KEY` (required)
  - `RAPIDAPI_KEY` (optional, for job trends)
  - Other API keys as needed

## 🚀 Deployment Steps

### Step 1: Deploy Backend to Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**:
   - Repository: `lavanitha/nexoraflow-refined-prototype`
   - Branch: `main`
4. **Configure the service**:
   - **Name**: `nexoraflow-backend`
   - **Environment**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. **Set Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   ALLOWED_ORIGINS=https://your-vercel-app.vercel.app,https://your-vercel-app.vercel.app
   OPENAI_API_KEY=sk-your-key
   RAPIDAPI_KEY=your-rapidapi-key (optional)
   RAPIDAPI_HOST=baskarm28-adzuna-v1.p.rapidapi.com (optional)
   LLM_API_KEY=your-key (optional)
   LLM_API_PROVIDER=openai (optional)
   GEMINI_API_KEY=your-key (optional)
   PINECONE_API_KEY=your-key (optional)
   PINECONE_ENV=your-env (optional)
   PINECONE_INDEX=skill-dna (optional)
   MONGO_URI=your-mongo-uri (optional)
   ```
6. **Plan**: Select "Free" tier
7. **Click "Create Web Service"**
8. **Wait for deployment** (2-5 minutes)
9. **Copy your Render URL**: `https://nexoraflow-backend.onrender.com` (or similar)

### Step 2: Deploy Frontend to Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click "Add New..." → "Project"**
3. **Import Git Repository**:
   - Repository: `lavanitha/nexoraflow-refined-prototype`
   - Framework Preset: **Vite** (auto-detected)
4. **Configure Project**:
   - **Project Name**: `nexoraflow-dashboard` (or your choice)
   - **Root Directory**: `.` (root)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `dist` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)
5. **Set Environment Variables**:
   ```
   VITE_API_BASE_URL=https://your-render-backend-url.onrender.com
   NODE_ENV=production
   ```
   **Important**: Replace `your-render-backend-url.onrender.com` with your actual Render backend URL from Step 1.
6. **Click "Deploy"**
7. **Wait for deployment** (1-3 minutes)
8. **Copy your Vercel URL**: `https://nexoraflow-dashboard.vercel.app` (or similar)

### Step 3: Update Backend CORS (Important!)

After getting your Vercel URL:

1. **Go back to Render Dashboard**
2. **Select your backend service**
3. **Go to "Environment" tab**
4. **Update `ALLOWED_ORIGINS`**:
   ```
   ALLOWED_ORIGINS=https://your-vercel-url.vercel.app,https://your-vercel-url.vercel.app,http://localhost:5173
   ```
   Replace `your-vercel-url.vercel.app` with your actual Vercel domain.
5. **Click "Save Changes"**
6. **Wait for redeploy** (Render auto-redeploys on env var changes)

### Step 4: Verify Deployment

#### Test Backend (Render)

```bash
# Health check
curl https://your-render-backend.onrender.com/api/health

# Test endpoint
curl https://your-render-backend.onrender.com/api/sidehustle \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"skills":["JavaScript"],"hoursPerWeek":10}'
```

#### Test Frontend (Vercel)

1. Open your Vercel URL in browser
2. Navigate to different features
3. Check browser console for API calls
4. Verify features work:
   - Side Hustle Generator
   - Skill DNA Mapping
   - Industry Trend Feed
   - Career Twin Simulation
   - Predictive Career Evolution
   - AI Resilience Coach
   - Achievement Center
   - Learning Pathways
   - Community Nexus
   - Skill Blockchain Passport

## 🔧 Troubleshooting

### Backend Issues

**Problem**: CORS errors in browser console
- **Solution**: Update `ALLOWED_ORIGINS` in Render to include your Vercel domain

**Problem**: API returns 500 errors
- **Solution**: Check Render logs for missing API keys or errors
- Verify all required env vars are set

**Problem**: "Module not found" errors
- **Solution**: Ensure `package.json` has all dependencies listed

### Frontend Issues

**Problem**: API calls failing with "Network Error"
- **Solution**: Verify `VITE_API_BASE_URL` is set correctly in Vercel
- Check browser console for exact error

**Problem**: Build fails on Vercel
- **Solution**: Check build logs for TypeScript errors
- Verify `package.json` scripts are correct

**Problem**: Blank page after deployment
- **Solution**: Check Vercel logs
- Verify `dist` directory is being generated
- Check if `index.html` exists in dist

## 📝 Environment Variables Checklist

### Backend (Render) Required:
- [x] `NODE_ENV=production`
- [x] `PORT=10000`
- [x] `ALLOWED_ORIGINS` (add Vercel URL after deployment)
- [x] `OPENAI_API_KEY` (required for most features)

### Backend (Render) Optional:
- [ ] `RAPIDAPI_KEY` (for Industry Trend Feed)
- [ ] `LLM_API_KEY` (for Career Twin)
- [ ] `PINECONE_API_KEY` (for Skill DNA embeddings)
- [ ] `MONGO_URI` (for persistent storage)

### Frontend (Vercel) Required:
- [x] `VITE_API_BASE_URL` (Render backend URL)
- [x] `NODE_ENV=production`

## 🔗 URLs After Deployment

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`

## 📊 Monitoring

### Render Monitoring:
- View logs: Render Dashboard → Your Service → Logs
- Monitor uptime: Render Dashboard → Your Service → Metrics

### Vercel Monitoring:
- View logs: Vercel Dashboard → Your Project → Deployments → View Function Logs
- Monitor performance: Vercel Dashboard → Analytics

## 🎯 Next Steps

1. Set up custom domains (optional)
2. Configure automatic deployments on git push
3. Set up monitoring alerts
4. Configure CDN caching (Vercel does this automatically)

## 🔐 Security Notes

- Never commit `.env` files
- Use Render/Vercel environment variables for secrets
- Enable CORS only for your frontend domain
- Use HTTPS (enabled by default on Vercel and Render)

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [NexoraFlow GitHub Repo](https://github.com/lavanitha/nexoraflow-refined-prototype)

---

**Deployment Status**: ✅ Ready
**Last Updated**: 2025-02-02

