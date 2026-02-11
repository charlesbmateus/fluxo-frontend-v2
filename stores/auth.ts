import { defineStore } from 'pinia'
import type { User } from '~/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
  }),

  actions: {
    async login(email: string, password: string) {
      const api = useApi()
      this.loading = true
      
      try {
        const response = await api.publicPost<{ token: string; user: User }>('/login', {
          email,
          password,
        })
        
        this.token = response.token
        this.user = response.user
        this.isAuthenticated = true
        
        if (process.client) {
          localStorage.setItem('fluxo_token', response.token)
        }
        
        return response
      } catch (error) {
        console.error('Login error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(name: string, email: string, password: string, passwordConfirmation: string) {
      const api = useApi()
      this.loading = true
      
      try {
        const response = await api.publicPost<{ token: string; user: User }>('/register', {
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        })
        
        this.token = response.token
        this.user = response.user
        this.isAuthenticated = true
        
        if (process.client) {
          localStorage.setItem('fluxo_token', response.token)
        }
        
        return response
      } catch (error) {
        console.error('Registration error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      const api = useApi()
      
      try {
        await api.post('/logout')
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.user = null
        this.token = null
        this.isAuthenticated = false
        
        if (process.client) {
          localStorage.removeItem('fluxo_token')
        }
      }
    },

    async fetchUser() {
      const api = useApi()
      this.loading = true
      
      try {
        const response = await api.get<{ data: User }>('/me')
        this.user = response.data
        this.isAuthenticated = true
        return response.data
      } catch (error) {
        console.error('Fetch user error:', error)
        this.logout()
        throw error
      } finally {
        this.loading = false
      }
    },

    initializeAuth() {
      if (process.client) {
        const token = localStorage.getItem('fluxo_token')
        if (token) {
          this.token = token
          this.fetchUser().catch(() => {
            this.logout()
          })
        }
      }
    },
  },
})
