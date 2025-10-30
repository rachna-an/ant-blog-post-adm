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
              :errorMsg="vErrors.firstName"
              @input="onInput('firstName', formData.firstName)"
              @blur="onBlur('firstName', formData.firstName)"
            />

            <BaseInput
              v-model="formData.lastName"
              label="Last Name *"
              placeholder="Enter your last name"
              :errorMsg="vErrors.lastName"
              @input="onInput('lastName', formData.lastName)"
              @blur="onBlur('lastName', formData.lastName)"
            />
          </div>

          <BaseInput
            v-model="formData.email"
            type="email"
            label="Email *"
            placeholder="Enter your email"
            :errorMsg="vErrors.email"
            @input="onInput('email', formData.email)"
            @blur="onBlur('email', formData.email)"
          />

          <BaseInputPassword
            v-model="formData.password"
            label="Password *"
            placeholder="Enter your password"
            :errorMsg="vErrors.password"
            @input="onInput('password', formData.password)"
            @blur="onBlur('password', formData.password)"
          />

          <BaseInputPassword
            v-model="formData.confirmPassword"
            label="Confirm Password *"
            placeholder="Confirm your password"
            :errorMsg="vErrors.confirmPassword"
            @input="onInput('confirmPassword', formData.confirmPassword)"
            @blur="onBlur('confirmPassword', formData.confirmPassword), validateConfirmPassword()"
          />

          <div class="pt-4">
            <BaseButton type="submit" :loading="isLoading" class="w-full"> Register </BaseButton>
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
  import { z } from 'zod'
  import { useFormValidation } from '@/composables/useFormValidation'
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

  const schema = z.object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(50, 'First name must not exceed 50 characters'),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(50, 'Last name must not exceed 50 characters'),
    email: z.email('Please enter a valid email address').min(1, 'Email is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .refine(
        (val) =>
          val.length === 0 ||
          (val.length >= 8 &&
            val.length <= 20 &&
            /[a-z]/.test(val) &&
            /[A-Z]/.test(val) &&
            /\d/.test(val) &&
            /[^A-Za-z0-9]/.test(val)),
        {
          message: 'Password must include uppercase, lowercase, number, and special character',
        }
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })

  const { vErrors, validateForm, onInput, onBlur } = useFormValidation(schema, formData)

  const validateConfirmPassword = () => {
    if (formData.confirmPassword && formData.confirmPassword !== formData.password) {
      vErrors.confirmPassword = 'Passwords do not match'
      return false
    } else {
      vErrors.confirmPassword = ''
      return true
    }
  }
  const handleRegister = async () => {
    if (!validateForm(formData) || !validateConfirmPassword()) return

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