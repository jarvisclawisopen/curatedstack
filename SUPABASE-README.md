# Supabase Database - App Directory

## Prehľad

Kompletný SQL skript pre Supabase databázu s appkami, hlasovaním a ratingami.

## Štruktúra

### 📦 Tabuľka: `apps`

Obsahuje všetky aplikácie/weby s ich metadátami.

| Stĺpec | Typ | Popis |
|--------|-----|-------|
| `id` | UUID | Primary key, auto-generovaný |
| `name` | TEXT | Názov aplikácie (povinné) |
| `description` | TEXT | Krátky popis |
| `url` | TEXT | Link na web (povinné) |
| `logo_url` | TEXT | URL loga (voliteľné) |
| `screenshot_url` | TEXT | URL screenshotu (voliteľné) |
| `category` | TEXT | Kategória (napr. "Development", "Design") |
| `tags` | TEXT[] | Array tagov (napr. ["AI", "automation"]) |
| `upvotes` | INTEGER | Počet upvotov (auto-update) |
| `rating_sum` | INTEGER | Súčet všetkých hodnotení (auto-update) |
| `rating_count` | INTEGER | Počet hodnotení (auto-update) |
| `featured` | BOOLEAN | Či je app featured (default false) |
| `created_at` | TIMESTAMP | Dátum vytvorenia (auto) |

**Indexy:**
- Category, featured, created_at - pre rýchle filtrovanie
- Full-text search - pre vyhľadávanie v názve/popise
- Tags - pre rýchle filtrovanie podľa tagov

---

### 🗳️ Tabuľka: `votes`

Ukladá hlasy používateľov (upvotes + star ratings).

| Stĺpec | Typ | Popis |
|--------|-----|-------|
| `id` | UUID | Primary key |
| `app_id` | UUID | Foreign key na apps (ON DELETE CASCADE) |
| `user_fingerprint` | TEXT | Identifikátor usera (browser fingerprint pre MVP) |
| `vote_type` | TEXT | 'upvote' alebo 'rating' |
| `rating_value` | INTEGER | 1-5 (iba pre vote_type='rating') |
| `created_at` | TIMESTAMP | Kedy sa hlasovalo |

**Constraint:**
- `UNIQUE(app_id, user_fingerprint, vote_type)` - user môže dať max 1 upvote a 1 rating na app

---

## 🔒 Row Level Security (RLS)

### Apps:
- ✅ **Public read** - každý vidí všetky apps
- ❌ Insert/Update/Delete - zatiaľ iba cez admin panel (pre budúcnosť)

### Votes:
- ✅ **Public read** - každý vidí všetky hlasy (potrebné na check, či už user hlasoval)
- ✅ **Public insert** - každý môže hlasovať (bez registrácie)

---

## ⚙️ Automatizácia

**Triggre:**
1. `trigger_update_upvotes` - po insert upvote sa automaticky aktualizuje `apps.upvotes`
2. `trigger_update_ratings` - po insert rating sa automaticky aktualizuje `apps.rating_sum` a `apps.rating_count`

Vďaka tomu nemusíš manuálne počítať hlasy - stačí insert do `votes` a štatistiky sa aktualizujú sami.

---

## 🚀 Ako použiť v Supabase

### 1. Vytvor projekt
- Choď na [supabase.com](https://supabase.com)
- New project → vyber názov, región, heslo

### 2. Spusti SQL
- V Supabase dashboarde: **SQL Editor** (ľavé menu)
- Skopíruj celý obsah `supabase-schema.sql`
- Daj **Run**

### 3. Overiť
- Choď do **Table Editor**
- Mali by sa ti zobraziť tabuľky `apps` a `votes`

### 4. API endpoint
- **Settings** → **API** → skopíruj:
  - Project URL (napr. `https://abcxyz.supabase.co`)
  - Anon public key (na použitie vo frontende)

---

## 📝 Príklady SQL queries

### Získať všetky apps sorted by upvotes:
```sql
SELECT * FROM apps ORDER BY upvotes DESC;
```

### Vyhľadávanie v názve/popise:
```sql
SELECT * FROM apps 
WHERE to_tsvector('english', name || ' ' || description) 
@@ to_tsquery('english', 'AI & automation');
```

### Filter podľa kategórie:
```sql
SELECT * FROM apps WHERE category = 'Development';
```

### Filter podľa tagu:
```sql
SELECT * FROM apps WHERE 'AI' = ANY(tags);
```

### Skontrolovať, či user už hlasoval:
```sql
SELECT * FROM votes 
WHERE app_id = 'uuid-tu' 
AND user_fingerprint = 'fingerprint-tu' 
AND vote_type = 'upvote';
```

### Pridať upvote (auto-update apps.upvotes):
```sql
INSERT INTO votes (app_id, user_fingerprint, vote_type) 
VALUES ('uuid-tu', 'fingerprint-tu', 'upvote');
```

### Pridať rating (auto-update apps.rating_sum/count):
```sql
INSERT INTO votes (app_id, user_fingerprint, vote_type, rating_value) 
VALUES ('uuid-tu', 'fingerprint-tu', 'rating', 5);
```

---

## 🔮 Budúce rozšírenia (keď pridáš auth)

Keď budeš chcieť pridať registráciu/prihlásenie:

1. Pridaj stĺpec `user_id UUID` do `votes`
2. Zmeň RLS policies - namiesto fingerprint používaj `auth.uid()`
3. Pridaj tabuľku `users` alebo použi Supabase Auth

Terajšia štruktúra je pripravená - stačí pridať `user_id` vedľa `user_fingerprint` a migration je easy.

---

## 🎯 Prečo takto?

✅ **Jednoduchosť** - žiadna autentifikácia pre MVP  
✅ **Škálovateľnosť** - pripravené na budúci auth system  
✅ **Performance** - indexy pre rýchle queries  
✅ **Automatizácia** - triggre na auto-update štatistík  
✅ **Bezpečnosť** - RLS policies, iba potrebné operácie public  

---

Ďalší krok: frontend s Supabase JS klientom 🚀
