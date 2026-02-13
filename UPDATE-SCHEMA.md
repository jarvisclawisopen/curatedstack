# Schema Update: Add Detailed Description & Pricing Model

## Potrebné kroky:

### 1. Spustiť migráciu v Supabase SQL Editor

Otvor [Supabase SQL Editor](https://supabase.com/dashboard/project/jereytrwxnuwcvzvqhbg/sql/new) a spusti:

```sql
-- Add new columns
ALTER TABLE apps 
ADD COLUMN IF NOT EXISTS detailed_description TEXT,
ADD COLUMN IF NOT EXISTS pricing_model TEXT;

-- Add index for pricing model filtering
CREATE INDEX IF NOT EXISTS idx_apps_pricing ON apps(pricing_model);

COMMENT ON COLUMN apps.detailed_description IS 'Extended description shown in modal';
COMMENT ON COLUMN apps.pricing_model IS 'Pricing type: free, paid, freemium, etc.';
```

### 2. Zmazať existujúce dáta (ak chceš začať od nuly)

**POZOR:** Toto zmaže všetky apps a votes! Skip, ak chceš zachovať existujúce dáta.

```sql
TRUNCATE votes CASCADE;
TRUNCATE apps CASCADE;
```

### 3. Reimportovať dáta z Airtable

V termináli (potrebuješ Airtable token):

```bash
cd /Users/jarvis/.openclaw/workspace/app-directory

# Nastav Airtable token (nahraď YOUR_TOKEN skutočným tokenom)
export AIRTABLE_TOKEN="YOUR_TOKEN_HERE"

# Updatni import script s tokenom
sed -i '' "s/YOUR_AIRTABLE_TOKEN_HERE/$AIRTABLE_TOKEN/" import-from-airtable.js

# Spusti import
node import-from-airtable.js
```

### 4. Verify data

Skontroluj, či sa všetky polia načítali:

```sql
SELECT 
  name, 
  description, 
  detailed_description, 
  pricing_model, 
  category, 
  tags 
FROM apps 
LIMIT 5;
```

## Nové polia:

- **`detailed_description`** - Dlhý popis z Airtable stĺpca "Detailed", zobrazuje sa v modálnom okne
- **`pricing_model`** - Pricing info z Airtable stĺpca "Pricing Model", zobrazuje sa ako farebný badge

## Frontend zmeny:

✅ Krátky popis (`description`) na karte  
✅ Dlhý popis (`detailed_description`) v modáli  
✅ Pricing badge s farbou podľa typu:
  - 🟢 Free = zelená
  - 🔴 Paid = červená
  - 🔵 Freemium = modrá
  - 🟡 Trial = žltá
  - ⚫ Other = šedá

## Deploy:

Po úspešnom importe:

```bash
git add .
git commit -m "Add detailed_description and pricing_model support"
git push origin main
```

Vercel auto-deployne za ~15 sekúnd.
