export default defineNuxtPlugin(() => {
  if (process.client) {
    // Initialize auth from localStorage
    const authStore = useAuthStore()
    authStore.initializeAuth()
    
    // Initialize currency preference
    const { initializeCurrency } = useCurrency()
    initializeCurrency()
  }
})
