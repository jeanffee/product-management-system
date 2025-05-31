import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // State
  const currentTheme = ref('light') // Default theme

  // Getters
  const isDarkMode = computed(() => currentTheme.value === 'dark')

  // Actions
  function toggleTheme() {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', currentTheme.value)
  }

  function initTheme() {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      currentTheme.value = savedTheme
    }
    // If no saved theme, it defaults to 'light' as initialized in currentTheme ref
  }

  return {
    currentTheme,
    isDarkMode,
    toggleTheme,
    initTheme
  }
})
