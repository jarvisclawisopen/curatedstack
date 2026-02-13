#!/bin/bash

# Fetch from Airtable and generate SQL INSERT (with single quotes for PostgreSQL)
curl -s "https://api.airtable.com/v0/app4D6UyKLageFn7j/Apps%2Fweb%20database" \
  -H "Authorization: Bearer YOUR_AIRTABLE_TOKEN_HERE" | \
jq -r '.records[] | 
  "INSERT INTO apps (name, description, url, category, tags) VALUES (" +
  ("'\''" + (.fields.Name | gsub("'\''"; "'\'''\''")) + "'\''") + ", " +
  (if .fields.Description then ("'\''" + (.fields.Description | gsub("'\''"; "'\'''\''")) + "'\''") else "NULL" end) + ", " +
  ("'\''" + (.fields.URL | gsub("'\''"; "'\'''\''")) + "'\''") + ", " +
  (if .fields.Category then ("'\''" + (.fields.Category | gsub("'\''"; "'\'''\''")) + "'\''") else "NULL" end) + ", " +
  ("ARRAY[" + ([.fields.Tags[]? | "'\''" + . + "'\''"] | join(", ")) + "]") +
  ");"' > /tmp/airtable-import.sql

echo "✅ Generated SQL with $(wc -l < /tmp/airtable-import.sql) statements"
echo ""
echo "Preview first 3:"
head -3 /tmp/airtable-import.sql
echo ""
echo "📋 Full SQL copied to clipboard!"
cat /tmp/airtable-import.sql | pbcopy
