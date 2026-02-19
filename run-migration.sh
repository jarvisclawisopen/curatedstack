#!/bin/bash
# Run Supabase migration using service role key

PROJECT_REF="jereytrwxnuwcvzvqhbg"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplcmV5dHJ3eG51d2N2enZxaGJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDkyMjU3OSwiZXhwIjoyMDg2NDk4NTc5fQ.rMilS1vu-xaoBLa5N2zbvPG9SDVPaaKwyd5GQ9vMTkE"

# Read migration SQL
SQL=$(cat migration-add-fields.sql)

# Execute via Supabase REST API (using query parameter for raw SQL)
curl -X POST "https://${PROJECT_REF}.supabase.co/rest/v1/rpc" \
  -H "apikey: ${SERVICE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"sql\": \"${SQL}\"}"

