/**
 * React Hook for App Directory
 * Manages apps state with optimistic updates
 */

import { useState, useEffect, useCallback } from 'react'
import {
  fetchApps,
  upvoteApp,
  rateApp,
  getUserVotes,
  getUserFingerprint,
  searchApps,
  filterByCategory,
  filterByTag
} from './supabase-api.js'

/**
 * Main hook for app directory
 * @param {Object} options - Configuration options
 * @param {string} options.sortBy - Sort field (created_at, upvotes, rating)
 * @param {string} options.category - Filter by category
 * @param {string} options.tag - Filter by tag
 * @param {string} options.searchQuery - Search query
 * @returns {Object} Apps state and actions
 */
export function useApps(options = {}) {
  const {
    sortBy = 'created_at',
    category = null,
    tag = null,
    searchQuery = null
  } = options

  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userVotes, setUserVotes] = useState({}) // { appId: { upvoted, rating } }
  
  const fingerprint = getUserFingerprint()

  // Load apps
  const loadApps = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      let result
      
      // Apply filters/search
      if (searchQuery) {
        result = await searchApps(searchQuery)
      } else if (category) {
        result = await filterByCategory(category)
      } else if (tag) {
        result = await filterByTag(tag)
      } else {
        result = await fetchApps()
      }
      
      if (result.error) throw result.error
      
      // Sort
      const sorted = sortApps(result.data, sortBy)
      setApps(sorted)
      
      // Load user votes for all apps
      await loadUserVotes(sorted)
      
    } catch (err) {
      setError(err)
      console.error('Failed to load apps:', err)
    } finally {
      setLoading(false)
    }
  }, [sortBy, category, tag, searchQuery])

  // Load user's votes for all apps
  const loadUserVotes = async (appList) => {
    const votes = {}
    
    for (const app of appList) {
      const { upvoted, rating } = await getUserVotes(app.id, fingerprint)
      votes[app.id] = { upvoted, rating }
    }
    
    setUserVotes(votes)
  }

  // Sort apps
  const sortApps = (appList, field) => {
    const sorted = [...appList]
    
    switch (field) {
      case 'upvotes':
        return sorted.sort((a, b) => b.upvotes - a.upvotes)
      
      case 'rating':
        return sorted.sort((a, b) => {
          const ratingA = a.rating_count > 0 ? a.rating_sum / a.rating_count : 0
          const ratingB = b.rating_count > 0 ? b.rating_sum / b.rating_count : 0
          return ratingB - ratingA
        })
      
      case 'created_at':
      default:
        return sorted.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        )
    }
  }

  // Upvote with optimistic update
  const handleUpvote = async (appId) => {
    // Check if already upvoted
    if (userVotes[appId]?.upvoted) {
      setError(new Error('Already upvoted'))
      return { success: false }
    }
    
    // Optimistic update
    setApps(prev => prev.map(app => 
      app.id === appId 
        ? { ...app, upvotes: app.upvotes + 1 }
        : app
    ))
    
    setUserVotes(prev => ({
      ...prev,
      [appId]: { ...prev[appId], upvoted: true }
    }))
    
    // API call
    const { success, error } = await upvoteApp(appId, fingerprint)
    
    if (!success) {
      // Rollback on error
      setApps(prev => prev.map(app => 
        app.id === appId 
          ? { ...app, upvotes: app.upvotes - 1 }
          : app
      ))
      
      setUserVotes(prev => ({
        ...prev,
        [appId]: { ...prev[appId], upvoted: false }
      }))
      
      setError(error)
    }
    
    return { success, error }
  }

  // Rate with optimistic update
  const handleRate = async (appId, rating) => {
    // Check if already rated
    if (userVotes[appId]?.rating) {
      setError(new Error('Already rated'))
      return { success: false }
    }
    
    // Optimistic update
    setApps(prev => prev.map(app => 
      app.id === appId 
        ? { 
            ...app, 
            rating_sum: app.rating_sum + rating,
            rating_count: app.rating_count + 1
          }
        : app
    ))
    
    setUserVotes(prev => ({
      ...prev,
      [appId]: { ...prev[appId], rating }
    }))
    
    // API call
    const { success, error } = await rateApp(appId, rating, fingerprint)
    
    if (!success) {
      // Rollback on error
      setApps(prev => prev.map(app => 
        app.id === appId 
          ? { 
              ...app, 
              rating_sum: app.rating_sum - rating,
              rating_count: app.rating_count - 1
            }
          : app
      ))
      
      setUserVotes(prev => ({
        ...prev,
        [appId]: { ...prev[appId], rating: null }
      }))
      
      setError(error)
    }
    
    return { success, error }
  }

  // Refresh apps
  const refresh = () => {
    loadApps()
  }

  // Load on mount and when filters change
  useEffect(() => {
    loadApps()
  }, [loadApps])

  return {
    apps,
    loading,
    error,
    userVotes,
    upvote: handleUpvote,
    rate: handleRate,
    refresh
  }
}

/**
 * Hook for single app
 * @param {string} appId 
 */
export function useApp(appId) {
  const [app, setApp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    async function loadApp() {
      try {
        const { data } = await fetchApps()
        const foundApp = data.find(a => a.id === appId)
        setApp(foundApp || null)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    
    loadApp()
  }, [appId])
  
  return { app, loading, error }
}

/**
 * Example usage in component:
 * 
 * function AppList() {
 *   const { apps, loading, error, upvote, rate, userVotes } = useApps({
 *     sortBy: 'upvotes'
 *   })
 * 
 *   if (loading) return <div>Loading...</div>
 *   if (error) return <div>Error: {error.message}</div>
 * 
 *   return (
 *     <div>
 *       {apps.map(app => (
 *         <AppCard
 *           key={app.id}
 *           app={app}
 *           onUpvote={() => upvote(app.id)}
 *           onRate={(rating) => rate(app.id, rating)}
 *           hasUpvoted={userVotes[app.id]?.upvoted}
 *           userRating={userVotes[app.id]?.rating}
 *         />
 *       ))}
 *     </div>
 *   )
 * }
 */
