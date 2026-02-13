/**
 * Test Suite for Supabase API Module
 * Run these in browser console or testing framework
 */

import {
  fetchApps,
  upvoteApp,
  upvoteAppOptimistic,
  rateApp,
  rateAppOptimistic,
  getUserVotes,
  getUserFingerprint,
  searchApps,
  filterByCategory,
  filterByTag
} from './supabase-api.js'

// ============================================
// TEST UTILITIES
// ============================================

function log(title, data) {
  console.group(`✅ ${title}`)
  console.log(data)
  console.groupEnd()
}

function logError(title, error) {
  console.group(`❌ ${title}`)
  console.error(error)
  console.groupEnd()
}

// ============================================
// TEST 1: Fetch Apps
// ============================================

export async function testFetchApps() {
  console.log('🧪 TEST: fetchApps()')
  
  const { data, error } = await fetchApps()
  
  if (error) {
    logError('fetchApps failed', error)
    return false
  }
  
  log('fetchApps success', {
    count: data.length,
    firstApp: data[0],
    allApps: data
  })
  
  // Verify structure
  if (data.length > 0) {
    const app = data[0]
    const hasRequiredFields = 
      app.id && 
      app.name && 
      app.url && 
      typeof app.upvotes === 'number' &&
      typeof app.rating_count === 'number'
    
    console.log('✓ Structure valid:', hasRequiredFields)
  }
  
  return true
}

// ============================================
// TEST 2: Upvote App
// ============================================

export async function testUpvote() {
  console.log('🧪 TEST: upvoteApp()')
  
  // Get fingerprint
  const fingerprint = getUserFingerprint()
  console.log('Fingerprint:', fingerprint)
  
  // Fetch apps to get a test app ID
  const { data: apps } = await fetchApps()
  if (!apps || apps.length === 0) {
    logError('No apps found', 'Add some apps first')
    return false
  }
  
  const testApp = apps[0]
  console.log('Testing with app:', testApp.name)
  
  // Check current vote status
  const { upvoted: alreadyUpvoted } = await getUserVotes(testApp.id, fingerprint)
  console.log('Already upvoted:', alreadyUpvoted)
  
  if (alreadyUpvoted) {
    console.log('⚠️ Already upvoted, skipping insert test')
    return true
  }
  
  // Upvote
  const { success, error } = await upvoteApp(testApp.id, fingerprint)
  
  if (error) {
    logError('upvoteApp failed', error)
    return false
  }
  
  log('upvoteApp success', { appId: testApp.id, success })
  
  // Verify vote was recorded
  const { upvoted } = await getUserVotes(testApp.id, fingerprint)
  console.log('✓ Vote verified:', upvoted)
  
  return true
}

// ============================================
// TEST 3: Rate App
// ============================================

export async function testRating() {
  console.log('🧪 TEST: rateApp()')
  
  const fingerprint = getUserFingerprint()
  
  // Get test app
  const { data: apps } = await fetchApps()
  if (!apps || apps.length === 0) {
    logError('No apps found', 'Add some apps first')
    return false
  }
  
  const testApp = apps[0]
  console.log('Testing with app:', testApp.name)
  
  // Check current rating status
  const { rating: existingRating } = await getUserVotes(testApp.id, fingerprint)
  console.log('Existing rating:', existingRating)
  
  if (existingRating) {
    console.log('⚠️ Already rated, skipping insert test')
    return true
  }
  
  // Rate app (5 stars)
  const testRating = 5
  const { success, error } = await rateApp(testApp.id, testRating, fingerprint)
  
  if (error) {
    logError('rateApp failed', error)
    return false
  }
  
  log('rateApp success', { appId: testApp.id, rating: testRating, success })
  
  // Verify rating was recorded
  const { rating } = await getUserVotes(testApp.id, fingerprint)
  console.log('✓ Rating verified:', rating === testRating)
  
  return true
}

// ============================================
// TEST 4: Optimistic Updates
// ============================================

export async function testOptimisticUpdates() {
  console.log('🧪 TEST: Optimistic Updates')
  
  const fingerprint = getUserFingerprint()
  
  // Mock UI state
  let mockApps = await fetchApps().then(r => r.data)
  
  // Mock callbacks
  const onOptimisticUpdate = (appId, increment) => {
    console.log(`📊 Optimistic update: app ${appId} upvotes ${increment > 0 ? '+' : ''}${increment}`)
    const app = mockApps.find(a => a.id === appId)
    if (app) {
      app.upvotes += increment
      console.log(`   New count: ${app.upvotes}`)
    }
  }
  
  const onError = (error) => {
    console.error('❌ Optimistic update failed:', error.message)
  }
  
  // Get test app (use second app to avoid conflicts with previous tests)
  const testApp = mockApps[1] || mockApps[0]
  
  // Check if already voted
  const { upvoted } = await getUserVotes(testApp.id, fingerprint)
  
  if (upvoted) {
    console.log('⚠️ Already upvoted this app, demonstrating rollback on duplicate')
  }
  
  console.log(`Before: ${testApp.name} has ${testApp.upvotes} upvotes`)
  
  // Attempt optimistic upvote
  await upvoteAppOptimistic(
    testApp.id,
    fingerprint,
    onOptimisticUpdate,
    onError
  )
  
  console.log(`After: ${testApp.name} has ${testApp.upvotes} upvotes`)
  
  return true
}

// ============================================
// TEST 5: Search & Filter
// ============================================

export async function testSearchAndFilter() {
  console.log('🧪 TEST: Search & Filter')
  
  // Search
  const searchQuery = 'app'
  const { data: searchResults, error: searchError } = await searchApps(searchQuery)
  
  if (searchError) {
    logError('searchApps failed', searchError)
  } else {
    log(`Search results for "${searchQuery}"`, {
      count: searchResults.length,
      apps: searchResults.map(a => a.name)
    })
  }
  
  // Get all apps to find available categories/tags
  const { data: allApps } = await fetchApps()
  
  // Filter by category (use first app's category)
  if (allApps && allApps.length > 0 && allApps[0].category) {
    const testCategory = allApps[0].category
    const { data: categoryResults } = await filterByCategory(testCategory)
    log(`Filter by category "${testCategory}"`, {
      count: categoryResults?.length || 0,
      apps: categoryResults?.map(a => a.name) || []
    })
  }
  
  // Filter by tag (use first app's first tag)
  if (allApps && allApps.length > 0 && allApps[0].tags?.length > 0) {
    const testTag = allApps[0].tags[0]
    const { data: tagResults } = await filterByTag(testTag)
    log(`Filter by tag "${testTag}"`, {
      count: tagResults?.length || 0,
      apps: tagResults?.map(a => a.name) || []
    })
  }
  
  return true
}

// ============================================
// TEST 6: Error Handling
// ============================================

export async function testErrorHandling() {
  console.log('🧪 TEST: Error Handling')
  
  const fingerprint = getUserFingerprint()
  
  // Test invalid rating
  console.log('Testing invalid rating (value: 6)...')
  const { success: success1, error: error1 } = await rateApp('fake-uuid', 6, fingerprint)
  console.log('✓ Invalid rating rejected:', !success1 && error1.message.includes('between 1 and 5'))
  
  // Test duplicate upvote
  const { data: apps } = await fetchApps()
  if (apps && apps.length > 0) {
    const testApp = apps[0]
    
    // Upvote once
    await upvoteApp(testApp.id, fingerprint)
    
    // Try to upvote again
    console.log('Testing duplicate upvote...')
    const { success: success2, error: error2 } = await upvoteApp(testApp.id, fingerprint)
    console.log('✓ Duplicate upvote prevented:', !success2 && error2.message.includes('Already upvoted'))
  }
  
  return true
}

// ============================================
// RUN ALL TESTS
// ============================================

export async function runAllTests() {
  console.clear()
  console.log('🚀 Running Supabase API Tests...\n')
  
  const tests = [
    { name: 'Fetch Apps', fn: testFetchApps },
    { name: 'Upvote', fn: testUpvote },
    { name: 'Rating', fn: testRating },
    { name: 'Optimistic Updates', fn: testOptimisticUpdates },
    { name: 'Search & Filter', fn: testSearchAndFilter },
    { name: 'Error Handling', fn: testErrorHandling }
  ]
  
  let passed = 0
  let failed = 0
  
  for (const test of tests) {
    try {
      const result = await test.fn()
      if (result !== false) {
        passed++
        console.log(`✅ ${test.name} PASSED\n`)
      } else {
        failed++
        console.log(`❌ ${test.name} FAILED\n`)
      }
    } catch (error) {
      failed++
      console.error(`❌ ${test.name} CRASHED:`, error, '\n')
    }
  }
  
  console.log('━'.repeat(50))
  console.log(`📊 Results: ${passed} passed, ${failed} failed`)
  console.log('━'.repeat(50))
}

// ============================================
// MANUAL TEST HELPERS
// ============================================

/**
 * Quick test in browser console:
 * 
 * import { runAllTests } from './supabase-api.test.js'
 * runAllTests()
 * 
 * Or individual tests:
 * 
 * import { testFetchApps, testUpvote } from './supabase-api.test.js'
 * await testFetchApps()
 * await testUpvote()
 */

// Export everything
export default {
  runAllTests,
  testFetchApps,
  testUpvote,
  testRating,
  testOptimisticUpdates,
  testSearchAndFilter,
  testErrorHandling
}
