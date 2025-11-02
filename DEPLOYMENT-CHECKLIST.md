# Deployment Checklist

Use this checklist to ensure successful deployment.

## ✅ Pre-Deployment

- [ ] All code committed and pushed to GitHub
- [ ] Repository accessible: https://github.com/lavanitha/nexoraflow-refined-prototype
- [ ] API keys ready (OpenAI, RapidAPI, etc.)
- [ ] Backend `.env` variables documented
- [ ] Frontend environment variables documented

## ✅ Backend Deployment (Render)

- [ ] Created Render account
- [ ] Connected GitHub repository
- [ ] Set Root Directory: `backend`
- [ ] Set Build Command: `npm install`
- [ ] Set Start Command: `node server.js`
- [ ] Set Environment Variables:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=10000`
  - [ ] `OPENAI_API_KEY` (required)
  - [ ] `RAPIDAPI_KEY` (optional)
  - [ ] Other optional keys
- [ ] Selected "Free" plan
- [ ] Deployment started
- [ ] Deployment successful
- [ ] Backend URL obtained: `https://xxx.onrender.com`
- [ ] Tested `/api/health` endpoint
- [ ] Tested `/api/sidehustle` endpoint

## ✅ Frontend Deployment (Vercel)

- [ ] Created Vercel account
- [ ] Connected GitHub repository
- [ ] Framework detected: Vite
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Set Environment Variables:
  - [ ] `VITE_API_BASE_URL` = Render backend URL
  - [ ] `NODE_ENV=production`
- [ ] Deployment started
- [ ] Deployment successful
- [ ] Frontend URL obtained: `https://xxx.vercel.app`

## ✅ Post-Deployment Configuration

- [ ] Updated `ALLOWED_ORIGINS` in Render with Vercel URL
- [ ] Render redeployed after CORS update
- [ ] Verified CORS works (no errors in browser console)

## ✅ Testing

### Backend Tests:
- [ ] `GET /api/health` returns 200
- [ ] `POST /api/sidehustle` returns valid JSON
- [ ] `GET /api/skill-dna/profile` returns valid JSON
- [ ] `GET /api/trend-feed/trends` returns valid JSON
- [ ] All endpoints return proper CORS headers

### Frontend Tests:
- [ ] Page loads without errors
- [ ] No console errors
- [ ] API calls succeed
- [ ] Side Hustle Generator works
- [ ] Skill DNA Mapping works
- [ ] Industry Trend Feed works
- [ ] Career Twin Simulation works
- [ ] Predictive Career Evolution works
- [ ] AI Resilience Coach works
- [ ] Achievement Center works
- [ ] Learning Pathways works
- [ ] Community Nexus works
- [ ] Skill Blockchain Passport works

## ✅ Final Verification

- [ ] Both URLs are live and accessible
- [ ] Frontend connects to backend successfully
- [ ] All 10 features functional
- [ ] No security warnings
- [ ] Performance acceptable
- [ ] Documentation updated with live URLs

## 📝 Deployment Information

**Frontend URL**: `https://________________.vercel.app`
**Backend URL**: `https://________________.onrender.com`
**Deployment Date**: `________________`
**Deployed By**: `________________`

---

## 🔄 Quick Re-deployment

If you need to redeploy:

1. **Frontend (Vercel)**: Push to GitHub → Auto-deploys
2. **Backend (Render)**: Push to GitHub → Auto-deploys (or manual trigger)
3. **After code changes**: Both platforms auto-detect and redeploy

## 🆘 Troubleshooting

If deployment fails:
1. Check build logs in Vercel/Render dashboard
2. Verify environment variables are set
3. Test locally first: `npm run build`
4. Check GitHub repository is accessible
5. Verify API keys are valid
