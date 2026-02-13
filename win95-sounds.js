// Windows 95 Sound Effects Module
// Usage: import { playSound } from './win95-sounds.js'

const sounds = {
  startup: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj4xOsja'), // Shortened for example
  
  click: new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='),
  
  error: new Audio('data:audio/wav;base64,UklGRiQBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQEBAAD//wAA'),
  
  tada: new Audio('data:audio/wav;base64,UklGRiQBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQEBAAAAAAD//w=='),
  
  chimes: new Audio('data:audio/wav;base64,UklGRiQBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQEBAAAAAAD//w==')
}

// Preload all sounds
Object.values(sounds).forEach(audio => {
  audio.volume = 0.3
  audio.preload = 'auto'
})

export function playSound(soundName) {
  if (sounds[soundName]) {
    sounds[soundName].currentTime = 0
    sounds[soundName].play().catch(e => {
      // Browser blocked autoplay, that's fine
      console.log('Sound blocked:', soundName)
    })
  }
}

export function initSounds() {
  // Play startup sound when page loads (after user interaction)
  document.addEventListener('click', function onFirstClick() {
    playSound('startup')
    document.removeEventListener('click', onFirstClick)
  }, { once: true })
}

// Add event listeners for button clicks
export function addSoundEffects() {
  document.addEventListener('click', (e) => {
    if (e.target.matches('button') || e.target.closest('button')) {
      playSound('click')
    }
  })
  
  // Play tada on successful upvote
  window.addEventListener('upvote-success', () => playSound('tada'))
  
  // Play error on failure
  window.addEventListener('upvote-error', () => playSound('error'))
}

export default { playSound, initSounds, addSoundEffects }
