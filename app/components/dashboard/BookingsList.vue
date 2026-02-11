<template>
  <div>
    <NSpace vertical>
      <div
        v-for="booking in bookings"
        :key="booking.id"
        style="padding: 16px; border: 1px solid var(--color-gray-200); border-radius: 8px; margin-bottom: 12px;"
      >
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div style="flex: 1;">
            <h3 style="margin: 0 0 8px 0;">{{ booking.service?.title || 'Service' }}</h3>
            <NSpace>
              <div>
                <strong>Date:</strong> {{ formatDate(booking.booking_date) }}
              </div>
              <div>
                <strong>Time:</strong> {{ booking.start_time }} - {{ booking.end_time }}
              </div>
              <div>
                <strong>Price:</strong> {{ formatPrice(booking.total_price, booking.currency as any) }}
              </div>
            </NSpace>
            <p v-if="booking.notes" style="margin: 8px 0 0 0; color: var(--color-gray-600);">
              {{ booking.notes }}
            </p>
          </div>
          
          <div style="display: flex; gap: 8px; align-items: center;">
            <NTag :type="getStatusType(booking.status)">
              {{ booking.status }}
            </NTag>
            
            <NDropdown :options="getActionOptions(booking)" @select="(key) => handleAction(key, booking)">
              <NButton size="small">Actions</NButton>
            </NDropdown>
          </div>
        </div>
      </div>

      <div v-if="bookings.length === 0" style="text-align: center; padding: 40px; color: var(--color-gray-500);">
        No bookings found
      </div>
    </NSpace>
  </div>
</template>

<script setup lang="ts">
import type { Booking } from '~/types'
import { useMessage } from 'naive-ui'

interface Props {
  bookings: Booking[]
}

defineProps<Props>()

const bookingStore = useBookingStore()
const { formatPrice } = useCurrency()
const message = useMessage()

const getStatusType = (status: string) => {
  const types: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
    pending: 'warning',
    confirmed: 'info',
    completed: 'success',
    cancelled: 'error',
  }
  return types[status] || 'default'
}

const getActionOptions = (booking: Booking) => {
  const options = []
  
  if (booking.status === 'pending') {
    options.push(
      { label: 'Confirm', key: 'confirm' },
      { label: 'Cancel', key: 'cancel' }
    )
  }
  
  if (booking.status === 'confirmed') {
    options.push(
      { label: 'Complete', key: 'complete' },
      { label: 'Cancel', key: 'cancel' }
    )
  }
  
  return options
}

const handleAction = async (action: string, booking: Booking) => {
  try {
    let newStatus = ''
    
    switch (action) {
      case 'confirm':
        newStatus = 'confirmed'
        break
      case 'complete':
        newStatus = 'completed'
        break
      case 'cancel':
        newStatus = 'cancelled'
        break
    }
    
    if (newStatus) {
      await bookingStore.updateBookingStatus(booking.id, newStatus)
      message.success(`Booking ${action}ed successfully!`)
    }
  } catch (error) {
    message.error(`Failed to ${action} booking`)
    console.error(error)
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}
</script>
