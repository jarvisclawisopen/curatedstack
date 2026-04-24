# CuratedStack scripts

Helper scripts for database import and maintenance.

## Setup

```bash
cp ../.env.example ../.env
# fill in SUPABASE_SECRET_KEY in .env
npm install
```

## Scripts

- `import-new-batch.js` — bulk insert a batch of apps
- `import-6apps.js` — legacy importer from ProductHunt/TAAFT harvests
- `import-from-airtable.js` — legacy Airtable migration (historical)
- `fetch-favicons.js` — download and cache favicons for apps
- `run-migration.js` / `run-migration-pg.js` — run SQL migrations from `../db/`
- `supabase-client-example.js` — reference snippet for Supabase JS client usage

All scripts read credentials from `.env` via `dotenv`. They use `SUPABASE_SECRET_KEY` (backend) or `SUPABASE_PUBLISHABLE_KEY` (read-only).
