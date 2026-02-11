<template>
  <div>
    <NSpace vertical size="large">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2 style="margin: 0;">Bookings</h2>
        <NButton type="primary" @click="showCreateModal = true">
          Create Booking
        </NButton>
      </div>

      <NTabs type="card" @update:value="handleTabChange">
        <NTabPane name="all" tab="All Bookings">
          <BookingsList :bookings="bookingStore.bookings" />
        </NTabPane>
        <NTabPane name="pending" tab="Pending">
          <BookingsList :bookings="bookingStore.pendingBookings" />
        </NTabPane>
        <NTabPane name="confirmed" tab="Confirmed">
          <BookingsList :bookings="bookingStore.confirmedBookings" />
        </NTabPane>
        <NTabPane name="completed" tab="Completed">
          <BookingsList :bookings="bookingStore.completedBookings" />
        </NTabPane>
      </NTabs>
    </NSpace>

    <!-- Create Booking Modal -->
    <NModal v-model:show="showCreateModal" preset="card" title="Create Booking" style="width: 600px;">
      <NForm :model="bookingForm" ref="formRef">
        <NFormItem label="Service" path="service_id">
          <NSelect
            v-model:value="bookingForm.service_id"
            :options="serviceOptions"
            placeholder="Select a service"
          />
        </NFormItem>
        
        <NFormItem label="Booking Date" path="booking_date">
          <NDatePicker
            v-model:value="bookingForm.booking_date"
            type="date"
            style="width: 100%;"
          />
        </NFormItem>
        
        <NFormItem label="Start Time" path="start_time">
          <NTimePicker
            v-model:value="bookingForm.start_time"
            format="HH:mm"
            style="width: 100%;"
          />
        </NFormItem>
        
        <NFormItem label="End Time" path="end_time">
          <NTimePicker
            v-model:value="bookingForm.end_time"
            format="HH:mm"
            style="width: 100%;"
          />
        </NFormItem>
        
        <NFormItem label="Notes" path="notes">
          <NInput
            v-model:value="bookingForm.notes"
            type="textarea"
            placeholder="Additional notes"
            :rows="3"
          />
        </NFormItem>
      </NForm>

      <template #footer>
        <NSpace justify="end">
          <NButton @click="showCreateModal = false">Cancel</NButton>
          <NButton type="primary" @click="handleCreateBooking">Create</NButton>
        </NSpace>
      </template>
    </NModal>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const bookingStore = useBookingStore()
const serviceStore = useServiceStore()
const message = useMessage()

const showCreateModal = ref(false)
const bookingForm = reactive({
  service_id: null,
  booking_date: null,
  start_time: null,
  end_time: null,
  notes: '',
})

const serviceOptions = computed(() =>
  serviceStore.services.map(s => ({
    label: s.title,
    value: s.id,
  }))
)

const handleTabChange = (value: string) => {
  console.log('Tab changed to:', value)
}

const handleCreateBooking = async () => {
  try {
    // Convert timestamps to date/time strings
    const bookingDate = new Date(bookingForm.booking_date!).toISOString().split('T')[0]
    const startTime = new Date(bookingForm.start_time!).toTimeString().split(' ')[0]
    const endTime = new Date(bookingForm.end_time!).toTimeString().split(' ')[0]

    await bookingStore.createBooking({
      service_id: bookingForm.service_id!,
      booking_date: bookingDate,
      start_time: startTime,
      end_time: endTime,
      notes: bookingForm.notes,
    })

    message.success('Booking created successfully!')
    showCreateModal.value = false
    
    // Reset form
    Object.assign(bookingForm, {
      service_id: null,
      booking_date: null,
      start_time: null,
      end_time: null,
      notes: '',
    })
  } catch (error) {
    message.error('Failed to create booking')
    console.error(error)
  }
}

onMounted(async () => {
  await serviceStore.fetchServices()
})
</script>
