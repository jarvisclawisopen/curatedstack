#!/usr/bin/env node

// Alternative: Use Supabase's SQL execution via HTTP POST
// This uses an undocumented endpoint that some Supabase tools use

const SUPABASE_PROJECT_REF = 'jereytrwxnuwcvzvqhbg'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplcmV5dHJ3eG51d2N2enZxaGJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDkyMjU3OSwiZXhwIjoyMDg2NDk4NTc5fQ.rMilS1vu-xaoBLa5N2zbvPG9SDVPaaKwyd5GQ9vMTkE'

const SQL_STATEMENTS = [
  `ALTER TABLE apps ADD COLUMN IF NOT EXISTS detailed_description TEXT;`,
  `ALTER TABLE apps ADD COLUMN IF NOT EXISTS pricing_model TEXT;`,
  `CREATE INDEX IF NOT EXISTS idx_apps_pricing ON apps(pricing_model);`
]

async function executeSQLViaManagementAPI(sql) {
  // Try Supabase Management API
  // Note: This might require different auth (Management API token, not service role key)
  const url = `https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_REF}/database/query`
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: sql })
    })
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`API error: ${response.status} - ${error}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('❌ Management API failed:', error.message)
    return null
  }
}

async function main() {
  console.log('🔄 Attempting SQL migration via Management API...\n')
  
  for (const sql of SQL_STATEMENTS) {
    console.log(`Executing: ${sql}`)
    const result = await executeSQLViaManagementAPI(sql)
    
    if (result) {
      console.log('✅ Success')
    } else {
      console.log('❌ Failed - Management API requires different authentication')
      console.log('\n' + '='.repeat(70))
      console.log('Migration cannot be automated with current keys.')
      console.log('Please run manually in Supabase SQL Editor:')
      console.log('👉 https://supabase.com/dashboard/project/jereytrwxnuwcvzvqhbg/sql/new')
      console.log('='.repeat(70))
      console.log('\nSQL to execute:')
      console.log(SQL_STATEMENTS.join('\n'))
      process.exit(1)
    }
  }
  
  console.log('\n✅ All migrations completed successfully!')
}

main()
