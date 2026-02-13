// ============================================
// Supabase Client - Usage Examples
// ============================================
// How to connect and query from frontend
// ============================================

import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = 'https://YOUR-PROJECT.supabase.co'
const supabaseAnonKey = 'YOUR-ANON-KEY'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================
// FETCH APPS
// ============================================

// Get all apps (sorted by upvotes)
async function getAllApps() {
  const { data, error } = await supabase
    .from('apps')
    .select('*')
    .order('upvotes', { ascending: false })
  
  if (error) console.error(error)
  return data
}

// Get apps with pagination
async function getAppsPaginated(page = 0, perPage = 20) {
  const from = page * perPage
  const to = from + perPage - 1
  
  const { data, error, count } = await supabase
    .from('apps')
    .select('*', { count: 'exact' })
    .order('upvotes', { ascending: false })
    .range(from, to)
  
  return { apps: data, total: count, error }
}

// Search apps by name/description
async function searchApps(query) {
  const { data, error } = await supabase
    .from('apps')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
  
  return { data, error }
}

// Filter by category
async function getAppsByCategory(category) {
  const { data, error } = await supabase
    .from('apps')
    .select('*')
    .eq('category', category)
    .order('upvotes', { ascending: false })
  
  return { data, error }
}

// Filter by tag
async function getAppsByTag(tag) {
  const { data, error } = await supabase
    .from('apps')
    .select('*')
    .contains('tags', [tag])
  
  return { data, error }
}

// Get featured apps
async function getFeaturedApps() {
  const { data, error } = await supabase
    .from('apps')
    .select('*')
    .eq('featured', true)
    .order('upvotes', { ascending: false })
  
  return { data, error }
}

// Get single app by ID
async function getAppById(appId) {
  const { data, error } = await supabase
    .from('apps')
    .select('*')
    .eq('id', appId)
    .single()
  
  return { data, error }
}

// ============================================
// VOTING & RATING
// ============================================

// Check if user already voted
async function checkUserVote(appId, fingerprint, voteType = 'upvote') {
  const { data, error } = await supabase
    .from('votes')
    .select('*')
    .eq('app_id', appId)
    .eq('user_fingerprint', fingerprint)
    .eq('vote_type', voteType)
    .maybeSingle()
  
  return { hasVoted: !!data, error }
}

// Add upvote
async function addUpvote(appId, fingerprint) {
  // Check if already voted
  const { hasVoted } = await checkUserVote(appId, fingerprint, 'upvote')
  if (hasVoted) {
    return { error: 'Already upvoted' }
  }
  
  // Insert vote (trigger will auto-update apps.upvotes)
  const { data, error } = await supabase
    .from('votes')
    .insert({
      app_id: appId,
      user_fingerprint: fingerprint,
      vote_type: 'upvote'
    })
  
  return { data, error }
}

// Add rating
async function addRating(appId, fingerprint, ratingValue) {
  // Validate rating (1-5)
  if (ratingValue < 1 || ratingValue > 5) {
    return { error: 'Rating must be between 1 and 5' }
  }
  
  // Check if already rated
  const { hasVoted } = await checkUserVote(appId, fingerprint, 'rating')
  if (hasVoted) {
    return { error: 'Already rated' }
  }
  
  // Insert rating (trigger will auto-update apps.rating_sum/count)
  const { data, error } = await supabase
    .from('votes')
    .insert({
      app_id: appId,
      user_fingerprint: fingerprint,
      vote_type: 'rating',
      rating_value: ratingValue
    })
  
  return { data, error }
}

// Get user's votes for an app
async function getUserVotesForApp(appId, fingerprint) {
  const { data, error } = await supabase
    .from('votes')
    .select('*')
    .eq('app_id', appId)
    .eq('user_fingerprint', fingerprint)
  
  const upvoted = data?.some(v => v.vote_type === 'upvote')
  const rating = data?.find(v => v.vote_type === 'rating')?.rating_value
  
  return { upvoted, rating, error }
}

// ============================================
// ADMIN FUNCTIONS (for adding apps)
// ============================================

// Add new app
async function addApp(appData) {
  const { data, error } = await supabase
    .from('apps')
    .insert({
      name: appData.name,
      description: appData.description,
      url: appData.url,
      logo_url: appData.logo_url || null,
      screenshot_url: appData.screenshot_url || null,
      category: appData.category,
      tags: appData.tags || [],
      featured: appData.featured || false
    })
    .select()
    .single()
  
  return { data, error }
}

// Update app
async function updateApp(appId, updates) {
  const { data, error } = await supabase
    .from('apps')
    .update(updates)
    .eq('id', appId)
    .select()
    .single()
  
  return { data, error }
}

// Delete app (will cascade delete votes)
async function deleteApp(appId) {
  const { error } = await supabase
    .from('apps')
    .delete()
    .eq('id', appId)
  
  return { error }
}

// ============================================
// UTILITY: Browser Fingerprint
// ============================================
// Simple fingerprint for MVP (use library like FingerprintJS for production)

function generateFingerprint() {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx.textBaseline = 'top'
  ctx.font = '14px Arial'
  ctx.fillText('fingerprint', 2, 2)
  
  const data = canvas.toDataURL()
  
  // Combine with other browser data
  const fingerprint = `${data}-${navigator.userAgent}-${screen.width}x${screen.height}`
  
  // Hash it (simple hash for demo)
  let hash = 0
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  
  return hash.toString(36)
}

// Store in localStorage to keep consistent across sessions
function getUserFingerprint() {
  let fingerprint = localStorage.getItem('user_fingerprint')
  if (!fingerprint) {
    fingerprint = generateFingerprint()
    localStorage.setItem('user_fingerprint', fingerprint)
  }
  return fingerprint
}

// ============================================
// EXAMPLE USAGE IN REACT COMPONENT
// ============================================

/*
import { useEffect, useState } from 'react'

function AppList() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const fingerprint = getUserFingerprint()

  useEffect(() => {
    loadApps()
  }, [])

  async function loadApps() {
    const data = await getAllApps()
    setApps(data)
    setLoading(false)
  }

  async function handleUpvote(appId) {
    const { error } = await addUpvote(appId, fingerprint)
    if (error) {
      alert(error)
      return
    }
    // Refresh apps to show updated count
    loadApps()
  }

  async function handleRating(appId, rating) {
    const { error } = await addRating(appId, fingerprint, rating)
    if (error) {
      alert(error)
      return
    }
    loadApps()
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {apps.map(app => (
        <div key={app.id}>
          <h2>{app.name}</h2>
          <p>{app.description}</p>
          <p>Upvotes: {app.upvotes}</p>
          <p>Rating: {app.rating_count > 0 ? (app.rating_sum / app.rating_count).toFixed(1) : 'No ratings'}</p>
          <button onClick={() => handleUpvote(app.id)}>Upvote</button>
          <button onClick={() => handleRating(app.id, 5)}>Rate 5⭐</button>
        </div>
      ))}
    </div>
  )
}
*/

// ============================================
// Export functions
// ============================================
export {
  supabase,
  getAllApps,
  getAppsPaginated,
  searchApps,
  getAppsByCategory,
  getAppsByTag,
  getFeaturedApps,
  getAppById,
  checkUserVote,
  addUpvote,
  addRating,
  getUserVotesForApp,
  addApp,
  updateApp,
  deleteApp,
  getUserFingerprint
}
