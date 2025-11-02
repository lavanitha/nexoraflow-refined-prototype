# ✅ Vercel Deployment Checklist (After DNS Fix)

## 🎯 Before Deploying to Vercel

### 1. ✅ Code Fixes Applied
- [x] All API helpers updated (no localhost in production)
- [x] Environment-aware fallbacks implemented
- [x] Code pushed to GitHub

### 2. Deploy Backend First (Render)

**Set Environment Variables:**
- [ ] `NODE_ENV=production`
- [ ] `PORT=10000`
- [ ] `OPENAI_API_KEY=sk-your-key`
- [ ] `ALLOWED_ORIGINS=https://your-vercel-app.vercel.app` (add after frontend deploy)

**After Deployment:**
- [ ] Backend URL obtained: `https://xxx.onrender.com`
- [ ] Tested: `curl https://xxx.onrender.com/api/health`
- [ ] Backend is live and responding

### 3. Deploy Frontend (Vercel)

**CRITICAL - Set This Environment Variable:**
- [ ] `VITE_API_BASE_URL=https://your-backend.onrender.com`
  - Replace `your-backend.onrender.com` with actual Render URL
  - Must start with `https://`
  - Must NOT be localhost

**Settings:**
- [ ] Framework: Vite (auto-detected)
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Root Directory: `.` (root)

**After Deployment:**
- [ ] Frontend URL obtained: `https://xxx.vercel.app`
- [ ] Page loads without errors
- [ ] No DNS errors in logs

### 4. Update Backend CORS

**In Render Dashboard:**
- [ ] Go to Environment tab
- [ ] Update `ALLOWED_ORIGINS`:
  ```
  https://your-vercel-app.vercel.app,https://your-vercel-app.vercel.app,http://localhost:5173
  ```
- [ ] Save changes (auto-redeploys)

### 5. Verify Everything Works

**Test Frontend:**
- [ ] Open Vercel URL in browser
- [ ] No console errors
- [ ] API calls succeed (check Network tab)
- [ ] All 10 features work:
  - [ ] Side Hustle Generator
  - [ ] Skill DNA Mapping
  - [ ] Industry Trend Feed
  - [ ] Career Twin Simulation
  - [ ] Predictive Career Evolution
  - [ ] AI Resilience Coach
  - [ ] Achievement Center
  - [ ] Learning Pathways
  - [ ] Community Nexus
  - [ ] Skill Blockchain Passport

---

## ⚠️ Common Mistakes to Avoid

### ❌ Don't:
- Set `VITE_API_BASE_URL` to localhost in Vercel
- Forget to set the environment variable
- Use `http://` instead of `https://`
- Deploy frontend before backend

### ✅ Do:
- Set `VITE_API_BASE_URL` to your Render backend URL
- Use `https://` URLs only
- Deploy backend first, then frontend
- Update CORS after getting Vercel URL

---

## 🔧 If You Still Get DNS Error

1. **Check Vercel Environment Variables:**
   - Go to Project → Settings → Environment Variables
   - Verify `VITE_API_BASE_URL` is set
   - Verify it's NOT localhost
   - Verify it starts with `https://`

2. **Check Build Logs:**
   - Vercel Dashboard → Deployments → View Build Logs
   - Look for DNS-related errors
   - Verify no localhost references

3. **Verify Code Changes:**
   - Check all `src/api/*.js` files
   - Should use: `(import.meta.env.DEV ? 'http://localhost:3002' : '')`
   - Should NOT use: `'http://localhost:3002'` as direct fallback

---

## 📝 Final Checklist

- [x] Code fixed (localhost removed from production)
- [ ] Backend deployed on Render
- [ ] Backend URL obtained
- [ ] `VITE_API_BASE_URL` set in Vercel
- [ ] Frontend deployed on Vercel
- [ ] Frontend URL obtained
- [ ] CORS updated in Render
- [ ] All features tested and working

---

**Status**: Ready for Deployment ✅  
**Next**: Deploy backend, then frontend, set env vars!

