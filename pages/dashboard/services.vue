<template>
  <div>
    <NSpace vertical size="large">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2 style="margin: 0;">Services</h2>
      </div>

      <NGrid :cols="3" :x-gap="16" :y-gap="16" responsive="screen">
        <NGridItem v-for="service in serviceStore.activeServices" :key="service.id">
          <NCard :title="service.title" hoverable style="cursor: pointer;" @click="handleServiceClick(service.id)">
            <p style="margin: 0 0 12px 0; color: var(--color-gray-600);">
              {{ service.description }}
            </p>
            
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <strong style="font-size: 18px; color: var(--color-primary-600);">
                {{ formatPrice(service.price, service.currency as any) }}
              </strong>
              
              <NTag v-if="service.category" type="info">
                {{ service.category.name }}
              </NTag>
            </div>
            
            <div v-if="service.duration" style="margin-top: 8px; color: var(--color-gray-500); font-size: 14px;">
              Duration: {{ service.duration }} minutes
            </div>

            <template #footer>
              <NButton type="primary" block @click.stop="handleBookService(service.id)">
                Book Now
              </NButton>
            </template>
          </NCard>
        </NGridItem>
      </NGrid>

      <div v-if="serviceStore.activeServices.length === 0" style="text-align: center; padding: 40px; color: var(--color-gray-500);">
        No services available
      </div>
    </NSpace>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const router = useRouter()
const serviceStore = useServiceStore()
const { formatPrice } = useCurrency()

const handleServiceClick = (serviceId: number) => {
  router.push(`/dashboard/services/${serviceId}`)
}

const handleBookService = (serviceId: number) => {
  router.push(`/dashboard/bookings?service=${serviceId}`)
}

onMounted(async () => {
  await serviceStore.fetchServices()
})
</script>
