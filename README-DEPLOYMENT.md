# 🚀 Quick Deployment Summary

## Deploy in 5 Minutes

### Backend → Render.com

1. Visit: https://dashboard.render.com/web/new
2. Connect repo: `lavanitha/nexoraflow-refined-prototype`
3. Settings:
   - **Name**: `nexoraflow-backend`
   - **Root Directory**: `backend`
   - **Build**: `npm install`
   - **Start**: `node server.js`
   - **Plan**: Free
4. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   OPENAI_API_KEY=sk-your-key-here
   ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
   ```
5. Deploy → Copy URL

### Frontend → Vercel.com

1. Visit: https://vercel.com/new
2. Import repo: `lavanitha/nexoraflow-refined-prototype`
3. Settings:
   - Framework: **Vite** (auto-detected)
   - Build: `npm run build`
   - Output: `dist`
4. Add Environment Variables:
   ```
   VITE_API_BASE_URL=https://your-render-backend.onrender.com
   ```
5. Deploy → Copy URL

### Update CORS

1. Back in Render → Environment
2. Update `ALLOWED_ORIGINS` with your Vercel URL
3. Save → Auto redeploys

## ✅ Done!

Your app is live with all 10 features working!

---

**Full Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
**Quick Checklist**: See [DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md)

