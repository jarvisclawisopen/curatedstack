# App Card Components 🎨

Moderné, animované komponenty pre app directory - inšpirované dizajnom [theresanaiforthat.com](https://theresanaiforthat.com).

## 📁 Súbory

```
components/
├── AppCard.html        # HTML štruktúra
├── AppCard.css         # Styles s animáciami
├── AppCard.js          # JavaScript funkcie
├── demo.html           # Live demo stránka
└── README.md           # Táto dokumentácia
```

---

## 🚀 Quick Start

### 1. Otvor demo
```bash
open components/demo.html
```

Alebo spusti local server:
```bash
python3 -m http.server 8000
# Potom otvor http://localhost:8000/components/demo.html
```

### 2. Použitie v projekte

```html
<!-- Import CSS -->
<link rel="stylesheet" href="./components/AppCard.css">

<!-- Container -->
<div id="app-grid"></div>

<!-- Import JS module -->
<script type="module">
  import { renderAppGrid, showLoadingSkeleton, animateCardsEntrance } 
    from './components/AppCard.js'

  const container = document.getElementById('app-grid')
  
  // Show loading
  showLoadingSkeleton(container, 6)
  
  // Fetch apps (from Supabase API)
  const apps = await fetchApps()
  
  // Render grid
  renderAppGrid(apps, container, {
    onUpvote: async (appId) => await upvoteApp(appId, fingerprint),
    onRate: async (appId, rating) => await rateApp(appId, rating, fingerprint),
    userVotes: {} // { appId: { upvoted, rating } }
  })
  
  // Animate entrance
  animateCardsEntrance(container)
</script>
```

---

## 🎨 Features

### ✨ Animácie
- **Hover efekt** - card elevates + border color change
- **Stagger entrance** - cards fade in sequentially
- **Upvote pulse** - icon animates on click
- **Star fill** - rating stars animate when clicked
- **Loading skeleton** - shimmer effect pri načítavaní

### 📱 Responsive
- **Desktop** - 3-4 cards per row (auto-fit)
- **Tablet** - 2 cards per row
- **Mobile** - 1 card per row, stacked footer

### 🌓 Dark Mode
- Auto-detects `prefers-color-scheme: dark`
- Custom color palette pre dark theme

### ♿ Accessibility
- Semantic HTML (`<article>`, `<button>`)
- ARIA labels
- Keyboard navigation support
- Screen reader friendly

---

## 📚 API Reference

### `createAppCard(app, options)`
Vytvorí jednotlivý app card element.

**Parameters:**
```javascript
app = {
  id: 'uuid',
  name: 'OpenClaw',
  description: 'AI agent platform',
  url: 'https://openclaw.ai',
  logo_url: null,  // optional
  category: 'Development',
  tags: ['AI', 'automation'],
  upvotes: 142,
  rating_sum: 238,
  rating_count: 52,
  featured: true
}

options = {
  onUpvote: async (appId) => { /* handler */ },
  onRate: async (appId, rating) => { /* handler */ },
  userVotes: { upvoted: false, rating: null }
}
```

**Returns:** `HTMLElement`

---

### `renderAppGrid(apps, container, options)`
Vyrenderuje celý grid s app cards.

**Parameters:**
- `apps` - Array of app objects
- `container` - HTML element (napr. `<div id="app-grid">`)
- `options` - Same as `createAppCard`

---

### `showLoadingSkeleton(container, count)`
Zobrazí loading skeleton cards.

**Parameters:**
- `container` - HTML element
- `count` - Number of skeleton cards (default: 6)

---

### `animateCardsEntrance(container)`
Animuje cards s stagger efektom (fade in + slide up).

**Parameters:**
- `container` - Grid container element

---

### `createSkeletonCard()`
Vytvorí loading skeleton card.

**Returns:** `HTMLElement`

---

### `updateCardUpvotes(appId, newCount)`
Aktualizuje upvote count na existujúcom card.

**Parameters:**
- `appId` - App ID
- `newCount` - New upvote count

---

### `updateCardRating(appId, newAvgRating)`
Aktualizuje rating value na existujúcom card.

**Parameters:**
- `appId` - App ID
- `newAvgRating` - New average rating (1-5)

---

## 🎯 Optimistic Updates

Komponenty majú built-in optimistic updates:

1. **User klikne upvote** → UI sa aktualizuje okamžite
2. **API call** → čaká na response
3. **Ak error** → rollback UI + zobrazí error
4. **Ak success** → UI zostane updated

```javascript
renderAppGrid(apps, container, {
  onUpvote: async (appId) => {
    // UI already updated optimistically
    const result = await upvoteApp(appId, fingerprint)
    
    // Component handles rollback automatically if result.success === false
    return result
  }
})
```

---

## 🎨 Customizácia

### Zmena farieb

V `AppCard.css`:

```css
.app-card:hover {
  border-color: #3b82f6; /* Zmeň hover border color */
}

.app-card__upvote.upvoted {
  background: #3b82f6; /* Zmeň upvoted button color */
}

.star.filled {
  color: #fbbf24; /* Zmeň filled star color */
}
```

### Zmena hover efektu

```css
.app-card:hover {
  transform: translateY(-4px); /* Väčší lift */
  box-shadow: 0 20px 60px rgba(59, 130, 246, 0.2); /* Väčší shadow */
}
```

### Zmena grid layoutu

```css
.app-grid {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); /* Užšie cards */
  gap: 2rem; /* Väčší gap */
}
```

---

## 📱 Responsive Breakpoints

```css
/* Desktop (default) */
.app-grid {
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}

/* Tablet */
@media (max-width: 768px) {
  .app-grid {
    grid-template-columns: 1fr;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .app-card__footer {
    flex-direction: column; /* Stack upvote + rating */
  }
}
```

---

## 🧪 Testing

### Manual testing v demo.html

```javascript
// Open browser console

// 1. Test loading skeleton
showSkeleton()

// 2. Test rendering apps
loadMockApps()

// 3. Test upvote (klikni na upvote button)
// 4. Test rating (klikni na star)
// 5. Test tag click (klikni na tag)

// Events emitted:
document.addEventListener('tagClick', (e) => {
  console.log('Tag clicked:', e.detail)
})
```

---

## 🔗 Integrácia so Supabase API

```javascript
import { renderAppGrid } from './components/AppCard.js'
import { 
  fetchApps, 
  upvoteApp, 
  rateApp, 
  getUserVotes,
  getUserFingerprint 
} from './src/supabase-api.js'

const container = document.getElementById('app-grid')
const fingerprint = getUserFingerprint()

// 1. Show loading
showLoadingSkeleton(container)

// 2. Fetch data
const { data: apps } = await fetchApps()

// 3. Load user votes
const userVotes = {}
for (const app of apps) {
  const votes = await getUserVotes(app.id, fingerprint)
  userVotes[app.id] = votes
}

// 4. Render
renderAppGrid(apps, container, {
  onUpvote: async (appId) => {
    return await upvoteApp(appId, fingerprint)
  },
  onRate: async (appId, rating) => {
    return await rateApp(appId, rating, fingerprint)
  },
  userVotes
})

// 5. Animate
animateCardsEntrance(container)
```

---

## 🎭 Loading States

### Initial load
```javascript
showLoadingSkeleton(container, 6)

// Fetch data...
const apps = await fetchApps()

// Replace skeleton with real cards
renderAppGrid(apps, container, options)
animateCardsEntrance(container)
```

### Infinite scroll / Pagination
```javascript
// Keep existing cards, append new ones
const newApps = await fetchAppsPaginated(page, 20)

newApps.forEach(app => {
  const card = createAppCard(app, options)
  container.appendChild(card)
})
```

---

## 🌟 Best Practices

### 1. Lazy load images
```javascript
// In createAppCard()
const img = document.createElement('img')
img.loading = 'lazy' // Native lazy loading
img.src = app.logo_url
```

### 2. Debounce search
```javascript
import { debounce } from 'lodash'

const debouncedSearch = debounce(async (query) => {
  showLoadingSkeleton(container)
  const { data } = await searchApps(query)
  renderAppGrid(data, container, options)
}, 300)
```

### 3. Virtual scrolling (pre veľké datasety)
Pre >1000 apps použi virtual scrolling library (napr. `react-window`).

### 4. Cache user votes
```javascript
const votesCache = new Map()

async function getUserVotesWithCache(appId, fingerprint) {
  const key = `${appId}:${fingerprint}`
  
  if (votesCache.has(key)) {
    return votesCache.get(key)
  }
  
  const votes = await getUserVotes(appId, fingerprint)
  votesCache.set(key, votes)
  return votes
}
```

---

## 🐛 Troubleshooting

### Cards sa nezobrazujú
- Skontroluj, či je `AppCard.css` správne importovaný
- Overiť v DevTools console pre JS errory
- Skontroluj, či `container` element existuje v DOM

### Animácie nefungujú
- Skontroluj, či CSS transitions nie sú disabled (`prefers-reduced-motion`)
- Overiť, že `animateCardsEntrance()` je volaný PO renderovaní

### Upvote/Rating nefunguje
- Skontroluj, či `onUpvote`/`onRate` callbacks vracajú `{ success: boolean }`
- Browser console → skontroluj errory z API calls

### Grid layout broken na mobile
- Skontroluj viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- Overiť media queries v CSS

---

## 🚀 Production Checklist

- [ ] Optimizuj images (použiť WebP, lazy loading)
- [ ] Minifikuj CSS/JS (Vite, webpack, etc.)
- [ ] Pridaj error boundaries (catch failed renders)
- [ ] Test na real devices (iOS Safari, Android Chrome)
- [ ] Accessibility audit (WAVE, axe DevTools)
- [ ] Performance audit (Lighthouse)
- [ ] Add analytics tracking (upvote/rating events)

---

## 📄 License

MIT - použiť voľne v commercial/personal projektoch.

---

**Made with ❤️ by J.A.R.V.I.S.**

*Just Another Rather Very Intelligent System* 🤖
