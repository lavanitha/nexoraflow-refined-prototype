# 🚀 Complete Deployment Guide - NexoraFlow Dashboard

## ✅ Status: Ready to Deploy

All deployment configurations have been created and pushed to GitHub.

**Repository**: https://github.com/lavanitha/nexoraflow-refined-prototype

---

## 📋 What's Been Configured

### 1. Frontend (Vercel) ✅
- ✅ `vercel.json` - Optimized for Vite
- ✅ `.vercelignore` - Excludes backend files
- ✅ Build output: `dist/`
- ✅ Framework: Vite (auto-detected)
- ✅ SPA routing configured

### 2. Backend (Render) ✅
- ✅ `render.yaml` - Service configuration
- ✅ `backend/render.yaml` - Alternative config
- ✅ CORS configured for Vercel domains
- ✅ PORT handling for Render
- ✅ Environment variables template

### 3. Optimizations ✅
- ✅ Production build optimizations
- ✅ Code splitting for React
- ✅ Sourcemaps disabled (smaller build)
- ✅ Terser minification

---

## 🚀 Step-by-Step Deployment

### PART 1: Backend on Render (2 minutes)

1. **Sign in to Render**: https://dashboard.render.com
2. **Create New Web Service**: Click "New +" → "Web Service"
3. **Connect GitHub**:
   - Repository: `lavanitha/nexoraflow-refined-prototype`
   - Branch: `main`
4. **Configure Service**:
   ```
   Name: nexoraflow-backend
   Environment: Node
   Region: (Choose closest)
   Branch: main
   Root Directory: backend
   Build Command: npm install
   Start Command: node server.js
   Plan: Free
   ```
5. **Set Environment Variables** (click "Advanced"):
   ```
   NODE_ENV=production
   PORT=10000
   OPENAI_API_KEY=sk-your-actual-key-here
   ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
   ```
   *(Add Vercel URL after Part 2)*

   **Optional (add if needed):**
   ```
   RAPIDAPI_KEY=your-key
   RAPIDAPI_HOST=baskarm28-adzuna-v1.p.rapidapi.com
   LLM_API_KEY=your-key
   LLM_API_PROVIDER=openai
   GEMINI_API_KEY=your-key
   PINECONE_API_KEY=your-key
   PINECONE_ENV=your-env
   PINECONE_INDEX=skill-dna
   MONGO_URI=your-mongo-uri
   ```
6. **Click "Create Web Service"**
7. **Wait for deployment** (2-5 minutes)
8. **Copy Backend URL**: `https://nexoraflow-backend.onrender.com` (or similar)
9. **Test Backend**:
   ```bash
   curl https://your-backend.onrender.com/api/health
   ```

### PART 2: Frontend on Vercel (2 minutes)

1. **Sign in to Vercel**: https://vercel.com/dashboard
2. **Add New Project**: Click "Add New..." → "Project"
3. **Import Git Repository**:
   - Repository: `lavanitha/nexoraflow-refined-prototype`
   - Framework Preset: **Vite** (should auto-detect)
4. **Configure Project**:
   ```
   Project Name: nexoraflow-dashboard
   Root Directory: ./
   Framework: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```
5. **Set Environment Variables**:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com
   ```
   *(Use the Render URL from Part 1)*
6. **Click "Deploy"**
7. **Wait for deployment** (1-3 minutes)
8. **Copy Frontend URL**: `https://nexoraflow-dashboard.vercel.app` (or similar)

### PART 3: Update CORS (1 minute)

1. **Go back to Render Dashboard**
2. **Select your backend service**
3. **Go to "Environment" tab**
4. **Find `ALLOWED_ORIGINS`**
5. **Update it**:
   ```
   https://your-vercel-app.vercel.app,https://your-vercel-app.vercel.app,http://localhost:5173
   ```
   *(Replace with your actual Vercel URL)*
6. **Click "Save Changes"**
7. **Render auto-redeploys** (wait 1-2 minutes)

### PART 4: Verify Everything Works

#### Test Backend:
```bash
# Health check
curl https://your-backend.onrender.com/api/health

# Test Side Hustle endpoint
curl -X POST https://your-backend.onrender.com/api/sidehustle \
  -H "Content-Type: application/json" \
  -d '{"skills":["JavaScript"],"hoursPerWeek":10}'

# Test Skill DNA
curl https://your-backend.onrender.com/api/skill-dna/profile
```

#### Test Frontend:
1. Open your Vercel URL in browser
2. Open browser DevTools (F12)
3. Go to **Console** tab - should be clean (no errors)
4. Go to **Network** tab
5. Navigate through the app
6. Check API calls are going to your Render backend
7. Test features:
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

---

## 🔧 Troubleshooting

### Vercel Errors

**Error: DEPLOYMENT_NOT_FOUND**
- ✅ **Fixed!** We've configured `vercel.json` correctly
- Ensure `outputDirectory: "dist"` matches Vite build output
- Verify build completes locally: `npm run build`

**Error: Build Failed**
- Check Vercel logs for specific error
- Verify all dependencies in `package.json`
- Test build locally first

**Blank Page After Deployment**
- Check browser console for errors
- Verify `VITE_API_BASE_URL` is set correctly
- Check Network tab for API call failures

### Render Errors

**Error: Build Failed**
- Check Render logs
- Verify `backend/package.json` has all dependencies
- Ensure `node server.js` works locally

**Error: CORS Issues**
- Update `ALLOWED_ORIGINS` with your Vercel URL
- Verify CORS includes both `http://` and `https://` if needed
- Check backend logs for CORS errors

**Error: Port Already in Use**
- Render automatically sets PORT - don't hardcode it
- Our code uses `process.env.PORT || 3002` ✅

### API Errors

**Error: Network Error**
- Verify `VITE_API_BASE_URL` is correct in Vercel
- Check backend is running (test `/api/health`)
- Verify CORS allows your Vercel domain

**Error: 500 Internal Server Error**
- Check Render logs for backend errors
- Verify API keys are set correctly
- Check environment variables in Render

---

## 📊 Deployment Checklist

### Pre-Deployment ✅
- [x] Code pushed to GitHub
- [x] `vercel.json` configured
- [x] `render.yaml` configured
- [x] CORS updated in backend
- [x] Environment variables documented

### Backend Deployment
- [ ] Render account created
- [ ] Service created
- [ ] Environment variables set
- [ ] Deployment successful
- [ ] Health endpoint tested
- [ ] API endpoints tested

### Frontend Deployment
- [ ] Vercel account created
- [ ] Project created
- [ ] Environment variables set
- [ ] Deployment successful
- [ ] Page loads correctly
- [ ] API calls work

### Post-Deployment
- [ ] CORS updated with Vercel URL
- [ ] Backend redeployed
- [ ] All features tested
- [ ] No console errors
- [ ] Performance acceptable

---

## 🔗 Your Deployment URLs

After deployment, you'll have:

- **Frontend**: `https://________________.vercel.app`
- **Backend**: `https://________________.onrender.com`

**Save these URLs** - you'll need them!

---

## 📝 Environment Variables Reference

### Backend (Render) - Required:
```
NODE_ENV=production
PORT=10000
OPENAI_API_KEY=sk-your-key
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

### Backend (Render) - Optional:
```
RAPIDAPI_KEY=your-key
RAPIDAPI_HOST=baskarm28-adzuna-v1.p.rapidapi.com
LLM_API_KEY=your-key
LLM_API_PROVIDER=openai
GEMINI_API_KEY=your-key
PINECONE_API_KEY=your-key
PINECONE_ENV=your-env
PINECONE_INDEX=skill-dna
MONGO_URI=your-mongo-uri
```

### Frontend (Vercel) - Required:
```
VITE_API_BASE_URL=https://your-backend.onrender.com
NODE_ENV=production
```

---

## 🎯 Quick Commands

### Test Backend Locally:
```bash
cd backend
npm install
npm run dev
# Test: curl http://localhost:3002/api/health
```

### Test Frontend Locally:
```bash
npm install
npm run build
npm run preview
# Open: http://localhost:4173
```

### Build for Production:
```bash
npm run build
# Output: dist/
```

---

## 📚 Documentation Files

All documentation is in the repository:

1. **QUICK-DEPLOY.md** - 5-minute quick start
2. **DEPLOYMENT.md** - Complete detailed guide
3. **VERCEL-ERROR-FIX.md** - Error troubleshooting
4. **DEPLOYMENT-CHECKLIST.md** - Step-by-step checklist
5. **DEPLOYMENT-SUMMARY.md** - Configuration summary

---

## ✨ Features Ready for Production

All 10 features are production-ready and will work once deployed:

1. ✅ Side Hustle Generator (requires OPENAI_API_KEY)
2. ✅ Skill DNA Mapping (requires OPENAI_API_KEY)
3. ✅ Industry Trend Feed (works with/without RAPIDAPI_KEY)
4. ✅ Career Twin Simulation (requires LLM_API_KEY)
5. ✅ Predictive Career Evolution (requires OPENAI_API_KEY)
6. ✅ AI Resilience Coach (requires OPENAI_API_KEY)
7. ✅ Achievement Center (no API keys needed)
8. ✅ Learning Pathways (requires OPENAI_API_KEY)
9. ✅ Community Nexus (works with/without RAPIDAPI_KEY)
10. ✅ Skill Blockchain Passport (no API keys needed)

---

## 🎉 You're Ready!

Everything is configured and ready to deploy. Follow the steps above, and your NexoraFlow dashboard will be live in about 5 minutes!

**Need Help?** Check the documentation files or deployment logs in Vercel/Render dashboards.

**Good Luck! 🚀**

