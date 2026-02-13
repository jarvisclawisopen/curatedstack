# Supabase API Module - Dokumentácia

Kompletný JavaScript modul pre prácu s Supabase databázou app directory.

## 📦 Súbory

### 1. `supabase-api.js` - Hlavný API modul
Obsahuje všetky funkcie pre komunikáciu s databázou:
- ✅ Fetch apps (s rôznymi filtermi)
- ✅ Upvote & Rating (s optimistic updates)
- ✅ Browser fingerprinting
- ✅ Error handling

### 2. `supabase-api.test.js` - Testovacie funkcie
Kompletná test suite pre overenie funkcionality:
- ✅ Unit testy pre každú funkciu
- ✅ Integration testy
- ✅ Error handling testy
- ✅ Optimistic updates demo

### 3. `useApps.js` - React Hook (voliteľné)
Custom React hook pre jednoduchú integráciu do React komponentov:
- ✅ State management
- ✅ Optimistic updates
- ✅ Auto-refresh pri zmene filtrov

---

## 🚀 Setup

### 1. Nainštaluj Supabase client

```bash
npm install @supabase/supabase-js
```

### 2. Nastav credentials

V `supabase-api.js` zmeň:

```javascript
const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co'
const SUPABASE_ANON_KEY = 'YOUR-ANON-PUBLIC-KEY-HERE'
```

Tieto hodnoty nájdeš v Supabase dashboarde:
**Settings** → **API** → Project URL + anon public key

### 3. Import a použitie

```javascript
import { 
  fetchApps, 
  upvoteApp, 
  rateApp,
  getUserFingerprint 
} from './supabase-api.js'

// Fetch apps
const { data, error } = await fetchApps()

// Upvote
const fingerprint = getUserFingerprint()
await upvoteApp(appId, fingerprint)

// Rate
await rateApp(appId, 5, fingerprint)
```

---

## 📚 API Dokumentácia

### `fetchApps()`
Načíta všetky apps sorted by created_at DESC.

```javascript
const { data, error } = await fetchApps()

// data = [
//   {
//     id: 'uuid',
//     name: 'OpenClaw',
//     description: 'AI agent platform',
//     url: 'https://openclaw.ai',
//     category: 'Development',
//     tags: ['AI', 'automation'],
//     upvotes: 42,
//     rating_sum: 125,
//     rating_count: 25,
//     avg_rating: '5.0', // vypočítané
//     created_at: '2026-02-13T...'
//   },
//   ...
// ]
```

---

### `upvoteApp(appId, fingerprint)`
Pridá upvote pre app (ak user ešte nehlasoval).

```javascript
const fingerprint = getUserFingerprint()
const { success, error } = await upvoteApp(appId, fingerprint)

if (success) {
  console.log('Upvoted!')
} else {
  console.error(error) // "Already upvoted" alebo iná chyba
}
```

**Optimistic verzia:**

```javascript
await upvoteAppOptimistic(
  appId,
  fingerprint,
  (appId, increment) => {
    // UI callback - aktualizuj UI okamžite
    updateAppInUI(appId, { upvotes: app.upvotes + increment })
  },
  (error) => {
    // Error callback - rollback UI
    showError(error.message)
  }
)
```

---

### `rateApp(appId, rating, fingerprint)`
Pridá hodnotenie 1-5 stars (ak user ešte nehodnotil).

```javascript
const rating = 5 // 1-5
const { success, error } = await rateApp(appId, rating, fingerprint)

if (!success) {
  console.error(error) // "Already rated" alebo "Rating must be between 1 and 5"
}
```

**Optimistic verzia:**

```javascript
await rateAppOptimistic(
  appId,
  rating,
  fingerprint,
  (appId, newRating) => {
    // UI callback
    updateAppRatingInUI(appId, newRating)
  },
  (error) => {
    // Error callback - rollback
    showError(error.message)
  }
)
```

---

### `getUserVotes(appId, fingerprint)`
Zistí, či user už hlasoval/hodnotil konkrétnu app.

```javascript
const { upvoted, rating, error } = await getUserVotes(appId, fingerprint)

console.log(upvoted) // true/false
console.log(rating)  // 1-5 or null
```

Použitie v UI:

```javascript
// Disable upvote button ak už user hlasoval
<button 
  disabled={upvoted}
  onClick={() => upvote(appId)}
>
  {upvoted ? '✅ Upvoted' : '👍 Upvote'}
</button>

// Disable rating ak už user hodnotil
{!rating && <StarRating onChange={(r) => rate(appId, r)} />}
{rating && <div>Your rating: {rating}⭐</div>}
```

---

### `searchApps(query)`
Vyhľadá apps podľa názvu alebo popisu.

```javascript
const { data, error } = await searchApps('AI automation')
// Vráti iba apps, kde name alebo description obsahuje query
```

---

### `filterByCategory(category)` / `filterByTag(tag)`
Filtruje apps podľa kategórie alebo tagu.

```javascript
const { data } = await filterByCategory('Development')
const { data } = await filterByTag('AI')
```

---

## 🧪 Testovanie

### Spustenie testov v browseri

1. Otvor browser console (F12)
2. Import test suite:

```javascript
import { runAllTests } from './supabase-api.test.js'
await runAllTests()
```

3. Pozri výsledky v console

**Individuálne testy:**

```javascript
import { testFetchApps, testUpvote } from './supabase-api.test.js'

await testFetchApps()
await testUpvote()
await testRating()
```

---

## ⚛️ React Integration

### Použitie custom hooku

```javascript
import { useApps } from './useApps.js'

function AppList() {
  const { 
    apps,          // zoznam apps
    loading,       // načítavajú sa?
    error,         // chyba?
    userVotes,     // { appId: { upvoted, rating } }
    upvote,        // funkcia na upvote
    rate,          // funkcia na rating
    refresh        // manuálne refresh
  } = useApps({
    sortBy: 'upvotes',      // created_at | upvotes | rating
    category: 'Development', // optional filter
    searchQuery: 'AI'        // optional search
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {apps.map(app => (
        <AppCard
          key={app.id}
          app={app}
          onUpvote={() => upvote(app.id)}
          onRate={(rating) => rate(app.id, rating)}
          hasUpvoted={userVotes[app.id]?.upvoted}
          userRating={userVotes[app.id]?.rating}
        />
      ))}
    </div>
  )
}
```

**Výhody:**
- ✅ Optimistic updates built-in
- ✅ Auto-refresh pri zmene filtrov
- ✅ User votes tracking
- ✅ Error handling

---

## 🔒 Browser Fingerprinting

Modul používa `getUserFingerprint()` na identifikáciu usera bez registrácie.

**Ako to funguje:**
1. Pri prvom načítaní generuje hash z browser properties (user agent, screen size, timezone...)
2. Uloží do `localStorage` ako `app_directory_fingerprint`
3. Pri ďalších návštevách používa uložený fingerprint

**Dôležité:**
- Fingerprint je persistent cez sessions (dokiaľ user nevymaže localStorage)
- Nie je 100% unique (identickí browseri na rovnakom zariadení = rovnaký hash)
- Pre produkciu odporúčam použiť [FingerprintJS](https://github.com/fingerprintjs/fingerprintjs)

**Upgrade na FingerprintJS (produkcia):**

```bash
npm install @fingerprintjs/fingerprintjs
```

```javascript
import FingerprintJS from '@fingerprintjs/fingerprintjs'

export async function getUserFingerprint() {
  const fp = await FingerprintJS.load()
  const result = await fp.get()
  return result.visitorId
}
```

---

## 🎯 Optimistic Updates Pattern

Optimistic updates = aktualizuj UI okamžite, rollback pri errore.

**Prečo?**
- ✅ Rychlejšia UX - user vidí zmeny instantly
- ✅ Nečaká na API response
- ✅ Ak zlyhá API, rollback + error message

**Príklad implementácie:**

```javascript
async function handleUpvote(appId) {
  // 1. Optimistic update UI
  setApps(prev => prev.map(app => 
    app.id === appId 
      ? { ...app, upvotes: app.upvotes + 1 }
      : app
  ))
  
  // 2. API call
  const { success, error } = await upvoteApp(appId, fingerprint)
  
  // 3. Rollback on error
  if (!success) {
    setApps(prev => prev.map(app => 
      app.id === appId 
        ? { ...app, upvotes: app.upvotes - 1 }
        : app
    ))
    alert(error.message)
  }
}
```

---

## 🐛 Error Handling

Všetky funkcie vracajú `{ success/data, error }` pattern:

```javascript
const { data, error } = await fetchApps()

if (error) {
  console.error('Failed:', error.message)
  // Handle error
} else {
  console.log('Success:', data)
}
```

**Typy errorov:**
- `"Already upvoted"` - user už hlasoval
- `"Already rated"` - user už hodnotil
- `"Rating must be between 1 and 5"` - invalid rating value
- Supabase errors - connection issues, RLS violations, atď.

---

## 📊 Performance Tips

### Pagination
Pre veľké datasety použi pagination:

```javascript
const { data, total } = await fetchAppsPaginated(page=0, perPage=20)
```

### Debounce search
Pre real-time search pridaj debounce:

```javascript
import { debounce } from 'lodash'

const debouncedSearch = debounce(async (query) => {
  const { data } = await searchApps(query)
  setResults(data)
}, 300)

// Usage
<input onChange={(e) => debouncedSearch(e.target.value)} />
```

### Cache results
Pre často používané queries:

```javascript
const cache = new Map()

async function getCachedApps() {
  if (cache.has('apps')) {
    return cache.get('apps')
  }
  
  const { data } = await fetchApps()
  cache.set('apps', data)
  return data
}
```

---

## 🔮 Budúce rozšírenia

Keď pridáš authentication:

1. Zmeň `user_fingerprint` → `user_id` v `votes` tabuľke
2. Použi `auth.uid()` v RLS policies
3. Replace `getUserFingerprint()` s `supabase.auth.getUser()`

Terajšia štruktúra je pripravená - easy migration.

---

## 📝 Checklist pre produkciu

- [ ] Zmeň Supabase URL a key v `supabase-api.js`
- [ ] Upgrade fingerprinting na FingerprintJS
- [ ] Pridaj rate limiting (Supabase má built-in)
- [ ] Nastav RLS policies podľa potreby
- [ ] Testuj na mobiloch (touch support pre rating stars)
- [ ] Pridaj analytics (track upvotes/ratings)
- [ ] SEO optimization (meta tags, Open Graph)
- [ ] Error monitoring (Sentry?)

---

Hotovo! Máš kompletný Supabase API modul s optimistic updates, error handling a React hooks 🚀
