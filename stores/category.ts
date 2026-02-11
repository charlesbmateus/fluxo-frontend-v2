import { defineStore } from 'pinia'
import type { Category, ApiResponse } from '~/types'

interface CategoryState {
  categories: Category[]
  currentCategory: Category | null
  loading: boolean
}

export const useCategoryStore = defineStore('category', {
  state: (): CategoryState => ({
    categories: [],
    currentCategory: null,
    loading: false,
  }),

  actions: {
    async fetchCategories() {
      const api = useApi()
      this.loading = true
      
      try {
        const response = await api.publicGet<ApiResponse<Category[]>>('/categories')
        this.categories = response.data
        return response.data
      } catch (error) {
        console.error('Fetch categories error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCategoryBySlug(slug: string) {
      const api = useApi()
      this.loading = true
      
      try {
        const response = await api.publicGet<ApiResponse<Category>>(`/categories/${slug}`)
        this.currentCategory = response.data
        return response.data
      } catch (error) {
        console.error('Fetch category error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
  },

  getters: {
    getCategoryById: (state) => (id: number) => state.categories.find(c => c.id === id),
    getCategoryBySlug: (state) => (slug: string) => state.categories.find(c => c.slug === slug),
  },
})
