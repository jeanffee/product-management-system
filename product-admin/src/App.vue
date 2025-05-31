<template>
  <router-view></router-view>
  <StagewiseToolbar v-if="isDevelopment" :config="stagewiseConfig" />
</template>

<script setup>
import { StagewiseToolbar } from '@stagewise/toolbar-vue'

// Stagewise configuration
const stagewiseConfig = {
  plugins: []
}

// Only show toolbar in development mode
const isDevelopment = process.env.NODE_ENV === 'development'
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
</style>
