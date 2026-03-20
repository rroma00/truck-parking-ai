# Deployment Guide

The platform is deployed across two separate cloud providers to optimize for the distinct needs of static frontend files vs dynamic backend servers.

- **Backend Location**: Railway (`https://truck-parking-ai-production.up.railway.app`)
- **Frontend Location**: Vercel (`https://truck-parking-ai.vercel.app`)

---

## 🚀 Backend Deployment (Railway)

The backend is deployed to **Railway** because it provides an excellent environment for running continuous Node.js processes.

### How it works:
1. Railway links directly to the GitHub repository.
2. It detects the root `package.json` and runs `npm install`.
3. It uses `npm start` (or runs `node server.js` directly) to spin up the Express server.
4. The service is perpetually kept alive.

### Environment Variables:
Ensure you have the required Database (Supabase) keys set in the Railway project settings under the **Variables** tab so `server.js` can connect to your data.

---

## 🚀 Frontend Deployment (Vercel)

The frontend is deployed to **Vercel** because Vercel provides a globally distributed CDN that serves static Vite/React apps at incredibly high speeds.

### Configuration Rules:
Because the project repository contains *both* the frontend and the backend, Vercel must be explicitly told to only look at the frontend folder.

1. **Root Directory**: In Vercel Project Settings, the `Root Directory` must be set to `dashboard`.
2. **Framework Preset**: In Vercel Project Settings -> Build & Development, the `Framework Preset` must be strictly set to **Vite**. Vercel will automatically configure the build command (`npm run build`) and output directory (`dist`).

### Connecting to the Backend:
The frontend must securely know where the live backend is. 
You must configure the Vercel **Environment Variables**:
- **Key**: `VITE_API_BASE_URL`
- **Value**: `https://truck-parking-ai-production.up.railway.app`

*(Note: Because Vercel builds the project remotely from GitHub, local `.env` files are correctly ignored, making this step mandatory.)*

### Manual Redeployments:
If you ever change Vercel configurations (like adding environment variables or changing the framework preset), those settings apply only to *new* builds. You must generate a new commit or click **Redeploy** on Vercel to see the changes take effect.
