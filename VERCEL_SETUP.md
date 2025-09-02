# Vercel Setup Instructions

## ✅ Code Changes Completed
- Backend URL updated from Railway to Render
- All files committed and pushed to GitHub
- Backend connection tested and working

## 🔧 Remaining Steps for Vercel

### Step 1: Update Environment Variable in Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `notice-board-frontend` project
3. Click on **Settings** tab
4. Click on **Environment Variables** in the left sidebar
5. Find `VITE_API_URL` variable
6. Click **Edit** (pencil icon)
7. Change the value to: `https://notice-board-backend-7z2k.onrender.com`
8. Click **Save**

### Step 2: Redeploy Frontend
1. In the same Vercel project dashboard
2. Click on **Deployments** tab
3. Click **Redeploy** on your latest deployment
4. Wait for deployment to complete (usually 1-2 minutes)

### Step 3: Test the Application
1. Visit your deployed frontend URL
2. Test login functionality
3. Test adding notices
4. Test editing notices
5. Test location check

## 🌐 Current URLs
- **Frontend**: Your Vercel URL
- **Backend**: `https://notice-board-backend-7z2k.onrender.com`
- **GitHub**: Your repository

## 📝 What Was Changed
- `src/api.js` - Backend URL updated
- `README.md` - Environment variable example updated
- `deploy.md` - Deployment instructions updated

## 🚀 After Vercel Update
Your frontend will automatically connect to the new Render backend instead of the old Railway deployment.
