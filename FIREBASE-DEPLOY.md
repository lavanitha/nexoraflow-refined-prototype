# Firebase Hosting Deployment Guide

## 🚀 Quick Deploy to Firebase

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

This will open a browser window for authentication.

### Step 3: Initialize Firebase (Already Configured)

The project already has `firebase.json` configured:
- **Public Directory**: `dist`
- **SPA Routing**: Enabled (all routes → index.html)
- **Caching**: Optimized for static assets

If you need to initialize manually:
```bash
firebase init hosting
```

**Answers:**
- Public directory: `dist`
- Single-page app: `Yes`
- Overwrite index.html: `No`

### Step 4: Build the Project

```bash
npm run build
```

This creates the `dist/` folder with production-ready files.

### Step 5: Deploy

```bash
firebase deploy --only hosting
```

Or deploy everything:
```bash
firebase deploy
```

### Step 6: Get Your URL

After deployment, Firebase will show:
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/your-project/overview
Hosting URL: https://your-project.web.app
```

---

## 📝 Environment Variables

**Important**: Set environment variables in Firebase:

1. Go to: Firebase Console → Project Settings → Hosting → Environment Variables
2. Add:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com
   ```

Or use `.env.production` file (recommended):
```env
VITE_API_BASE_URL=https://your-backend.onrender.com
```

---

## ✅ After Deployment

Your app will be live at:
- `https://your-project.web.app`
- `https://your-project.firebaseapp.com`

---

## 🔄 Re-deploying

After code changes:

```bash
npm run build
firebase deploy --only hosting
```

---

**Note**: Make sure `VITE_API_BASE_URL` is set to your Render backend URL!

