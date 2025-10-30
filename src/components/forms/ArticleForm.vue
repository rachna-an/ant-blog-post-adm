<template>
  <div class="grid grid-cols-3 gap-4 content-start">
    <div class="">
      <img class="h-60 w-full object-fit" src="@/assets/images/no_image.png" alt="Thumbnail" />
      <div class="w-full flex justify-between gap-2">
        <BaseButton>Choose</BaseButton>
        <BaseButton>Delete</BaseButton>
      </div>
    </div>

    <form @submit.prevent class="col-span-2 grid gap-3 content-start">
      <BaseInput
        type="text"
        label="Title *"
        placeholder="Title of the article"
        v-model="formData.title"
        :errorMsg="vErrors.title"
        @input="onInput('title', formData.title)"
        @blur="onBlur('title', formData.title)"
      />

      <div class="relative">
        <legend class="fieldset-legend">Category *</legend>
        <select
          class="select w-full"
          v-model="formData.categoryId"
          :class="[
            formData.categoryId === '' ? 'text-base-content/50' : 'text-base-content',
            vErrors.categoryId ? 'border-error focus:!border-error focus-within:!border-error' : '',
          ]"
          @change="onBlur('categoryId', formData.categoryId)"
        >
          <option value="" disabled selected>Select category</option>
          <option
            v-for="category in articleStore.categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
        <div v-if="vErrors.categoryId" class="validator-hint text-error">
          {{ vErrors.categoryId }}
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
  import { onMounted } from 'vue'
  import { z } from 'zod'
  import { useFormValidation } from '@/composables/useFormValidation'
  import { useArticleStore } from '@/stores/article'

  const articleStore = useArticleStore()

  const formData = defineModel()

  const schema = z.object({
    title: z.string().min(1, 'Title cannot be empty').max(50, 'Title must not exceed 50 characters'),
    categoryId: z.coerce.number().positive('Please select a category'),
  })

  const { vErrors, validateForm, onInput, onBlur, resetValidation } = useFormValidation(
    schema,
    formData.value
  )

  onMounted(async () => {
    await articleStore.fetchCategories()
  })

  // Reset form
  const resetForm = () => {
    formData.value.title = ''
    resetValidation()
  }

  // Validate form - always pass the current formData value
  const validateFormWrapper = () => {
    return validateForm(formData.value)
  }

  defineExpose({ validateForm: validateFormWrapper, resetForm })
</script>