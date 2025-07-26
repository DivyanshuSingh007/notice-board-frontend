# Deployment Instructions

## Prerequisites
1. Install Node.js from https://nodejs.org/
2. Get your Railway backend URL

## Step 1: Update Backend URL
Replace `your-railway-backend-url.railway.app` in `src/api.js` with your actual Railway URL.

## Step 2: Install Dependencies
```bash
npm install
```

## Step 3: Build the Project
```bash
npm run build
```

## Step 4: Deploy to Your Preferred Platform

### Option A: Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Add your custom domain in Vercel dashboard

### Option B: Netlify
1. Go to https://netlify.com
2. Drag and drop the `dist` folder
3. Add your custom domain

### Option C: GitHub Pages
1. Push code to GitHub
2. Enable GitHub Pages in repository settings
3. Set source to GitHub Actions

### Option D: Manual Upload
1. Upload `dist` folder contents to your web server
2. Configure your domain to point to the server

## Environment Variables
Set `VITE_API_URL` to your Railway backend URL in your hosting platform's environment variables. 