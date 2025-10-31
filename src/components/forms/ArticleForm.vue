<template>
  <form @submit.prevent class="grid gap-3 content-start">
    <!-- Title -->
    <BaseInput
      type="text"
      label="Title *"
      placeholder="Title of the article"
      v-model="formData.title"
      :errorMsg="vErrors.title"
      @input="onInput('title', formData.title)"
      @blur="onBlur('title', formData.title)"
    />

    <!-- Category -->
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
        <option v-for="category in articleStore.categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
      <div v-if="vErrors.categoryId" class="text-sm text-error pt-1">
        {{ vErrors.categoryId }}
      </div>
    </div>

    <!-- Thumbnail -->
    <div>
      <legend class="fieldset-legend">Thumbnail *</legend>
      <div>
        <input
          type="file"
          ref="fileInputRef"
          class="file-input w-full validator"
          placeholder="Select thumbnail here"
          :class="{
            '!border-error': vErrors.thumbnail,
          }"
          :errorMsg="vErrors.thumbnail"
          @change="onThumbnailChange"
        />
        <div v-if="vErrors.thumbnail" class="text-sm text-error pt-1">
          {{ vErrors.thumbnail }}
        </div>
      </div>
    </div>

    <!-- Content -->
    <div>
      <legend class="fieldset-legend">Content *</legend>
      <div class="quill-wrapper" :class="{ 'quill-error': vErrors.content }">
        <QuillEditor
          theme="snow"
          :options="quillOptions"
          v-model:content="formData.content"
          placeholder="Write content here..."
          contentType="delta"
          @input="onInput('content', formData.content)"
          @blur="onBlur('content', formData.content)"
        />
      </div>
      <div v-if="vErrors.content" class="text-sm text-error pt-1">
        {{ vErrors.content }}
      </div>
    </div>
  </form>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { z } from 'zod'
  import { useFormValidation } from '@/composables/useFormValidation'
  import { useArticleStore } from '@/stores/article'
  import { QuillEditor } from '@vueup/vue-quill'
  import '@vueup/vue-quill/dist/vue-quill.snow.css'
  import hljs from 'highlight.js'
  import 'highlight.js/styles/atom-one-dark.css'

  const articleStore = useArticleStore()

  const formData = defineModel()
  const fileInputRef = ref(null)

  onMounted(async () => {
    await articleStore.fetchCategories()
  })

  /********** QUILL EDITOR CONFIG **********/
  const customToolbar = [
    [{ font: ['inter', 'kantumruyPro', 'sans-serif', 'serif', 'monospace'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline'],
    ['blockquote', 'code-block'],
    ['link', 'image', 'formula'],
    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ['clean'],
  ]
  const quillOptions = {
    modules: {
      syntax: {
        highlight: (text) => hljs.highlightAuto(text).value,
      },
      toolbar: customToolbar,
    },
  }

  /********** VALIDATION **********/
  const schema = z.object({
    title: z.string().min(1, 'Title cannot be empty').max(50, 'Title must not exceed 50 characters'),
    categoryId: z.coerce.number().positive('Please select a category'),
    thumbnail: z.any().refine((file) => file !== null, 'Thumbnail cannot be empty'),
    content: z.custom(
      (val) => {
        if (!val || typeof val !== 'object' || !Array.isArray(val.ops)) return false

        return val.ops.some((op) => {
          const insert = op.insert
          return (
            (typeof insert === 'string' && insert.trim() !== '' && insert.trim().length > 0) ||
            (typeof insert === 'object' && insert.image && insert.image.trim() !== '')
          )
        })
      },
      {
        message: 'Content cannot be empty',
      }
    ),
  })

  const { vErrors, validateForm, onInput, onBlur, resetValidation } = useFormValidation(
    schema,
    formData.value
  )

  // Handle thumbnail validation
  const validMimeTypes = ['image/jpeg', 'image/png']
  const validExtensions = ['.jpg', '.jpeg', '.png']
  const maxSize = 1048576 // 1MB

  const isValidMagicNumber = async (file) => {
    const header = await file.slice(0, 8).arrayBuffer()
    const bytes = new Uint8Array(header)

    // JPEG: FF D8 FF
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return true

    // PNG: 89 50 4E 47 0D 0A 1A 0A
    const pngHeader = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
    if (pngHeader.every((b, i) => b === bytes[i])) return true

    return false
  }

  const onThumbnailChange = async (event) => {
    const file = event.target.files[0]

    // If no file selected
    if (!file) {
      formData.value.thumbnail = null
      vErrors.thumbnail = 'Thumbnail cannot be empty'
      return
    }

    const fileName = file.name.toLowerCase()
    const parts = fileName.split('.')

    // Extension check
    const hasValidExtension = validExtensions.some((ext) => fileName.endsWith(ext))
    if (!hasValidExtension || parts.length > 2) {
      vErrors.thumbnail = 'Invalid file extension. Only .jpg, .jpeg, or .png. are allowed.'
      return
    }

    // MIME type check
    if (!validMimeTypes.includes(file.type)) {
      vErrors.thumbnail = 'Only JPEG or PNG images are allowed.'
      return
    }

    // Size check
    if (file.size > maxSize) {
      vErrors.thumbnail = 'File size must not exceed 1MB.'
      return
    }

    // Magic number check
    const validSignature = await isValidMagicNumber(file)
    if (!validSignature) {
      vErrors.thumbnail = 'Invalid file content. File may be corrupted or tampered.'
      return
    }

    formData.value.thumbnail = file
    vErrors.thumbnail = ''
  }

  const validateFormWrapper = () => {
    return validateForm(formData.value)
  }

  /********** RESET FORM **********/
  const resetForm = () => {
    Object.assign(formData.value, {
      title: '',
      thumbnail: null,
      categoryId: '',
      content: '',
    })
    resetValidation()
  }

  defineExpose({ validateForm: validateFormWrapper, resetForm })
</script>