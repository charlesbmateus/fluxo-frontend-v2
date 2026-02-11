import { defineStore } from 'pinia'
import type { Invoice, ApiResponse, PaginatedResponse } from '~/types'

interface InvoiceState {
  invoices: Invoice[]
  currentInvoice: Invoice | null
  loading: boolean
  pagination: {
    currentPage: number
    lastPage: number
    perPage: number
    total: number
  }
}

export const useInvoiceStore = defineStore('invoice', {
  state: (): InvoiceState => ({
    invoices: [],
    currentInvoice: null,
    loading: false,
    pagination: {
      currentPage: 1,
      lastPage: 1,
      perPage: 10,
      total: 0,
    },
  }),

  actions: {
    async fetchInvoices(page: number = 1) {
      const api = useApi()
      this.loading = true
      
      try {
        const response = await api.get<PaginatedResponse<Invoice>>(`/invoices?page=${page}`)
        this.invoices = response.data
        this.pagination = response.meta
        return response.data
      } catch (error) {
        console.error('Fetch invoices error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchInvoice(invoiceId: number) {
      const api = useApi()
      this.loading = true
      
      try {
        const response = await api.get<ApiResponse<Invoice>>(`/invoices/${invoiceId}`)
        this.currentInvoice = response.data
        return response.data
      } catch (error) {
        console.error('Fetch invoice error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async issueInvoice(invoiceId: number) {
      const api = useApi()
      this.loading = true
      
      try {
        const response = await api.patch<ApiResponse<Invoice>>(`/invoices/${invoiceId}/issue`)
        const index = this.invoices.findIndex(i => i.id === invoiceId)
        if (index !== -1) {
          this.invoices[index] = response.data
        }
        if (this.currentInvoice?.id === invoiceId) {
          this.currentInvoice = response.data
        }
        return response.data
      } catch (error) {
        console.error('Issue invoice error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async payInvoice(invoiceId: number) {
      const api = useApi()
      this.loading = true
      
      try {
        const response = await api.patch<ApiResponse<Invoice>>(`/invoices/${invoiceId}/pay`)
        const index = this.invoices.findIndex(i => i.id === invoiceId)
        if (index !== -1) {
          this.invoices[index] = response.data
        }
        if (this.currentInvoice?.id === invoiceId) {
          this.currentInvoice = response.data
        }
        return response.data
      } catch (error) {
        console.error('Pay invoice error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async cancelInvoice(invoiceId: number) {
      const api = useApi()
      this.loading = true
      
      try {
        const response = await api.patch<ApiResponse<Invoice>>(`/invoices/${invoiceId}/cancel`)
        const index = this.invoices.findIndex(i => i.id === invoiceId)
        if (index !== -1) {
          this.invoices[index] = response.data
        }
        if (this.currentInvoice?.id === invoiceId) {
          this.currentInvoice = response.data
        }
        return response.data
      } catch (error) {
        console.error('Cancel invoice error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
  },

  getters: {
    draftInvoices: (state) => state.invoices.filter(i => i.status === 'draft'),
    issuedInvoices: (state) => state.invoices.filter(i => i.status === 'issued'),
    paidInvoices: (state) => state.invoices.filter(i => i.status === 'paid'),
  },
})
