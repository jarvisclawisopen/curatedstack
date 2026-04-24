# CuratedStack

Personal curated feed of AI tools and daily tech/crypto/gaming news.

**Live:** https://curatedstack.app
**Stack:** static HTML + vanilla JS frontend, Supabase Postgres backend, Cloudflare DNS/CDN.

## Project layout

```
/
├── index.html            # Main app — theme engine, apps list, news reader
├── src/                  # Supabase JS client + data layer
├── components/           # App card components
├── scripts/              # Import helpers (read .env)
├── db/                   # SQL schema + migrations
├── sounds/               # Win95 theme audio
├── docs/                 # Technical docs (deploy, etc.)
├── win95-*.css/js        # Win95 theme assets
├── logo-*.png            # Logos per theme
└── favicon-new.png       # Favicon
```

## Local dev

```bash
# Copy env template
cp .env.example .env
# Fill in keys from Supabase dashboard Settings → API Keys
npm install
# Serve locally
npx serve .
```

## Deploy

Static site deploys to Cloudflare via `vercel.json` config (legacy). Push to `main` triggers deploy.

See `docs/DEPLOY.md` for details.

## Data

Two Supabase tables: `apps` (190 rows) and `news` (785 rows, daily updates via Perplexity Computer cron).

## Credits

Built by @boecrim666.
