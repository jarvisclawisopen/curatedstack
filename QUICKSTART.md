# Quick Start Guide 🚀

Tento guide ťa prevedie celým setupom za 5 minút.

## 1️⃣ Supabase Setup

### A) Vytvor projekt
1. Choď na [supabase.com](https://supabase.com)
2. **New project**
3. Zadaj názov, región (EU Central), heslo
4. Počkaj ~2 min kým sa vytvorí

### B) Spusti SQL
1. V dashboarde: **SQL Editor** (ľavé menu)
2. Otvor súbor `supabase-schema.sql` (v tomto priečinku)
3. Skopíruj celý obsah a vlož do SQL editora
4. Klikni **Run**
5. Overiť: **Table Editor** → mali by sa zobraziť tabuľky `apps` a `votes`

### C) Získaj API credentials
1. **Settings** (zubatka dole vľavo)
2. **API** (ľavé menu)
3. Skopíruj:
   - **Project URL** (napr. `https://abcxyz.supabase.co`)
   - **anon public** key (dlhý string)

---

## 2️⃣ Code Setup

### A) Install dependencies
```bash
cd app-directory
npm install
```

### B) Nastav credentials
Otvor `src/supabase-api.js` a zmeň:

```javascript
const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co'  // ← tvoja URL
const SUPABASE_ANON_KEY = 'YOUR-ANON-PUBLIC-KEY-HERE'    // ← tvoj key
```

---

## 3️⃣ Test API

### Otvor browser console a testuj:

```javascript
// Import test suite
import { runAllTests } from './src/supabase-api.test.js'

// Spusti všetky testy
await runAllTests()
```

Mali by sa ti zobraziť ✅ zelené checky pre všetky testy.

---

## 4️⃣ Použitie v projekte

### Vanilla JS:
```javascript
import { 
  fetchApps, 
  upvoteApp, 
  rateApp,
  getUserFingerprint 
} from './src/supabase-api.js'

// Fetch apps
const { data, error } = await fetchApps()
console.log(data)

// Upvote
const fingerprint = getUserFingerprint()
await upvoteApp(data[0].id, fingerprint)
```

### React:
```javascript
import { useApps } from './src/useApps.js'

function AppList() {
  const { apps, upvote, rate, userVotes } = useApps()
  
  return (
    <div>
      {apps.map(app => (
        <div key={app.id}>
          <h2>{app.name}</h2>
          <button onClick={() => upvote(app.id)}>
            {userVotes[app.id]?.upvoted ? '✅ Upvoted' : '👍 Upvote'}
          </button>
        </div>
      ))}
    </div>
  )
}
```

---

## 5️⃣ Pridaj sample data

V Supabase dashboarde:

1. **Table Editor** → `apps`
2. **Insert row**
3. Vyplň:
   - name: "OpenClaw"
   - description: "AI agent platform"
   - url: "https://openclaw.ai"
   - category: "Development"
   - tags: `["AI", "automation"]` (JSON array!)
4. **Save**

Alebo v SQL Editore:

```sql
INSERT INTO apps (name, description, url, category, tags) VALUES
  ('OpenClaw', 'AI agent platform for automation', 'https://openclaw.ai', 'Development', ARRAY['AI', 'automation']),
  ('Supabase', 'Open source Firebase alternative', 'https://supabase.com', 'Development', ARRAY['database', 'backend']),
  ('Figma', 'Collaborative design tool', 'https://figma.com', 'Design', ARRAY['design', 'prototyping']);
```

---

## 🧪 Troubleshooting

### Test fails: "No apps found"
→ Pridaj sample data (krok 5)

### Test fails: "CORS error"
→ Nastav Supabase URL/key správne v `supabase-api.js`

### Test fails: "RLS policy violation"
→ Skontroluj, či si spustil celý `supabase-schema.sql` (vrátane RLS policies)

### Upvote/Rating nefunguje
→ Skontroluj browser console pre errory
→ Overiť triggre v Supabase: **Database** → **Triggers**

---

## 📚 Ďalšie kroky

1. **Dokumentácia:** Prečítaj si `src/README.md` pre kompletný API docs
2. **Testovanie:** Pozri `src/supabase-api.test.js` pre príklady použitia
3. **React Hook:** Použi `src/useApps.js` pre easy React integration
4. **Frontend:** Vytvor UI (Next.js/React/Svelte) pomocou týchto modulov

---

Hotovo! Máš funkčný backend + API ready na použitie 🎉

Potrebuješ pomoc s frontentom? Daj vedieť!
