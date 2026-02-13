#!/bin/bash
# CuratedStack Deploy Script

echo "🪟 CuratedStack Deploy"
echo "======================"
echo ""

# Check if git remote exists
if git remote get-url origin >/dev/null 2>&1; then
    echo "✅ Git remote configured"
    git remote -v
else
    echo "❌ No git remote found!"
    echo ""
    echo "Please add GitHub remote first:"
    echo "  git remote add origin https://github.com/YOUR_USERNAME/curatedstack.git"
    exit 1
fi

echo ""
echo "📦 Checking for uncommitted changes..."
if [[ -n $(git status -s) ]]; then
    echo "Found uncommitted changes. Committing..."
    git add -A
    git commit -m "Deploy update $(date +%Y-%m-%d)"
fi

echo ""
echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Deploy complete!"
echo ""
echo "Next steps:"
echo "1. Go to https://vercel.com/new"
echo "2. Import your GitHub repo (curatedstack)"
echo "3. Click Deploy"
echo ""
echo "Vercel will auto-deploy on every push!"
