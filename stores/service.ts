import { defineStore } from 'pinia'
import type { Service, ApiResponse, PaginatedResponse } from '~/types'

interface ServiceState {
  services: Service[]
  currentService: Service | null
  loading: boolean
  pagination: {
    currentPage: number
    lastPage: number
    perPage: number
    total: number
  }
}

export const useServiceStore = defineStore('service', {
  state: (): ServiceState => ({
    services: [],
    currentService: null,
    loading: false,
    pagination: {
      currentPage: 1,
      lastPage: 1,
      perPage: 10,
      total: 0,
    },
  }),

  actions: {
    async fetchServices(params?: { category_id?: number; page?: number }) {
      const api = useApi()
      this.loading = true
      
      try {
        const queryParams = new URLSearchParams()
        if (params?.category_id) queryParams.append('category_id', params.category_id.toString())
        if (params?.page) queryParams.append('page', params.page.toString())
        
        const url = `/services${queryParams.toString() ? '?' + queryParams.toString() : ''}`
        const response = await api.publicGet<PaginatedResponse<Service>>(url)
        this.services = response.data
        if (response.meta) {
          this.pagination = response.meta
        }
        return response.data
      } catch (error) {
        console.error('Fetch services error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchService(serviceId: number) {
      const api = useApi()
      this.loading = true
      
      try {
        const response = await api.publicGet<ApiResponse<Service>>(`/services/${serviceId}`)
        this.currentService = response.data
        return response.data
      } catch (error) {
        console.error('Fetch service error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchServiceAvailability(serviceId: number) {
      const api = useApi()
      this.loading = true
      
      try {
        const response = await api.publicGet<ApiResponse<any>>(`/services/${serviceId}/availability`)
        return response.data
      } catch (error) {
        console.error('Fetch service availability error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchProviderServices(providerId: number) {
      const api = useApi()
      this.loading = true
      
      try {
        const response = await api.get<ApiResponse<Service[]>>(`/providers/${providerId}/services`)
        return response.data
      } catch (error) {
        console.error('Fetch provider services error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
  },

  getters: {
    activeServices: (state) => state.services.filter(s => s.is_active),
    getServiceById: (state) => (id: number) => state.services.find(s => s.id === id),
  },
})
