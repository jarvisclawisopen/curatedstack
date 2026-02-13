/**
 * Supabase API Module - App Directory
 * Handles all database operations with optimistic updates & error handling
 */

import { createClient } from '@supabase/supabase-js'

// ============================================
// CONFIG - Replace with your credentials
// ============================================
const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co'
const SUPABASE_ANON_KEY = 'YOUR-ANON-PUBLIC-KEY-HERE'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ============================================
// FINGERPRINT - Browser identification
// ============================================

/**
 * Generate persistent browser fingerprint
 * Stores in localStorage for consistency
 */
export function getUserFingerprint() {
  const STORAGE_KEY = 'app_directory_fingerprint'
  
  // Check if already exists
  let fingerprint = localStorage.getItem(STORAGE_KEY)
  
  if (!fingerprint) {
    // Generate new fingerprint
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 'unknown'
    ].join('|')
    
    // Simple hash
    fingerprint = hashString(components)
    localStorage.setItem(STORAGE_KEY, fingerprint)
  }
  
  return fingerprint
}

function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}

// ============================================
// FETCH APPS
// ============================================

/**
 * Fetch all apps sorted by created_at descending
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export async function fetchApps() {
  try {
    const { data, error } = await supabase
      .from('apps')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    // Calculate average rating for each app
    const appsWithRating = data.map(app => ({
      ...app,
      avg_rating: app.rating_count > 0 
        ? (app.rating_sum / app.rating_count).toFixed(1) 
        : null
    }))
    
    return { data: appsWithRating, error: null }
    
  } catch (error) {
    console.error('fetchApps error:', error)
    return { data: null, error }
  }
}

/**
 * Fetch apps with pagination
 * @param {number} page - Page number (0-indexed)
 * @param {number} perPage - Items per page
 * @returns {Promise<{data: Array, total: number, error: Error|null}>}
 */
export async function fetchAppsPaginated(page = 0, perPage = 20) {
  try {
    const from = page * perPage
    const to = from + perPage - 1
    
    const { data, error, count } = await supabase
      .from('apps')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)
    
    if (error) throw error
    
    const appsWithRating = data.map(app => ({
      ...app,
      avg_rating: app.rating_count > 0 
        ? (app.rating_sum / app.rating_count).toFixed(1) 
        : null
    }))
    
    return { data: appsWithRating, total: count, error: null }
    
  } catch (error) {
    console.error('fetchAppsPaginated error:', error)
    return { data: null, total: 0, error }
  }
}

// ============================================
// UPVOTE APP - with optimistic update
// ============================================

/**
 * Upvote an app (optimistic update pattern)
 * @param {string} appId - App UUID
 * @param {string} fingerprint - User fingerprint
 * @returns {Promise<{success: boolean, error: Error|null}>}
 */
export async function upvoteApp(appId, fingerprint) {
  try {
    // 1. Check if already upvoted
    const { data: existingVote } = await supabase
      .from('votes')
      .select('id')
      .eq('app_id', appId)
      .eq('user_fingerprint', fingerprint)
      .eq('vote_type', 'upvote')
      .maybeSingle()
    
    if (existingVote) {
      return { 
        success: false, 
        error: new Error('Already upvoted') 
      }
    }
    
    // 2. Insert upvote (trigger auto-updates app.upvotes)
    const { error: insertError } = await supabase
      .from('votes')
      .insert({
        app_id: appId,
        user_fingerprint: fingerprint,
        vote_type: 'upvote'
      })
    
    if (insertError) throw insertError
    
    return { success: true, error: null }
    
  } catch (error) {
    console.error('upvoteApp error:', error)
    return { success: false, error }
  }
}

/**
 * Optimistic upvote - updates UI immediately, rolls back on error
 * @param {string} appId 
 * @param {string} fingerprint 
 * @param {Function} onOptimisticUpdate - Callback(appId, increment)
 * @param {Function} onError - Callback(error)
 */
export async function upvoteAppOptimistic(
  appId, 
  fingerprint, 
  onOptimisticUpdate,
  onError
) {
  // Optimistically increment UI
  onOptimisticUpdate(appId, +1)
  
  const { success, error } = await upvoteApp(appId, fingerprint)
  
  if (!success) {
    // Rollback on error
    onOptimisticUpdate(appId, -1)
    onError(error)
  }
  
  return { success, error }
}

// ============================================
// RATE APP - with optimistic update
// ============================================

/**
 * Rate an app (1-5 stars)
 * @param {string} appId - App UUID
 * @param {number} rating - Rating value (1-5)
 * @param {string} fingerprint - User fingerprint
 * @returns {Promise<{success: boolean, error: Error|null}>}
 */
export async function rateApp(appId, rating, fingerprint) {
  try {
    // Validate rating
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5')
    }
    
    // 1. Check if already rated
    const { data: existingRating } = await supabase
      .from('votes')
      .select('id')
      .eq('app_id', appId)
      .eq('user_fingerprint', fingerprint)
      .eq('vote_type', 'rating')
      .maybeSingle()
    
    if (existingRating) {
      return { 
        success: false, 
        error: new Error('Already rated') 
      }
    }
    
    // 2. Insert rating (trigger auto-updates app.rating_sum/count)
    const { error: insertError } = await supabase
      .from('votes')
      .insert({
        app_id: appId,
        user_fingerprint: fingerprint,
        vote_type: 'rating',
        rating_value: rating
      })
    
    if (insertError) throw insertError
    
    return { success: true, error: null }
    
  } catch (error) {
    console.error('rateApp error:', error)
    return { success: false, error }
  }
}

/**
 * Optimistic rating - updates UI immediately, rolls back on error
 * @param {string} appId 
 * @param {number} rating 
 * @param {string} fingerprint 
 * @param {Function} onOptimisticUpdate - Callback(appId, newRating)
 * @param {Function} onError - Callback(error)
 */
export async function rateAppOptimistic(
  appId, 
  rating, 
  fingerprint,
  onOptimisticUpdate,
  onError
) {
  // Optimistically update UI
  onOptimisticUpdate(appId, rating)
  
  const { success, error } = await rateApp(appId, rating, fingerprint)
  
  if (!success) {
    // Rollback on error
    onOptimisticUpdate(appId, null)
    onError(error)
  }
  
  return { success, error }
}

// ============================================
// CHECK USER VOTES
// ============================================

/**
 * Get user's votes for an app
 * @param {string} appId 
 * @param {string} fingerprint 
 * @returns {Promise<{upvoted: boolean, rating: number|null, error: Error|null}>}
 */
export async function getUserVotes(appId, fingerprint) {
  try {
    const { data, error } = await supabase
      .from('votes')
      .select('vote_type, rating_value')
      .eq('app_id', appId)
      .eq('user_fingerprint', fingerprint)
    
    if (error) throw error
    
    const upvoted = data?.some(v => v.vote_type === 'upvote') || false
    const ratingVote = data?.find(v => v.vote_type === 'rating')
    const rating = ratingVote?.rating_value || null
    
    return { upvoted, rating, error: null }
    
  } catch (error) {
    console.error('getUserVotes error:', error)
    return { upvoted: false, rating: null, error }
  }
}

// ============================================
// SEARCH & FILTER
// ============================================

/**
 * Search apps by name or description
 * @param {string} query - Search query
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export async function searchApps(query) {
  try {
    const { data, error } = await supabase
      .from('apps')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('upvotes', { ascending: false })
    
    if (error) throw error
    
    return { data, error: null }
    
  } catch (error) {
    console.error('searchApps error:', error)
    return { data: null, error }
  }
}

/**
 * Filter apps by category
 * @param {string} category 
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export async function filterByCategory(category) {
  try {
    const { data, error } = await supabase
      .from('apps')
      .select('*')
      .eq('category', category)
      .order('upvotes', { ascending: false })
    
    if (error) throw error
    
    return { data, error: null }
    
  } catch (error) {
    console.error('filterByCategory error:', error)
    return { data: null, error }
  }
}

/**
 * Filter apps by tag
 * @param {string} tag 
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export async function filterByTag(tag) {
  try {
    const { data, error } = await supabase
      .from('apps')
      .select('*')
      .contains('tags', [tag])
      .order('upvotes', { ascending: false })
    
    if (error) throw error
    
    return { data, error: null }
    
  } catch (error) {
    console.error('filterByTag error:', error)
    return { data: null, error }
  }
}

// ============================================
// EXPORTS
// ============================================

export default {
  // Core functions
  fetchApps,
  fetchAppsPaginated,
  upvoteApp,
  upvoteAppOptimistic,
  rateApp,
  rateAppOptimistic,
  getUserVotes,
  getUserFingerprint,
  
  // Search & filter
  searchApps,
  filterByCategory,
  filterByTag,
  
  // Direct supabase access (for custom queries)
  supabase
}
