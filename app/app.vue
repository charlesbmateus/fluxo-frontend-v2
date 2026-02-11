<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const { initializeCurrency } = useCurrency()

// Initialize auth and currency on app mount
onMounted(() => {
  authStore.initializeAuth()
  initializeCurrency()
})
</script>
