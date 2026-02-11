<template>
  <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-secondary-500) 100%);">
    <NCard style="width: 100%; max-width: 400px; margin: 16px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: var(--color-primary-600); margin: 0 0 8px 0;">Fluxo</h1>
        <p style="color: var(--color-gray-600); margin: 0;">Create your account</p>
      </div>

      <NForm
        ref="formRef"
        :model="formData"
        :rules="rules"
        @submit.prevent="handleRegister"
      >
        <NFormItem path="name" label="Name">
          <NInput
            v-model:value="formData.name"
            placeholder="Enter your name"
            size="large"
          />
        </NFormItem>

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

        <NFormItem path="passwordConfirmation" label="Confirm Password">
          <NInput
            v-model:value="formData.passwordConfirmation"
            type="password"
            show-password-on="click"
            placeholder="Confirm your password"
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
          Sign Up
        </NButton>
      </NForm>

      <div style="margin-top: 24px; text-align: center;">
        <span style="color: var(--color-gray-600);">Already have an account? </span>
        <NButton text type="primary" @click="router.push('/auth/login')">
          Sign In
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
  name: '',
  email: '',
  password: '',
  passwordConfirmation: '',
})

const rules = {
  name: [
    {
      required: true,
      message: 'Please enter your name',
      trigger: ['blur', 'input'],
    },
  ],
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
    {
      min: 8,
      message: 'Password must be at least 8 characters',
      trigger: ['blur', 'input'],
    },
  ],
  passwordConfirmation: [
    {
      required: true,
      message: 'Please confirm your password',
      trigger: ['blur', 'input'],
    },
    {
      validator: (rule: any, value: string) => {
        return value === formData.password
      },
      message: 'Passwords do not match',
      trigger: ['blur', 'input'],
    },
  ],
}

const handleRegister = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true
    
    await authStore.register(
      formData.name,
      formData.email,
      formData.password,
      formData.passwordConfirmation
    )
    
    message.success('Registration successful!')
    router.push('/dashboard')
  } catch (error: any) {
    console.error('Registration error:', error)
    message.error(error.response?.data?.message || 'Registration failed. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>
