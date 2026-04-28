# ============================================================
# IndiaIntern.ai — Railway Backend Environment Variables
# ============================================================
# Copy these variables into Railway:
#   Dashboard → Your Project → Variables tab → Add Variable
# ============================================================

# ─── REQUIRED: Google Gemini AI Key ────────────────────────
# Get from: https://aistudio.google.com/app/apikey
GOOGLE_GENAI_API_KEY=your_gemini_api_key_here

# ─── REQUIRED: Server Port ─────────────────────────────────
# Railway sets PORT automatically — keep this as default
PORT=3001

# ─── OPTIONAL: CORS Origin ─────────────────────────────────
# Your GitHub Pages frontend URL (no trailing slash)
CORS_ORIGIN=https://neel-develops.github.io

# ============================================================
# GitHub Secrets — Set these in:
#   GitHub Repo → Settings → Secrets and Variables → Actions
# ============================================================
# These are used by the GitHub Actions workflow to build
# the frontend. Firebase credentials are already hardcoded
# as fallbacks in src/lib/firebase.ts but for security you
# should set them as secrets too.
#
# Secret Name                   Value
# ---------------------------   --------------------------------
# VITE_FIREBASE_API_KEY         AIzaSyAqLA4cVKh6JFuYeSmiQgP5ffmLWip51dU
# VITE_FIREBASE_AUTH_DOMAIN     india-intern-final.firebaseapp.com
# VITE_FIREBASE_PROJECT_ID      india-intern-final
# VITE_FIREBASE_STORAGE_BUCKET  india-intern-final.firebasestorage.app
# VITE_FIREBASE_MESSAGING_SENDER_ID  1087150914586
# VITE_FIREBASE_APP_ID          1:1087150914586:web:882254659e0652c78765a3
# VITE_API_URL                  https://your-railway-app.up.railway.app/api
#
# ============================================================
# Firebase Console — REQUIRED for Google Sign-In to work
# ============================================================
# 1. Go to: https://console.firebase.google.com/project/india-intern-final
# 2. Authentication → Sign-in method → Google → Enable
# 3. Authentication → Settings → Authorized domains → Add:
#      neel-develops.github.io
#      localhost
# 4. This allows the Google OAuth popup to work on GitHub Pages
# ============================================================
