<template>
  <div style="min-height: 100vh; display: flex; flex-direction: column;">
    <!-- Hero Section -->
    <header style="padding: 24px 0; background-color: var(--color-white); border-bottom: 1px solid var(--color-gray-200);">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
        <h1 style="color: var(--color-primary-600); margin: 0;">Fluxo</h1>
        <NSpace>
          <NButton text @click="goToLogin">Sign In</NButton>
          <NButton type="primary" @click="goToRegister">Get Started</NButton>
        </NSpace>
      </div>
    </header>

    <main style="flex: 1;">
      <!-- Hero -->
      <section style="padding: 80px 0; background: linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-secondary-500) 100%); color: white; text-align: center;">
        <div class="container">
          <h1 style="font-size: 48px; margin: 0 0 24px 0; color: white;">Welcome to Fluxo</h1>
          <p style="font-size: 20px; margin: 0 0 32px 0; color: rgba(255, 255, 255, 0.9);">
            Modern marketplace dashboard for service providers and customers
          </p>
          <NSpace justify="center">
            <NButton size="large" @click="goToRegister" style="background-color: white; color: var(--color-primary-600);">
              Get Started
            </NButton>
            <NButton size="large" secondary @click="goToLogin" style="border-color: white; color: white;">
              Sign In
            </NButton>
          </NSpace>
        </div>
      </section>

      <!-- Features -->
      <section style="padding: 80px 0;">
        <div class="container">
          <h2 style="text-align: center; margin: 0 0 48px 0; font-size: 36px;">Features</h2>
          <NGrid :cols="3" :x-gap="24" :y-gap="24" responsive="screen">
            <NGridItem>
              <NCard>
                <div style="text-align: center;">
                  <div style="font-size: 48px; margin-bottom: 16px;">📅</div>
                  <h3 style="margin: 0 0 12px 0;">Easy Booking</h3>
                  <p style="color: var(--color-gray-600);">
                    Book services with just a few clicks. Manage your appointments efficiently.
                  </p>
                </div>
              </NCard>
            </NGridItem>

            <NGridItem>
              <NCard>
                <div style="text-align: center;">
                  <div style="font-size: 48px; margin-bottom: 16px;">💬</div>
                  <h3 style="margin: 0 0 12px 0;">Real-time Chat</h3>
                  <p style="color: var(--color-gray-600);">
                    Communicate directly with service providers through our messaging system.
                  </p>
                </div>
              </NCard>
            </NGridItem>

            <NGridItem>
              <NCard>
                <div style="text-align: center;">
                  <div style="font-size: 48px; margin-bottom: 16px;">💰</div>
                  <h3 style="margin: 0 0 12px 0;">Multi-Currency</h3>
                  <p style="color: var(--color-gray-600);">
                    Support for CHF, USD, and EUR. Switch currencies with ease.
                  </p>
                </div>
              </NCard>
            </NGridItem>

            <NGridItem>
              <NCard>
                <div style="text-align: center;">
                  <div style="font-size: 48px; margin-bottom: 16px;">📊</div>
                  <h3 style="margin: 0 0 12px 0;">Analytics</h3>
                  <p style="color: var(--color-gray-600);">
                    Track your business performance with detailed charts and reports.
                  </p>
                </div>
              </NCard>
            </NGridItem>

            <NGridItem>
              <NCard>
                <div style="text-align: center;">
                  <div style="font-size: 48px; margin-bottom: 16px;">🔔</div>
                  <h3 style="margin: 0 0 12px 0;">Notifications</h3>
                  <p style="color: var(--color-gray-600);">
                    Stay updated with real-time notifications for all important events.
                  </p>
                </div>
              </NCard>
            </NGridItem>

            <NGridItem>
              <NCard>
                <div style="text-align: center;">
                  <div style="font-size: 48px; margin-bottom: 16px;">🌙</div>
                  <h3 style="margin: 0 0 12px 0;">Dark Mode</h3>
                  <p style="color: var(--color-gray-600);">
                    Work comfortably with both light and dark mode support.
                  </p>
                </div>
              </NCard>
            </NGridItem>
          </NGrid>
        </div>
      </section>

      <!-- CTA Section -->
      <section style="padding: 80px 0; background-color: var(--color-gray-50);">
        <div class="container" style="text-align: center;">
          <h2 style="font-size: 36px; margin: 0 0 24px 0;">Ready to get started?</h2>
          <p style="font-size: 18px; color: var(--color-gray-600); margin: 0 0 32px 0;">
            Join Fluxo today and start managing your services efficiently.
          </p>
          <NButton size="large" type="primary" @click="goToRegister">
            Create Your Account
          </NButton>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer style="padding: 24px 0; background-color: var(--color-gray-900); color: white;">
      <div class="container" style="text-align: center;">
        <p style="margin: 0;">&copy; 2026 Fluxo. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const router = useRouter()

const goToLogin = () => {
  router.push('/auth/login')
}

const goToRegister = () => {
  router.push('/auth/register')
}

// Only check authentication on client side
onMounted(() => {
  const authStore = useAuthStore()
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
})
</script>
