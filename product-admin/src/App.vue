<template>
  <a-config-provider :theme="antTheme">
    <div class="theme-switcher">
      <span>Light</span>
      <a-switch :checked="themeStore.isDarkMode" @change="themeStore.toggleTheme" />
      <span>Dark</span>
    </div>
    <router-view></router-view>
    <StagewiseToolbar v-if="isDevelopment" :config="stagewiseConfig" />
  </a-config-provider>
</template>

<script setup>
import { StagewiseToolbar } from '@stagewise/toolbar-vue'
import { ConfigProvider, theme, Switch as ASwitch } from 'ant-design-vue' // Renamed Switch to ASwitch
import { computed } from 'vue'
import { useThemeStore } from './stores/theme'

// Theme store
const themeStore = useThemeStore()
themeStore.initTheme() // Initialize theme from local storage

// Stagewise configuration
const stagewiseConfig = {
  plugins: []
}

// Only show toolbar in development mode
const isDevelopment = process.env.NODE_ENV === 'development'

// Computed Ant Design theme object
const antTheme = computed(() => ({
  algorithm: themeStore.isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm
}))

// Watch for theme changes to update body attribute for global styles
import { watchEffect } from 'vue'
watchEffect(() => {
  const body = document.body
  if (themeStore.isDarkMode) {
    body.setAttribute('data-theme', 'dark')
  } else {
    body.setAttribute('data-theme', 'light')
  }
})
</script>

<style>
#app {
  width: 100%;
  height: 100%;
}

body {
  margin: 0;
  padding: 0;
}

.theme-switcher {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 1000; /* Ensure it's above other content */
  background-color: #fff; /* Add a background for better visibility */
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); /* Optional: add some shadow */
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Style adjustments for dark theme switcher */
[data-theme="dark"] .theme-switcher {
  background-color: #141414; /* Dark background for dark theme */
  color: #fff; /* Light text for dark theme */
}
</style>
