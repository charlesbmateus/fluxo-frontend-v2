<template>
  <div>
    <NSpace vertical size="large">
      <!-- Stats Overview -->
      <NGrid :cols="4" :x-gap="16" :y-gap="16" responsive="screen">
        <NGridItem>
          <NCard>
            <NStatistic label="Total Bookings" :value="stats.totalBookings">
              <template #prefix>
                <span style="font-size: 24px;">📅</span>
              </template>
            </NStatistic>
          </NCard>
        </NGridItem>
        
        <NGridItem>
          <NCard>
            <NStatistic label="Total Revenue" :value="stats.totalRevenue">
              <template #prefix>
                <span style="font-size: 24px;">💰</span>
              </template>
              <template #suffix>
                <span style="font-size: 14px; margin-left: 4px;">{{ currencySymbol }}</span>
              </template>
            </NStatistic>
          </NCard>
        </NGridItem>
        
        <NGridItem>
          <NCard>
            <NStatistic label="Active Services" :value="stats.activeServices">
              <template #prefix>
                <span style="font-size: 24px;">🛎️</span>
              </template>
            </NStatistic>
          </NCard>
        </NGridItem>
        
        <NGridItem>
          <NCard>
            <NStatistic label="Unread Messages" :value="stats.unreadMessages">
              <template #prefix>
                <span style="font-size: 24px;">💬</span>
              </template>
            </NStatistic>
          </NCard>
        </NGridItem>
      </NGrid>

      <!-- Charts Row -->
      <NGrid :cols="2" :x-gap="16" :y-gap="16" responsive="screen">
        <NGridItem>
          <NCard title="Bookings Overview">
            <ChartComponent
              type="line"
              :data="bookingsChartData"
              :options="chartOptions"
            />
          </NCard>
        </NGridItem>
        
        <NGridItem>
          <NCard title="Revenue by Month">
            <ChartComponent
              type="bar"
              :data="revenueChartData"
              :options="chartOptions"
            />
          </NCard>
        </NGridItem>
      </NGrid>

      <!-- Recent Activity -->
      <NGrid :cols="2" :x-gap="16" :y-gap="16" responsive="screen">
        <NGridItem>
          <NCard title="Recent Bookings">
            <NSpace vertical>
              <div
                v-for="booking in recentBookings"
                :key="booking.id"
                style="padding: 12px; border-bottom: 1px solid var(--color-gray-200); cursor: pointer;"
                @click="router.push(`/dashboard/bookings/${booking.id}`)"
              >
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <strong>{{ booking.service?.title }}</strong>
                    <p style="margin: 4px 0 0 0; font-size: 14px; color: var(--color-gray-600);">
                      {{ formatDate(booking.booking_date) }}
                    </p>
                  </div>
                  <NTag :type="getStatusType(booking.status)">
                    {{ booking.status }}
                  </NTag>
                </div>
              </div>
            </NSpace>
          </NCard>
        </NGridItem>
        
        <NGridItem>
          <NCard title="Recent Invoices">
            <NSpace vertical>
              <div
                v-for="invoice in recentInvoices"
                :key="invoice.id"
                style="padding: 12px; border-bottom: 1px solid var(--color-gray-200); cursor: pointer;"
                @click="router.push(`/dashboard/invoices/${invoice.id}`)"
              >
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <strong>{{ invoice.invoice_number }}</strong>
                    <p style="margin: 4px 0 0 0; font-size: 14px; color: var(--color-gray-600);">
                      {{ formatCurrency(invoice.amount, invoice.currency as any) }}
                    </p>
                  </div>
                  <NTag :type="getStatusType(invoice.status)">
                    {{ invoice.status }}
                  </NTag>
                </div>
              </div>
            </NSpace>
          </NCard>
        </NGridItem>
      </NGrid>
    </NSpace>
  </div>
</template>

<script setup lang="ts">
import type { Booking, Invoice } from '~/types'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const router = useRouter()
const bookingStore = useBookingStore()
const invoiceStore = useInvoiceStore()
const serviceStore = useServiceStore()
const chatStore = useChatStore()
const { formatCurrency, getCurrencySymbol, selectedCurrency } = useCurrency()

const stats = ref({
  totalBookings: 0,
  totalRevenue: 0,
  activeServices: 0,
  unreadMessages: 0,
})

const recentBookings = ref<Booking[]>([])
const recentInvoices = ref<Invoice[]>([])

const currencySymbol = computed(() => getCurrencySymbol())

const bookingsChartData = computed(() => ({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Bookings',
      data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 38, 40, 45],
      borderColor: 'rgb(168, 85, 247)',
      backgroundColor: 'rgba(168, 85, 247, 0.1)',
      tension: 0.4,
    },
  ],
}))

const revenueChartData = computed(() => ({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Revenue',
      data: [1200, 1900, 1500, 2500, 2200, 3000, 2800, 3500, 3200, 3800, 4000, 4500],
      backgroundColor: 'rgba(234, 179, 8, 0.8)',
      borderColor: 'rgb(234, 179, 8)',
      borderWidth: 1,
    },
  ],
}))

const chartOptions = {
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}

const getStatusType = (status: string) => {
  const types: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
    pending: 'warning',
    confirmed: 'info',
    completed: 'success',
    paid: 'success',
    issued: 'info',
    cancelled: 'error',
    draft: 'default',
  }
  return types[status] || 'default'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

onMounted(async () => {
  try {
    // Fetch dashboard data
    await Promise.all([
      serviceStore.fetchServices(),
      chatStore.fetchConversations(),
    ])
    
    // Update stats
    stats.value = {
      totalBookings: bookingStore.bookings.length,
      totalRevenue: 15000, // This should be calculated from actual data
      activeServices: serviceStore.activeServices.length,
      unreadMessages: chatStore.unreadCount,
    }
    
    // Set recent data
    recentBookings.value = bookingStore.bookings.slice(0, 5)
    recentInvoices.value = invoiceStore.invoices.slice(0, 5)
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  }
})
</script>
