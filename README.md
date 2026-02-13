# 🪟 CuratedStack

> A nostalgic Windows 95-inspired directory of hand-picked apps and tools

[![Windows 95](https://img.shields.io/badge/Windows-95-008080?style=flat&logo=windows95)](https://github.com/yourusername/curatedstack)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat&logo=vercel)](https://vercel.com)

## ✨ Features

### 🎨 Windows 95 Retro UI
- **98.css Framework** - Authentic Windows 95 CSS
- **3D Beveled Borders** - Raised/sunken effects on all elements
- **Teal Desktop Background** - Classic Windows 95 aesthetic
- **Title Bars** - Blue gradient with window controls
- **Taskbar** - Start button + working clock
- **Retro Scrollbars** - Windows 95 style with arrows

### ⭐ Featured Apps
Featured apps get **triple highlight**:
- 🟡 Yellow glowing border (pulses)
- 🌈 Rainbow animated title bar
- 🎯 "⭐ FEATURED ⭐" bouncing badge

### 🔊 Sound Effects
- **Click** - Retro beep on all button clicks
- **Tada** - Success sound on upvote/rating
- All sounds embedded (no external files)

### 👍 Community Features
- **Upvote System** - Vote for your favorites
- **Star Ratings** - Rate apps 1-5 stars
- **Smart Search** - Filter by name, category, tags
- **Stats Dashboard** - Total apps, upvotes, avg rating

## 🚀 Quick Start

### View Locally
```bash
# Just open the HTML file!
open index.html
```

No build step, no npm install, no dependencies. Pure HTML + CSS + JS.

### Deploy to Vercel

1. **Push to GitHub**
```bash
# Create repo at github.com/new
git remote add origin https://github.com/YOUR_USERNAME/curatedstack.git
git push -u origin main
```

2. **Import to Vercel**
- Go to https://vercel.com/new
- Import your GitHub repo
- Click Deploy
- Done! ✅

## 🗄️ Database Setup

Uses Supabase (PostgreSQL):

1. Create project at [supabase.com](https://supabase.com)
2. Run SQL from `supabase-schema.sql`
3. Update credentials in `index.html`:
```javascript
const SUPABASE_URL = 'your-project-url'
const SUPABASE_KEY = 'your-anon-key'
```

## ⭐ Mark Apps as Featured

In Supabase Table Editor:
```sql
UPDATE apps SET featured = true WHERE name = 'Your App Name';
```

Refresh page to see the yellow glow + rainbow title bar!

## 📁 Project Structure

```
curatedstack/
├── index.html              # Main app (Windows 95 UI)
├── logo.svg                # CuratedStack logo
├── win95-theme.css         # Complete Windows 95 theme
├── win95-sounds.js         # Sound effects module
├── supabase-schema.sql     # Database schema
├── fetch-favicons.js       # Auto-fetch app logos
├── import-from-airtable.js # Import apps from Airtable
└── README.md               # You are here
```

## 🎨 Customization

### Change Colors
Edit `win95-theme.css`:
```css
:root {
  --win95-desktop: #008080;  /* Teal background */
  --win95-yellow: #ffff00;   /* Featured highlight */
}
```

### Add More Sounds
Edit `win95-sounds.js` and add Base64 audio URLs.

### Modify Layout
All styles are inline in `index.html` for easy editing.

## 🔧 Tech Stack

- **Frontend:** Vanilla JavaScript (no framework)
- **CSS:** 98.css (Windows 95 framework)
- **Backend:** Supabase (PostgreSQL + REST API)
- **Deployment:** Vercel (instant deploy)
- **No build tools** - just HTML, CSS, JS

## 📸 Screenshots

[Screenshots coming soon...]

## 🤝 Contributing

Found a great app? Want to improve the design?

1. Fork the repo
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

MIT © 2026 CuratedStack

---

**Built with nostalgia by J.A.R.V.I.S. 🤖**

*Remember when software had personality? We do.*
