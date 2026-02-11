import { defineStore } from 'pinia'
import type { Conversation, ChatMessage, ApiResponse, PaginatedResponse } from '~/types'

interface ChatState {
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: ChatMessage[]
  loading: boolean
  loadingMessages: boolean
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    conversations: [],
    currentConversation: null,
    messages: [],
    loading: false,
    loadingMessages: false,
  }),

  actions: {
    async fetchConversations() {
      const api = useApi()
      this.loading = true
      
      try {
        const response = await api.get<ApiResponse<Conversation[]>>('/conversations')
        this.conversations = response.data
        return response.data
      } catch (error) {
        console.error('Fetch conversations error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchConversation(conversationId: number) {
      const api = useApi()
      this.loading = true
      
      try {
        const response = await api.get<ApiResponse<Conversation>>(`/conversations/${conversationId}`)
        this.currentConversation = response.data
        return response.data
      } catch (error) {
        console.error('Fetch conversation error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async sendMessage(conversationId: number, message: string) {
      const api = useApi()
      this.loadingMessages = true
      
      try {
        const response = await api.post<ApiResponse<ChatMessage>>(
          `/conversations/${conversationId}/messages`,
          { message }
        )
        this.messages.push(response.data)
        return response.data
      } catch (error) {
        console.error('Send message error:', error)
        throw error
      } finally {
        this.loadingMessages = false
      }
    },

    async markAsRead(conversationId: number) {
      const api = useApi()
      
      try {
        await api.patch(`/conversations/${conversationId}/read`)
        
        const conversation = this.conversations.find(c => c.id === conversationId)
        if (conversation) {
          conversation.unread_count = 0
        }
        
        if (this.currentConversation?.id === conversationId) {
          this.currentConversation.unread_count = 0
        }
      } catch (error) {
        console.error('Mark as read error:', error)
        throw error
      }
    },
  },

  getters: {
    unreadCount: (state) => {
      return state.conversations.reduce((sum, conv) => sum + (conv.unread_count || 0), 0)
    },
  },
})
