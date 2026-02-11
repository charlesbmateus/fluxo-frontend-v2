import { defineStore } from 'pinia'
import type { Booking, ApiResponse, PaginatedResponse } from '~/types'

interface BookingState {
  bookings: Booking[]
  currentBooking: Booking | null
  loading: boolean
  pagination: {
    currentPage: number
    lastPage: number
    perPage: number
    total: number
  }
}

export const useBookingStore = defineStore('booking', {
  state: (): BookingState => ({
    bookings: [],
    currentBooking: null,
    loading: false,
    pagination: {
      currentPage: 1,
      lastPage: 1,
      perPage: 10,
      total: 0,
    },
  }),

  actions: {
    async createBooking(bookingData: {
      service_id: number
      booking_date: string
      start_time: string
      end_time: string
      notes?: string
    }) {
      const api = useApi()
      this.loading = true
      
      try {
        const response = await api.post<ApiResponse<Booking>>('/bookings', bookingData)
        this.bookings.unshift(response.data)
        return response.data
      } catch (error) {
        console.error('Create booking error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateBookingStatus(bookingId: number, status: string) {
      const api = useApi()
      this.loading = true
      
      try {
        const response = await api.patch<ApiResponse<Booking>>(`/bookings/${bookingId}/status`, { status })
        
        const index = this.bookings.findIndex(b => b.id === bookingId)
        if (index !== -1) {
          this.bookings[index] = response.data
        }
        
        if (this.currentBooking?.id === bookingId) {
          this.currentBooking = response.data
        }
        
        return response.data
      } catch (error) {
        console.error('Update booking status error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
  },

  getters: {
    pendingBookings: (state) => state.bookings.filter(b => b.status === 'pending'),
    confirmedBookings: (state) => state.bookings.filter(b => b.status === 'confirmed'),
    completedBookings: (state) => state.bookings.filter(b => b.status === 'completed'),
  },
})
