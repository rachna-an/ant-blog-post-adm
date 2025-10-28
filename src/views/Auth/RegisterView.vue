<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200 p-4">
    <div class="card w-full max-w-md bg-base-100 border border-zinc-300">
      <div class="card-body">
        <h2 class="card-title text-2xl text-primary font-bold! text-center justify-center mb-3!">
          Create Account
        </h2>

        <form @submit.prevent="handleRegister" class="space-y-3!">
          <div class="flex gap-2">
            <BaseInput
              v-model="formData.firstName"
              label="First Name *"
              placeholder="Enter your first name"
              :errorMsg="errors.firstName"
              @blur="validateField('firstName')"
            />

            <BaseInput
              v-model="formData.lastName"
              label="Last Name *"
              placeholder="Enter your last name"
              :errorMsg="errors.lastName"
              @blur="validateField('lastName')"
            />
          </div>

          <BaseInput
            v-model="formData.email"
            type="email"
            label="Email *"
            placeholder="Enter your email"
            :errorMsg="errors.email"
            @blur="validateField('email')"
          />

          <BaseInputPassword
            v-model="formData.password"
            label="Password *"
            placeholder="Enter your password"
            :errorMsg="errors.password"
            @blur="validateField('password')"
          />

          <BaseInputPassword
            v-model="formData.confirmPassword"
            label="Confirm Password *"
            placeholder="Confirm your password"
            :errorMsg="errors.confirmPassword"
            @blur="validateField('confirmPassword')"
          />

          <div class="pt-4">
            <BaseButton type="submit" :loading="isLoading" class="w-full" @click="handleRegister">
              Register
            </BaseButton>
          </div>
        </form>

        <div class="divider mt-2!">OR</div>

        <div class="text-center">
          <p class="text-sm">
            Already have an account?
            <RouterLink :to="{ name: 'login' }" class="link link-primary font-semibold">
              Login
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
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const errors = reactive({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const validateField = (field) => {
    errors[field] = ''

    switch (field) {
      case 'firstName':
        if (!formData.firstName.trim()) {
          errors.firstName = 'First name is required'
        } else if (formData.firstName.trim().length < 2) {
          errors.firstName = 'First name must be at least 2 characters'
        }
        break

      case 'lastName':
        if (!formData.lastName.trim()) {
          errors.lastName = 'Last name is required'
        } else if (formData.lastName.trim().length < 2) {
          errors.lastName = 'Last name must be at least 2 characters'
        }
        break

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
        } else if (formData.password.length < 8) {
          errors.password = 'Password must be at least 8 characters'
        }
        if (formData.confirmPassword) {
          validateField('confirmPassword')
        }
        break

      case 'confirmPassword':
        if (!formData.confirmPassword) {
          errors.confirmPassword = 'Please confirm your password'
        } else if (formData.password !== formData.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match'
        }
        break
    }
  }

  const validateForm = () => {
    validateField('firstName')
    validateField('lastName')
    validateField('email')
    validateField('password')
    validateField('confirmPassword')

    return !Object.values(errors).some((error) => error !== '')
  }

  const handleRegister = async () => {
    if (!validateForm()) {
      return
    }

    isLoading.value = true

    try {
      const res = await authStore.register(formData)
      if (!res.result) return

      toast.showSuccess('Account created successfully! You can now log in.')

      router.push({ name: 'login' })
    } catch (error) {
      const message = error?.message || 'Failed to register.'
      toast.showError(message)
    } finally {
      isLoading.value = false
    }
  }
</script>