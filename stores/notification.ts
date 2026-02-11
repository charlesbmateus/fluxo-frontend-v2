import { defineStore } from 'pinia'
import type { Notification, ApiResponse, PaginatedResponse } from '~/types'

interface NotificationState {
  notifications: Notification[]
  loading: boolean
  pagination: {
    currentPage: number
    lastPage: number
    perPage: number
    total: number
  }
}

export const useNotificationStore = defineStore('notification', {
  state: (): NotificationState => ({
    notifications: [],
    loading: false,
    pagination: {
      currentPage: 1,
      lastPage: 1,
      perPage: 10,
      total: 0,
    },
  }),

  actions: {
    async fetchNotifications(page: number = 1) {
      const api = useApi()
      this.loading = true
      
      try {
        const response = await api.get<PaginatedResponse<Notification>>(`/notifications?page=${page}`)
        this.notifications = response.data
        this.pagination = response.meta
        return response.data
      } catch (error) {
        console.error('Fetch notifications error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async markAsRead(notificationId: number) {
      const api = useApi()
      
      try {
        await api.patch(`/notifications/${notificationId}/read`)
        
        const notification = this.notifications.find(n => n.id === notificationId)
        if (notification) {
          notification.read_at = new Date().toISOString()
        }
      } catch (error) {
        console.error('Mark notification as read error:', error)
        throw error
      }
    },
  },

  getters: {
    unreadNotifications: (state) => state.notifications.filter(n => !n.read_at),
    unreadCount: (state) => state.notifications.filter(n => !n.read_at).length,
  },
})
