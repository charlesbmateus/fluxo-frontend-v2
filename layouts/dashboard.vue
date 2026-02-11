<template>
  <NConfigProvider :theme="theme">
    <NMessageProvider>
      <NNotificationProvider>
        <NDialogProvider>
          <NLayout has-sider style="min-height: 100vh;">
            <NLayoutSider
              bordered
              :width="240"
              :collapsed="collapsed"
              :collapsed-width="64"
              collapse-mode="width"
              show-trigger
              @collapse="collapsed = true"
              @expand="collapsed = false"
            >
              <div style="padding: 16px; display: flex; align-items: center; justify-content: center;">
                <h2 v-if="!collapsed" style="color: var(--color-primary-600); margin: 0;">Fluxo</h2>
                <span v-else style="color: var(--color-primary-600); font-size: 24px; font-weight: bold;">F</span>
              </div>
              
              <NMenu
                :collapsed="collapsed"
                :collapsed-width="64"
                :collapsed-icon-size="22"
                :options="menuOptions"
                :value="currentRoute"
                @update:value="handleMenuSelect"
              />
            </NLayoutSider>

            <NLayout>
              <NLayoutHeader bordered style="padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 16px;">
                  <h3 style="margin: 0;">{{ pageTitle }}</h3>
                </div>
                
                <NSpace>
                  <!-- Currency Selector -->
                  <NSelect
                    v-model:value="selectedCurrency"
                    :options="currencyOptions"
                    style="width: 100px;"
                    @update:value="handleCurrencyChange"
                  />
                  
                  <!-- Theme Toggle -->
                  <NButton text @click="toggleTheme">
                    <template #icon>
                      <span style="font-size: 20px;">{{ isDark ? '☀️' : '🌙' }}</span>
                    </template>
                  </NButton>
                  
                  <!-- Notifications -->
                  <NBadge :value="notificationStore.unreadCount" :max="99">
                    <NButton text @click="showNotifications = true">
                      <template #icon>
                        <span style="font-size: 20px;">🔔</span>
                      </template>
                    </NButton>
                  </NBadge>
                  
                  <!-- User Menu -->
                  <NDropdown :options="userMenuOptions" @select="handleUserMenuSelect">
                    <NButton text>
                      <NSpace align="center">
                        <NAvatar size="small" round>
                          {{ authStore.user?.name?.charAt(0).toUpperCase() }}
                        </NAvatar>
                        <span>{{ authStore.user?.name }}</span>
                      </NSpace>
                    </NButton>
                  </NDropdown>
                </NSpace>
              </NLayoutHeader>

              <NLayoutContent content-style="padding: 24px;">
                <slot />
              </NLayoutContent>
            </NLayout>
          </NLayout>

          <!-- Notifications Drawer -->
          <NDrawer v-model:show="showNotifications" :width="400" placement="right">
            <div style="padding: 16px;">
              <h3 style="margin-bottom: 16px;">Notifications</h3>
              <NSpace vertical>
                <NCard
                  v-for="notification in notificationStore.notifications"
                  :key="notification.id"
                  size="small"
                  :style="{ cursor: 'pointer', opacity: notification.read_at ? 0.6 : 1 }"
                  @click="handleNotificationClick(notification)"
                >
                  <strong>{{ notification.title }}</strong>
                  <p style="margin: 8px 0 0 0; font-size: 14px;">{{ notification.message }}</p>
                  <small style="color: var(--color-gray-500);">
                    {{ formatDate(notification.created_at) }}
                  </small>
                </NCard>
              </NSpace>
            </div>
          </NDrawer>
        </NDialogProvider>
      </NNotificationProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { darkTheme } from 'naive-ui'
import { h } from 'vue'
import type { MenuOption } from 'naive-ui'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const { selectedCurrency, setCurrency } = useCurrency()

const isDark = useState('isDark', () => false)
const collapsed = ref(false)
const showNotifications = ref(false)

const theme = computed(() => isDark.value ? darkTheme : null)

const currentRoute = computed(() => route.path)

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/dashboard/bookings': 'Bookings',
    '/dashboard/services': 'Services',
    '/dashboard/invoices': 'Invoices',
    '/dashboard/chat': 'Messages',
    '/dashboard/notifications': 'Notifications',
  }
  return titles[route.path] || 'Dashboard'
})

const menuOptions: MenuOption[] = [
  {
    label: 'Dashboard',
    key: '/dashboard',
  },
  {
    label: 'Bookings',
    key: '/dashboard/bookings',
  },
  {
    label: 'Services',
    key: '/dashboard/services',
  },
  {
    label: 'Invoices',
    key: '/dashboard/invoices',
  },
  {
    label: 'Messages',
    key: '/dashboard/chat',
  },
  {
    label: 'Notifications',
    key: '/dashboard/notifications',
  },
]

const currencyOptions = [
  { label: 'CHF', value: 'CHF' },
  { label: 'USD', value: 'USD' },
  { label: 'EUR', value: 'EUR' },
]

const userMenuOptions = [
  {
    label: 'Profile',
    key: 'profile',
  },
  {
    label: 'Settings',
    key: 'settings',
  },
  {
    label: 'Logout',
    key: 'logout',
  },
]

const handleMenuSelect = (key: string) => {
  router.push(key)
}

const handleUserMenuSelect = async (key: string) => {
  if (key === 'logout') {
    await authStore.logout()
    router.push('/auth/login')
  } else if (key === 'profile') {
    router.push('/dashboard/profile')
  } else if (key === 'settings') {
    router.push('/dashboard/settings')
  }
}

const handleCurrencyChange = (value: string) => {
  setCurrency(value as any)
}

const toggleTheme = () => {
  isDark.value = !isDark.value
}

const handleNotificationClick = async (notification: any) => {
  await notificationStore.markAsRead(notification.id)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

onMounted(() => {
  notificationStore.fetchNotifications()
  
  if (process.client) {
    const savedTheme = localStorage.getItem('fluxo_theme')
    isDark.value = savedTheme === 'dark'
    
    if (isDark.value) {
      document.body.classList.add('dark')
    }
  }
})

watch(isDark, (newValue) => {
  if (process.client) {
    localStorage.setItem('fluxo_theme', newValue ? 'dark' : 'light')
    if (newValue) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }
})
</script>
