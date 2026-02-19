#!/usr/bin/env node
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load .env
const env = {}
try {
  readFileSync(resolve(process.cwd(), '.env'), 'utf8').split('\n').forEach(line => {
    const [k, ...v] = line.split('=')
    if (k && v.length) env[k.trim()] = v.join('=').trim()
  })
} catch {}

const AIRTABLE_TOKEN = env.AIRTABLE_TOKEN || process.env.AIRTABLE_TOKEN
const AIRTABLE_BASE  = env.AIRTABLE_BASE  || process.env.AIRTABLE_BASE
const AIRTABLE_TABLE = env.AIRTABLE_TABLE || process.env.AIRTABLE_TABLE
const SUPABASE_URL   = env.SUPABASE_URL   || process.env.SUPABASE_URL
const SUPABASE_KEY   = env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY

async function fetchAirtableRecords() {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(AIRTABLE_TABLE)}`
  const response = await fetch(url, { headers: { 'Authorization': `Bearer ${AIRTABLE_TOKEN}` } })
  if (!response.ok) throw new Error(`Airtable API error: ${response.status} ${await response.text()}`)
  const data = await response.json()
  return data.records
}

async function insertToSupabase(apps) {
  const url = `${SUPABASE_URL}/rest/v1/apps`
  const transformed = apps.map(record => ({
    name: record.fields['Name'] || record.fields['App Name'] || record.fields['name'] || '',
    description: record.fields['Description'] || record.fields['description'] || '',
    detailed_description: record.fields['Detailed Description'] || record.fields['detailed_description'] || '',
    url: record.fields['URL'] || record.fields['Website'] || record.fields['url'] || '',
    category: record.fields['Category'] || record.fields['category'] || 'Other',
    pricing_model: record.fields['Pricing'] || record.fields['Pricing Model'] || record.fields['pricing_model'] || null,
    tags: record.fields['Tags'] || record.fields['tags'] || [],
    logo_url: record.fields['Logo URL'] || record.fields['logo_url'] || null,
    screenshot_url: record.fields['Screenshot URL'] || record.fields['screenshot_url'] || null,
    featured: record.fields['Featured'] || record.fields['featured'] || false,
  })).filter(app => app.name && app.url)

  console.log(`Importing ${transformed.length} apps to Supabase...`)
  console.log(`Sample record:`, transformed[0])

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates,return=representation',
      'on_conflict': 'name'
    },
    body: JSON.stringify(transformed)
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Supabase API error: ${response.status} ${error}`)
  }
  return await response.json()
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
    result.slice(0, 3).forEach(app => console.log(`  - ${app.name} (${app.category})`))
  } catch (error) {
    console.error('❌ Import failed:', error.message)
    process.exit(1)
  }
}

main()
