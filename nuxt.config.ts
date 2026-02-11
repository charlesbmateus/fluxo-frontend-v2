// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  css: [
    '@/assets/css/main.css',
  ],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api/v1',
      apiPublic: process.env.NUXT_PUBLIC_API_PUBLIC || 'http://localhost:8000/api',
    }
  },

  app: {
    head: {
      title: 'Fluxo - Modern Marketplace Dashboard',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Modern marketplace dashboard built with Nuxt, Pinia, and Naive UI' }
      ],
    }
  }
})
