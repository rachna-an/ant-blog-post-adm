<template>
  <div class="mb-5!">
    <h1 class="text-[28px] font-bold! text-primary mb-2!">Create Article</h1>
    <p class="!text-neutral !font-medium hidden md:flex">
      Compose a new article and publish it to your platform.
    </p>
  </div>

  <div class="card rounded-xl border border-base-300 bg-base-100 p-6">
    <ArticleForm ref="formRef" v-model="formData" />

    <div class="flex flex-col gap-4 sm:flex-row sm:justify-between !my-4">
      <RouterLink
        :to="{ name: 'article.index' }"
        :class="[
          'text-sm !font-semibold flex items-center justify-center gap-2 text-zinc-700',
          isLoading ? 'pointer-events-none opacity-50' : '',
        ]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M5 12H19M5 12L9 8M5 12L9 16"
            stroke="#3f3f46"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Back to Articles
      </RouterLink>

      <BaseButton :loading="isLoading" @click="handlePublish">
        <template #icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M18 5V4C18 3.73478 17.8946 3.48043 17.7071 3.29289C17.5196 3.10536 17.2652 3 17 3H8.914C8.6488 3.00006 8.39449 3.10545 8.207 3.293L4.293 7.207C4.10545 7.39449 4.00006 7.64881 4 7.914V20C4 20.2652 4.10536 20.5196 4.29289 20.7071C4.48043 20.8946 4.73478 21 5 21H17C17.2652 21 17.5196 20.8946 17.7071 20.7071C17.8946 20.5196 18 20.2652 18 20V15M9 3V7C9 7.26522 8.89464 7.51957 8.70711 7.70711C8.51957 7.89464 8.26522 8 8 8H4M15.383 8.772L18.128 11.518M19.343 7.612C19.7344 8.00371 19.9542 8.53478 19.9542 9.0885C19.9542 9.64222 19.7344 10.1733 19.343 10.565L12.693 17.211L9 17.95L9.739 14.258L16.385 7.612C16.5789 7.41722 16.8094 7.26267 17.0632 7.15721C17.317 7.05175 17.5892 6.99746 17.864 6.99746C18.1388 6.99746 18.411 7.05175 18.6648 7.15721C18.9186 7.26267 19.1491 7.41722 19.343 7.612Z"
              stroke="white"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </template>
        {{ isLoading ? 'Publishing...' : 'Publish Now' }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
  import { reactive, ref } from 'vue'
  import ArticleForm from '@/components/forms/ArticleForm.vue'
  import { useToast } from '@/composables/useToast'
  import { useRouter } from 'vue-router'
  import { useArticleStore } from '@/stores/article'

  const toast = useToast()
  const router = useRouter()
  const articleStore = useArticleStore()

  /********** STATE **********/
  const formRef = ref(null)
  const formData = reactive({
    title: '',
    categoryId: '',
    thumbnail: null,
    content: '',
  })
  const isLoading = ref(false)

  /********** SUBMISSION **********/
  const handlePublish = async () => {
    if (!formRef.value.validateForm()) return
    isLoading.value = true

    try {
      const payload = {
        title: formData.title,
        content: JSON.stringify(formData.content),
        categoryId: formData.categoryId,
      }
      const res = await articleStore.createArticle(payload)
      const articleId = res.data.id

      if (formData.thumbnail instanceof File) {
        const form = new FormData()
        form.append('thumbnail', formData.thumbnail)

        const resThumbnail = await articleStore.createThumbnail(articleId, form)
        if (!resThumbnail.result) {
          toast.showError(resThumbnail.message || 'Failed to upload thumbnail.')

          // Rollback post creation
          await articleStore.deleteArticle(articleId)
          return
        }
      }

      toast.showSuccess(res.message)
      formRef.value.resetForm()
      router.push({ name: 'article.index' })
    } catch (error) {
      const message = error?.message || 'Failed to publish article.'
      toast.showError(message)
    } finally {
      isLoading.value = false
    }
  }
</script>