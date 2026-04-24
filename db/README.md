# CuratedStack database

Postgres schema + migrations for Supabase project `jereytrwxnuwcvzvqhbg`.

## Files

- `supabase-schema.sql` — initial schema (apps table, indices, RLS)
- `migration-news-table.sql` — adds `news` table for daily news feed
- `migration-add-fields.sql` — adds fields (tags, pricing_model, featured, …)

## Run migrations

```bash
cd ../scripts
node run-migration.js
```

Or use the Supabase SQL editor dashboard directly.
