<template>
  <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-secondary-500) 100%);">
    <NCard style="width: 100%; max-width: 400px; margin: 16px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: var(--color-primary-600); margin: 0 0 8px 0;">Fluxo</h1>
        <p style="color: var(--color-gray-600); margin: 0;">Sign in to your account</p>
      </div>

      <NForm
        ref="formRef"
        :model="formData"
        :rules="rules"
        @submit.prevent="handleLogin"
      >
        <NFormItem path="email" label="Email">
          <NInput
            v-model:value="formData.email"
            type="email"
            placeholder="Enter your email"
            size="large"
          />
        </NFormItem>

        <NFormItem path="password" label="Password">
          <NInput
            v-model:value="formData.password"
            type="password"
            show-password-on="click"
            placeholder="Enter your password"
            size="large"
          />
        </NFormItem>

        <NButton
          type="primary"
          size="large"
          block
          :loading="loading"
          attr-type="submit"
          style="background-color: var(--color-primary-600);"
        >
          Sign In
        </NButton>
      </NForm>

      <div style="margin-top: 24px; text-align: center;">
        <span style="color: var(--color-gray-600);">Don't have an account? </span>
        <NButton text type="primary" @click="router.push('/auth/register')">
          Sign Up
        </NButton>
      </div>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'

definePageMeta({
  layout: 'default',
})

const router = useRouter()
const authStore = useAuthStore()
const message = useMessage()

const formRef = ref()
const loading = ref(false)

const formData = reactive({
  email: '',
  password: '',
})

const rules = {
  email: [
    {
      required: true,
      message: 'Please enter your email',
      trigger: ['blur', 'input'],
    },
    {
      type: 'email',
      message: 'Please enter a valid email',
      trigger: ['blur', 'input'],
    },
  ],
  password: [
    {
      required: true,
      message: 'Please enter your password',
      trigger: ['blur', 'input'],
    },
  ],
}

const handleLogin = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true
    
    await authStore.login(formData.email, formData.password)
    
    message.success('Login successful!')
    router.push('/dashboard')
  } catch (error: any) {
    console.error('Login error:', error)
    message.error(error.response?.data?.message || 'Login failed. Please check your credentials.')
  } finally {
    loading.value = false
  }
}
</script>
