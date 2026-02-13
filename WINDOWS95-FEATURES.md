# 🪟 Windows 95 Theme Features

## ✅ Implemented Features

### 🎨 Visual Design
- **98.css Framework** - Authentic Windows 95 CSS library
- **3D Beveled Borders** - Raised/sunken effects on all UI elements
- **Teal Desktop Background** - Classic Windows 95 teal
- **Title Bars** - Blue gradient title bars with window controls
- **Taskbar** - Fixed taskbar at bottom with Start button and clock
- **Retro Scrollbars** - Windows 95 style scrollbars with arrow buttons
- **Status Bars** - Inset status fields showing stats

### 🖱️ Interactive Elements
- **Buttons** - 3D buttons with pressed state animation
- **Input Fields** - Sunken input fields with dark borders
- **Window Controls** - Minimize/Maximize/Close buttons (currently disabled)
- **Select Dropdowns** - Native Windows 95 dropdown styling

### ⭐ Featured Apps Highlight
Featured apps get **triple treatment**:

1. **⭐ FEATURED ⭐ Badge**
   - Yellow background with black border
   - Positioned above the window
   - Bouncing animation (1s cycle)

2. **Rainbow Title Bar**
   - Animated gradient: red → orange → yellow
   - 3 second animation loop
   - Much more eye-catching than standard blue

3. **Yellow Glow Effect**
   - Subtle box-shadow pulse
   - 2 second breathing animation
   - Makes featured apps stand out in grid

**To mark an app as featured:**
```sql
UPDATE apps SET featured = true WHERE name = 'Your App Name';
```

### 🔊 Sound Effects
- **Click Sound** - All button clicks play retro beep
- **Tada Sound** - Plays on successful upvote/rating
- **Startup Sound** - (Future: play on page load)
- **Error Sound** - (Future: play on errors)

Sounds are Base64 encoded data URLs (no external files needed!)

### 📱 Responsive Design
- Works on desktop, tablet, and mobile
- Grid layout adjusts to screen size
- Minimum window width: 300px
- Taskbar remains fixed at bottom

## 🎯 How to Use

### View the Windows 95 Version
Open `index-win95.html` in any browser - no build step required!

### Add Featured Status
In Supabase Table Editor:
1. Open `apps` table
2. Find your app
3. Set `featured` column to `true`
4. Refresh page - app now has yellow glow + badge!

### Customize Colors
Edit `win95-theme.css` and change CSS variables:
```css
:root {
  --win95-desktop: #008080; /* Teal background */
  --win95-yellow: #ffff00;  /* Featured highlight */
  /* etc... */
}
```

### Add More Sounds
Edit `win95-sounds.js` and add new Base64 audio data URLs.

## 🚀 Next Steps

### Deploy
1. Push to GitHub
2. Import to Vercel
3. Auto-deploy on every commit

### Enhancements (Future)
- [ ] Draggable windows
- [ ] Start menu with categories
- [ ] "My Computer" desktop icon
- [ ] Recycle bin for deleted votes
- [ ] Screensaver mode
- [ ] System sounds for all actions
- [ ] Animated desktop icons
- [ ] CRT screen effect toggle

## 🎮 Easter Eggs

Try clicking the Start button 5 times fast... 😉

---

**Built with nostalgia by J.A.R.V.I.S. 🤖**
