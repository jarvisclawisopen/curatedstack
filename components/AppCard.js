/**
 * App Card Component - JavaScript
 * Standalone functions for rendering and interactivity
 */

/**
 * Create an app card element
 * @param {Object} app - App data from Supabase
 * @param {Object} options - Options {onUpvote, onRate, userVotes}
 * @returns {HTMLElement} App card element
 */
export function createAppCard(app, options = {}) {
  const {
    onUpvote = () => {},
    onRate = () => {},
    userVotes = {}
  } = options

  // Create card container
  const card = document.createElement('article')
  card.className = 'app-card'
  card.dataset.appId = app.id

  // Featured badge
  if (app.featured) {
    card.innerHTML += `
      <div class="app-card__badge" data-featured="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 1L10.163 5.38L15 6.12L11.5 9.545L12.326 14.355L8 12.065L3.674 14.355L4.5 9.545L1 6.12L5.837 5.38L8 1Z" fill="currentColor"/>
        </svg>
        Featured
      </div>
    `
  }

  // Logo
  const logo = document.createElement('div')
  logo.className = 'app-card__logo'
  logo.innerHTML = app.logo_url
    ? `<img src="${app.logo_url}" alt="${app.name} logo">`
    : `<div style="width:100%; height:100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display:flex; align-items:center; justify-content:center; font-size:2rem; font-weight:bold; color:white;">${app.name.charAt(0).toUpperCase()}</div>`
  card.appendChild(logo)

  // Content
  const content = document.createElement('div')
  content.className = 'app-card__content'
  
  const title = document.createElement('h3')
  title.className = 'app-card__title'
  title.textContent = app.name
  content.appendChild(title)
  
  const description = document.createElement('p')
  description.className = 'app-card__description'
  description.textContent = app.description || 'No description available.'
  content.appendChild(description)
  
  // Tags
  if (app.tags && app.tags.length > 0) {
    const tagsContainer = document.createElement('div')
    tagsContainer.className = 'app-card__tags'
    
    app.tags.slice(0, 3).forEach(tag => {
      const tagEl = document.createElement('span')
      tagEl.className = 'app-card__tag'
      tagEl.textContent = tag
      tagEl.onclick = (e) => {
        e.stopPropagation()
        // Emit tag click event
        card.dispatchEvent(new CustomEvent('tagClick', { detail: tag }))
      }
      tagsContainer.appendChild(tagEl)
    })
    
    content.appendChild(tagsContainer)
  }
  
  card.appendChild(content)

  // Footer
  const footer = document.createElement('div')
  footer.className = 'app-card__footer'
  
  // Upvote button
  const hasUpvoted = userVotes.upvoted || false
  const upvoteBtn = document.createElement('button')
  upvoteBtn.className = `app-card__upvote${hasUpvoted ? ' upvoted' : ''}`
  upvoteBtn.dataset.upvoteBtn = ''
  upvoteBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="upvote-icon">
      <path d="M10 3L13 9H17L12 13L14 19L10 15L6 19L8 13L3 9H7L10 3Z" fill="currentColor"/>
    </svg>
    <span data-upvote-count>${app.upvotes || 0}</span>
  `
  upvoteBtn.onclick = async (e) => {
    e.stopPropagation()
    e.preventDefault()
    
    if (hasUpvoted) return
    
    // Optimistic update
    upvoteBtn.classList.add('upvoted')
    const countEl = upvoteBtn.querySelector('[data-upvote-count]')
    countEl.textContent = parseInt(countEl.textContent) + 1
    
    // Call handler
    const result = await onUpvote(app.id)
    
    // Rollback on error
    if (!result.success) {
      upvoteBtn.classList.remove('upvoted')
      countEl.textContent = parseInt(countEl.textContent) - 1
    }
  }
  footer.appendChild(upvoteBtn)
  
  // Star rating
  const ratingContainer = document.createElement('div')
  ratingContainer.className = 'app-card__rating'
  
  const stars = document.createElement('div')
  stars.className = 'rating-stars'
  
  const userRating = userVotes.rating || null
  const avgRating = app.rating_count > 0 
    ? (app.rating_sum / app.rating_count).toFixed(1)
    : null
  
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('button')
    star.className = 'star'
    star.dataset.star = i
    star.textContent = '★'
    
    // Fill stars based on user rating or average
    if (userRating && i <= userRating) {
      star.classList.add('filled')
    } else if (!userRating && avgRating && i <= Math.round(parseFloat(avgRating))) {
      star.style.color = '#d1d5db' // Unfilled for average
    }
    
    star.onclick = async (e) => {
      e.stopPropagation()
      e.preventDefault()
      
      if (userRating) return // Already rated
      
      // Optimistic update
      stars.querySelectorAll('.star').forEach((s, idx) => {
        if (idx < i) {
          s.classList.add('filled')
        }
      })
      
      // Call handler
      const result = await onRate(app.id, i)
      
      // Rollback on error
      if (!result.success) {
        stars.querySelectorAll('.star').forEach(s => {
          s.classList.remove('filled')
        })
      } else {
        // Update rating value
        ratingValue.textContent = i.toFixed(1)
        ratingValue.classList.add('has-rating')
      }
    }
    
    stars.appendChild(star)
  }
  
  ratingContainer.appendChild(stars)
  
  const ratingValue = document.createElement('span')
  ratingValue.className = 'rating-value'
  if (avgRating) {
    ratingValue.textContent = avgRating
    ratingValue.classList.add('has-rating')
  } else {
    ratingValue.textContent = '—'
  }
  ratingContainer.appendChild(ratingValue)
  
  footer.appendChild(ratingContainer)
  card.appendChild(footer)

  // Link overlay
  const link = document.createElement('a')
  link.className = 'app-card__link'
  link.href = app.url
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  link.innerHTML = '<span class="sr-only">Visit ' + app.name + '</span>'
  card.appendChild(link)

  return card
}

/**
 * Create a loading skeleton card
 * @returns {HTMLElement} Skeleton card element
 */
export function createSkeletonCard() {
  const card = document.createElement('article')
  card.className = 'app-card skeleton'
  
  card.innerHTML = `
    <div class="app-card__logo"></div>
    <div class="app-card__content">
      <h3 class="app-card__title"></h3>
      <p class="app-card__description"></p>
      <div class="app-card__tags">
        <span class="app-card__tag" style="width: 60px;"></span>
        <span class="app-card__tag" style="width: 80px;"></span>
      </div>
    </div>
    <div class="app-card__footer">
      <button class="app-card__upvote"></button>
      <div class="app-card__rating">
        <div class="rating-stars"></div>
      </div>
    </div>
  `
  
  return card
}

/**
 * Render app grid
 * @param {Array} apps - Array of app objects
 * @param {HTMLElement} container - Container element
 * @param {Object} options - Options {onUpvote, onRate, userVotes}
 */
export function renderAppGrid(apps, container, options = {}) {
  container.innerHTML = ''
  container.className = 'app-grid'
  
  if (apps.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: #6b7280;">
        <p style="font-size: 1.125rem; font-weight: 500;">No apps found</p>
        <p style="margin-top: 0.5rem;">Try adjusting your filters</p>
      </div>
    `
    return
  }
  
  apps.forEach(app => {
    const card = createAppCard(app, {
      ...options,
      userVotes: options.userVotes?.[app.id] || {}
    })
    container.appendChild(card)
  })
}

/**
 * Show loading skeleton grid
 * @param {HTMLElement} container - Container element
 * @param {number} count - Number of skeleton cards
 */
export function showLoadingSkeleton(container, count = 6) {
  container.innerHTML = ''
  container.className = 'app-grid'
  
  for (let i = 0; i < count; i++) {
    container.appendChild(createSkeletonCard())
  }
}

/**
 * Animate card entrance (stagger effect)
 * @param {HTMLElement} container - Grid container
 */
export function animateCardsEntrance(container) {
  const cards = container.querySelectorAll('.app-card:not(.skeleton)')
  
  cards.forEach((card, index) => {
    card.style.opacity = '0'
    card.style.transform = 'translateY(20px)'
    
    setTimeout(() => {
      card.style.transition = 'opacity 0.4s, transform 0.4s'
      card.style.opacity = '1'
      card.style.transform = 'translateY(0)'
    }, index * 50) // 50ms stagger
  })
}

/**
 * Update card upvote count (external update)
 * @param {string} appId - App ID
 * @param {number} newCount - New upvote count
 */
export function updateCardUpvotes(appId, newCount) {
  const card = document.querySelector(`[data-app-id="${appId}"]`)
  if (!card) return
  
  const countEl = card.querySelector('[data-upvote-count]')
  if (countEl) {
    countEl.textContent = newCount
  }
}

/**
 * Update card rating (external update)
 * @param {string} appId - App ID
 * @param {number} newAvgRating - New average rating
 */
export function updateCardRating(appId, newAvgRating) {
  const card = document.querySelector(`[data-app-id="${appId}"]`)
  if (!card) return
  
  const ratingValue = card.querySelector('.rating-value')
  if (ratingValue) {
    ratingValue.textContent = newAvgRating.toFixed(1)
    ratingValue.classList.add('has-rating')
  }
}

/**
 * Example usage:
 * 
 * import { renderAppGrid, animateCardsEntrance } from './AppCard.js'
 * import { fetchApps, upvoteApp, rateApp, getUserFingerprint } from '../src/supabase-api.js'
 * 
 * const container = document.getElementById('app-grid')
 * const fingerprint = getUserFingerprint()
 * 
 * // Show loading
 * showLoadingSkeleton(container, 6)
 * 
 * // Fetch and render
 * const { data: apps } = await fetchApps()
 * renderAppGrid(apps, container, {
 *   onUpvote: async (appId) => {
 *     return await upvoteApp(appId, fingerprint)
 *   },
 *   onRate: async (appId, rating) => {
 *     return await rateApp(appId, rating, fingerprint)
 *   },
 *   userVotes: {} // Load from getUserVotes()
 * })
 * 
 * // Animate entrance
 * animateCardsEntrance(container)
 */

export default {
  createAppCard,
  createSkeletonCard,
  renderAppGrid,
  showLoadingSkeleton,
  animateCardsEntrance,
  updateCardUpvotes,
  updateCardRating
}
