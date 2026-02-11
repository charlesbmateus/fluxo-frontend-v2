<template>
  <div>
    <NConfigProvider :theme="theme">
      <NMessageProvider>
        <NNotificationProvider>
          <NDialogProvider>
            <slot />
          </NDialogProvider>
        </NNotificationProvider>
      </NMessageProvider>
    </NConfigProvider>
  </div>
</template>

<script setup lang="ts">
import { darkTheme } from 'naive-ui'

const isDark = useState('isDark', () => false)

const theme = computed(() => isDark.value ? darkTheme : null)

// Initialize theme from localStorage
onMounted(() => {
  if (process.client) {
    const savedTheme = localStorage.getItem('fluxo_theme')
    isDark.value = savedTheme === 'dark'
    
    // Apply theme to body
    if (isDark.value) {
      document.body.classList.add('dark')
    }
  }
})

// Watch for theme changes
watch(isDark, (newValue) => {
  if (process.client) {
    localStorage.setItem('fluxo_theme', newValue ? 'dark' : 'light')
    if (newValue) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }
})
</script>
