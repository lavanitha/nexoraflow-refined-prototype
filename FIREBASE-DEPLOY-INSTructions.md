# Firebase Hosting Deployment - Step-by-Step Instructions

## ✅ Project Ready for Firebase

The project is configured for Firebase Hosting deployment.

---

## 📋 Deployment Steps

### Step 1: Install Firebase CLI (if needed)

```bash
npm install -g firebase-tools
```

Or use npx (no installation needed):
```bash
npx firebase-tools --version
```

### Step 2: Login to Firebase

```bash
firebase login
```

This will:
1. Open a browser window
2. Ask you to authenticate with Google
3. Grant Firebase CLI access

**Alternative (non-interactive):**
```bash
firebase login --no-localhost
```

### Step 3: Initialize Firebase (Already Configured)

The project already has `firebase.json` configured with:
- **Public Directory**: `dist`
- **SPA Routing**: Enabled (all routes → `/index.html`)
- **Caching**: Optimized headers

If you need to initialize manually:
```bash
firebase init hosting
```

**Answers:**
- Which Firebase features? → **Hosting**
- Use existing project or create new? → **Select/create project**
- Public directory? → **dist**
- Configure as single-page app? → **Yes**
- Set up automatic builds? → **No** (or Yes if using GitHub)

### Step 4: Build the Project

```bash
npm run build
```

This creates the `dist/` folder with production-ready files.

**Verify build:**
```bash
# Windows PowerShell
Test-Path dist\index.html

# Or check manually
ls dist
```

### Step 5: Deploy to Firebase

```bash
firebase deploy --only hosting
```

Or deploy everything:
```bash
firebase deploy
```

### Step 6: Get Your Live URL

After deployment, Firebase will show:
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/YOUR-PROJECT/overview
Hosting URL: https://YOUR-PROJECT.web.app
Hosting URL: https://YOUR-PROJECT.firebaseapp.com
```

**Your app is live at:**
- `https://YOUR-PROJECT.web.app` ✅
- `https://YOUR-PROJECT.firebaseapp.com` ✅

---

## 🔧 Configuration Files

### `firebase.json` (Already Created)
```json
{
  "hosting": {
    "public": "dist",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### `.firebaserc` (Created during init)
```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

---

## ⚙️ Environment Variables

### Important: Set `VITE_API_BASE_URL`

Firebase Hosting doesn't support environment variables directly. Use one of these options:

### Option 1: Build-time Environment Variable (Recommended)

Create `.env.production`:
```env
VITE_API_BASE_URL=https://your-backend.onrender.com
```

Then build:
```bash
npm run build
```

The environment variable is baked into the build.

### Option 2: Runtime Configuration

Create `public/config.js`:
```javascript
window.__APP_CONFIG__ = {
  API_BASE_URL: 'https://your-backend.onrender.com'
};
```

Include in `index.html`:
```html
<script src="/config.js"></script>
```

---

## 🔄 Re-deploying After Changes

After code changes:

```bash
# 1. Build
npm run build

# 2. Deploy
firebase deploy --only hosting
```

---

## 📊 Deployment Checklist

- [ ] Firebase CLI installed
- [ ] Logged in to Firebase (`firebase login`)
- [ ] Project initialized (`firebase.json` exists)
- [ ] Build succeeds (`npm run build`)
- [ ] `dist/` folder created with files
- [ ] `VITE_API_BASE_URL` set (for backend connection)
- [ ] Deployed (`firebase deploy`)
- [ ] Live URL obtained and tested

---

## 🚨 Troubleshooting

### Firebase CLI Not Found

**Windows:**
```bash
# Use npx instead
npx firebase-tools login
npx firebase-tools deploy --only hosting
```

### Build Fails

Check TypeScript errors:
```bash
npm run build
```

Fix any TypeScript errors before deploying.

### Deployment Fails

1. Check you're logged in: `firebase projects:list`
2. Verify project exists: Firebase Console
3. Check `firebase.json` is valid
4. Ensure `dist/` folder exists

### 404 Errors on Routes

Ensure `firebase.json` has SPA rewrite:
```json
{
  "hosting": {
    "rewrites": [
      { "source": "**", "destination": "/index.html" }
    ]
  }
}
```

---

## ✅ After Deployment

1. **Test your live URL** - Open in browser
2. **Check browser console** - No errors
3. **Test API calls** - Verify backend connection
4. **Test all features** - Ensure everything works

---

**Repository**: https://github.com/lavanitha/nexoraflow-refined-prototype  
**Status**: Ready for Firebase Deployment ✅

