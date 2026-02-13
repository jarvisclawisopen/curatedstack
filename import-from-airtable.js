#!/usr/bin/env node

const AIRTABLE_TOKEN = 'YOUR_AIRTABLE_TOKEN_HERE'
const AIRTABLE_BASE = 'app4D6UyKLageFn7j'
const AIRTABLE_TABLE = 'Apps/web database'

const SUPABASE_URL = 'https://jereytrwxnuwcvzvqhbg.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplcmV5dHJ3eG51d2N2enZxaGJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MjI1NzksImV4cCI6MjA4NjQ5ODU3OX0.r0RDnh75IGjECXMwMJNZR0oqF-cEubxbQbjXgavsJ_I'

async function fetchAirtableRecords() {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(AIRTABLE_TABLE)}`
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${AIRTABLE_TOKEN}`
    }
  })
  
  if (!response.ok) {
    throw new Error(`Airtable API error: ${response.status} ${await response.text()}`)
  }
  
  const data = await response.json()
  return data.records
}

async function insertToSupabase(apps) {
  const url = `${SUPABASE_URL}/rest/v1/apps`
  
  // Transform Airtable records to Supabase schema
  const transformed = apps.map(record => ({
    name: record.fields.Name,
    description: record.fields.Description || null,
    url: record.fields.URL,
    category: record.fields.Category || null,
    tags: record.fields.Tags || [],
    logo_url: null,
    screenshot_url: null,
    featured: false
  })).filter(app => app.name && app.url) // Only valid apps
  
  console.log(`Importing ${transformed.length} apps to Supabase...`)
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(transformed)
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Supabase API error: ${response.status} ${error}`)
  }
  
  const result = await response.json()
  return result
}

async function main() {
  try {
    console.log('Fetching records from Airtable...')
    const records = await fetchAirtableRecords()
    console.log(`Found ${records.length} records in Airtable`)
    
    console.log('Importing to Supabase...')
    const result = await insertToSupabase(records)
    
    console.log(`✅ Successfully imported ${result.length} apps!`)
    console.log(`\nFirst 3 imported:`)
    result.slice(0, 3).forEach(app => {
      console.log(`  - ${app.name} (${app.category})`)
    })
  } catch (error) {
    console.error('❌ Import failed:', error.message)
    process.exit(1)
  }
}

main()
