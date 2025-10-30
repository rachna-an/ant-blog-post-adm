<template>
  <form @submit.prevent class="grid gap-3">
    <BaseInput
      type="text"
      label="Category Name *"
      placeholder="Name of the category"
      v-model="formData.name"
      :errorMsg="vErrors.name"
      @input="onInput('name', formData.name)"
      @blur="onBlur('name', formData.name)"
    />
  </form>
</template>

<script setup>
  import { z } from 'zod'
  import { useFormValidation } from '@/composables/useFormValidation'

  const formData = defineModel({
    type: Object,
    default: () => ({ name: '' }),
  })

  // Validation schema
  const schema = z.object({
    name: z
      .string()
      .min(1, 'Category name cannot be empty')
      .max(50, 'Category name must not exceed 50 characters'),
  })

  // Initialize validation with the schema and initial form structure
  const { vErrors, validateForm, onInput, onBlur, resetValidation } = useFormValidation(
    schema,
    formData.value
  )

  // Reset form
  const resetForm = () => {
    formData.value.name = ''
    resetValidation()
  }

  // Validate form - always pass the current formData value
  const validateFormWrapper = () => {
    return validateForm(formData.value)
  }

  defineExpose({ validateForm: validateFormWrapper, resetForm })
</script>