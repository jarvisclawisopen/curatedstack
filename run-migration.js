#!/usr/bin/env node

const SUPABASE_URL = 'https://jereytrwxnuwcvzvqhbg.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplcmV5dHJ3eG51d2N2enZxaGJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDkyMjU3OSwiZXhwIjoyMDg2NDk4NTc5fQ.rMilS1vu-xaoBLa5N2zbvPG9SDVPaaKwyd5GQ9vMTkE'

// We'll execute SQL statements individually since Supabase REST API
// doesn't have a direct SQL execution endpoint. We'll use a workaround.

async function runMigration() {
  console.log('🔄 Running Supabase migration...')
  
  // Check if columns already exist
  const checkQuery = `
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'apps' 
    AND column_name IN ('detailed_description', 'pricing_model')
  `
  
  try {
    // Use Supabase's RPC to execute raw SQL (if available)
    // Otherwise we'll need to use the REST API to check table structure
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/apps?select=*&limit=1`, {
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`
      }
    })
    
    const data = await response.json()
    console.log('✅ Connected to Supabase')
    console.log('Current table structure:', Object.keys(data[0] || {}))
    
    const hasDetailedDesc = data[0] && 'detailed_description' in data[0]
    const hasPricingModel = data[0] && 'pricing_model' in data[0]
    
    if (hasDetailedDesc && hasPricingModel) {
      console.log('✅ Migration already complete! Columns exist.')
      console.log('   - detailed_description: ✓')
      console.log('   - pricing_model: ✓')
      return true
    } else {
      console.log('⚠️  Migration needed:')
      console.log('   - detailed_description:', hasDetailedDesc ? '✓' : '✗')
      console.log('   - pricing_model:', hasPricingModel ? '✓' : '✗')
      console.log('\n❌ Cannot execute ALTER TABLE via REST API.')
      console.log('Please run this SQL in Supabase SQL Editor:')
      console.log('👉 https://supabase.com/dashboard/project/jereytrwxnuwcvzvqhbg/sql/new')
      console.log('\nALTER TABLE apps')
      console.log('ADD COLUMN IF NOT EXISTS detailed_description TEXT,')
      console.log('ADD COLUMN IF NOT EXISTS pricing_model TEXT;')
      console.log('\nCREATE INDEX IF NOT EXISTS idx_apps_pricing ON apps(pricing_model);')
      return false
    }
    
  } catch (error) {
    console.error('❌ Migration check failed:', error.message)
    return false
  }
}

runMigration().then(success => {
  process.exit(success ? 0 : 1)
})
