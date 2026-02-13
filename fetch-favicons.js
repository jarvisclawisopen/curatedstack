#!/usr/bin/env node

const SUPABASE_URL = 'https://jereytrwxnuwcvzvqhbg.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplcmV5dHJ3eG51d2N2enZxaGJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MjI1NzksImV4cCI6MjA4NjQ5ODU3OX0.r0RDnh75IGjECXMwMJNZR0oqF-cEubxbQbjXgavsJ_I'

async function fetchApps() {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/apps?select=id,name,url,logo_url&logo_url=is.null`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  })
  return await response.json()
}

function getFaviconUrl(websiteUrl) {
  try {
    const url = new URL(websiteUrl)
    // Try multiple favicon sources
    return [
      `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`,
      `${url.origin}/favicon.ico`,
      `https://icons.duckduckgo.com/ip3/${url.hostname}.ico`
    ][0] // Use Google's favicon service (most reliable)
  } catch (e) {
    return null
  }
}

async function updateAppLogo(appId, logoUrl) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/apps?id=eq.${appId}`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ logo_url: logoUrl })
  })
  
  return response.ok
}

async function main() {
  console.log('Fetching apps without logos...')
  const apps = await fetchApps()
  console.log(`Found ${apps.length} apps without logos`)
  
  let updated = 0
  let failed = 0
  
  for (const app of apps) {
    const faviconUrl = getFaviconUrl(app.url)
    
    if (faviconUrl) {
      const success = await updateAppLogo(app.id, faviconUrl)
      if (success) {
        console.log(`✅ ${app.name}: ${faviconUrl}`)
        updated++
      } else {
        console.log(`❌ ${app.name}: failed to update`)
        failed++
      }
    } else {
      console.log(`⚠️  ${app.name}: invalid URL`)
      failed++
    }
    
    // Rate limit: wait 100ms between requests
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  console.log(`\n✅ Updated: ${updated}`)
  console.log(`❌ Failed: ${failed}`)
}

main()
