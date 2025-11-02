# 🚀 Deploy to Firebase Hosting NOW

## ✅ Project Ready!

Your project is configured and ready for Firebase deployment.

---

## Quick Deployment (3 Steps)

### Step 1: Build the Project

```bash
npm run build
```

This creates the `dist/` folder with production files.

### Step 2: Login to Firebase

```bash
npx firebase-tools login
```

This will open a browser for authentication.

### Step 3: Deploy

```bash
npx firebase-tools deploy --only hosting
```

**That's it!** Your app will be live at:
- `https://YOUR-PROJECT.web.app`
- `https://YOUR-PROJECT.firebaseapp.com`

---

## If You Need to Initialize First

If `firebase.json` doesn't exist or you need to set up a new project:

```bash
npx firebase-tools init hosting
```

**Answers:**
- Select Firebase project (or create new)
- Public directory: `dist`
- Single-page app: `Yes`
- Overwrite index.html: `No`

---

## Important: Set Backend URL

Before deploying, create `.env.production`:

```env
VITE_API_BASE_URL=https://your-backend.onrender.com
```

Then rebuild:
```bash
npm run build
```

This bakes the API URL into your build.

---

## Full Command Sequence

```bash
# 1. Set environment variable (create .env.production)
echo "VITE_API_BASE_URL=https://your-backend.onrender.com" > .env.production

# 2. Build
npm run build

# 3. Login (if first time)
npx firebase-tools login

# 4. Initialize (if first time)
npx firebase-tools init hosting

# 5. Deploy
npx firebase-tools deploy --only hosting
```

---

## After Deployment

1. ✅ Copy your Firebase URL
2. ✅ Test in browser
3. ✅ Verify API calls work
4. ✅ Update Render CORS with Firebase URL

---

**Status**: Ready to Deploy ✅  
**Next**: Run the commands above!

