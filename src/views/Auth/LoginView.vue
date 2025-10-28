<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200 p-4">
    <div class="card w-full max-w-md bg-base-100 shadow-sm">
      <div class="card-body">
        <h2 class="card-title text-primary text-3xl font-bold! text-center justify-center mb-3!">
          Login
        </h2>

        <form @submit.prevent="handleLogin" class="space-y-2!">
          <BaseInput
            v-model="formData.email"
            type="email"
            label="Email *"
            placeholder="Enter your email"
            :errorMsg="errors.email"
            @blur="validateField('email')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M8 13V7.5C8 6.57174 7.63125 5.6815 6.97487 5.02513C6.3185 4.36875 5.42826 4 4.5 4M8 13H1V7.5C1 6.57174 1.36875 5.6815 2.02513 5.02513C2.6815 4.36875 3.57174 4 4.5 4M8 13V17M4.5 4H11M11 4V1H13.5M11 4V7M7.5 13H17V7C17 6.20435 16.6839 5.44129 16.1213 4.87868C15.5587 4.31607 14.7956 4 14 4M12 13V17M4 10.5H5"
                stroke="#BBBDC2"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </BaseInput>

          <BaseInputPassword
            v-model="formData.password"
            label="Password *"
            placeholder="Enter your password"
            :errorMsg="errors.password"
            @blur="validateField('password')"
          />

          <div class="pt-4">
            <BaseButton type="submit" :loading="isLoading" class="w-full" @click="handleLogin">
              Login
            </BaseButton>
          </div>
        </form>

        <div class="divider mt-2!">OR</div>

        <div class="text-center">
          <p class="text-sm">
            Don't have an account?
            <RouterLink :to="{ name: 'register' }" class="link link-primary font-semibold">
              Register
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import BaseInputPassword from '@/components/base/BaseInputPassword.vue'
  import { useAuthStore } from '@/stores/auth'
  import { useToast } from '@/composables/useToast'
  import { useRouter } from 'vue-router'

  const authStore = useAuthStore()
  const router = useRouter()
  const toast = useToast()

  const isLoading = ref(false)

  const formData = reactive({
    email: '',
    password: '',
  })

  const errors = reactive({
    email: '',
    password: '',
  })

  const validateField = (field) => {
    errors[field] = ''

    switch (field) {
      case 'email':
        if (!formData.email.trim()) {
          errors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          errors.email = 'Please enter a valid email address'
        }
        break

      case 'password':
        if (!formData.password) {
          errors.password = 'Password is required'
        }
        break
    }
  }

  const validateForm = () => {
    validateField('email')
    validateField('password')

    return !Object.values(errors).some((error) => error !== '')
  }

  const handleLogin = async () => {
    if (!validateForm()) {
      return
    }

    isLoading.value = true

    try {
      const res = await authStore.login(formData)
      if (!res.result) return

      await authStore.fetchProfile()
      router.push({ name: 'dashboard' })
    } catch (error) {
      const message = error?.message || 'Failed to login.'
      toast.showError(message)
    } finally {
      isLoading.value = false
    }
  }
</script>