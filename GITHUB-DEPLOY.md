# 🚀 GitHub + Vercel Deploy Instructions

## Step 1: Create GitHub Repository

Go to: https://github.com/new

**Settings:**
- Repository name: `curatedstack`
- Description: "A nostalgic Windows 95-inspired directory of curated apps"
- Public ✅
- **DO NOT** initialize with README (we already have one)

Click "Create repository"

## Step 2: Push to GitHub

GitHub will show you commands. Use these:

```bash
cd /Users/jarvis/.openclaw/workspace/app-directory

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/curatedstack.git

# Push
git branch -M main
git push -u origin main
```

**Alternative: Use SSH**
```bash
git remote add origin git@github.com:YOUR_USERNAME/curatedstack.git
git push -u origin main
```

## Step 3: Deploy to Vercel

1. Go to: https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `curatedstack` repo
4. Vercel will auto-detect settings (no config needed!)
5. Click "Deploy"

**That's it!** Vercel will:
- Build: None needed (static HTML)
- Deploy: Instant
- Give you a URL: `curatedstack.vercel.app`

## Step 4: Auto-Deploy Setup

✅ Already configured! Every `git push` will auto-deploy to Vercel.

## Custom Domain (Later)

1. Buy domain
2. Go to Vercel project → Settings → Domains
3. Add your domain
4. Update DNS records as shown
5. Done!

---

## Current Status

✅ Git repo initialized
✅ All files committed (5 commits)
✅ Windows 95 theme is default
⏳ Waiting for GitHub push
⏳ Waiting for Vercel deploy

**Next:** Create GitHub repo and follow Step 2!
