<template>
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between !mb-5">
    <div>
      <h1 class="text-[28px] font-bold! text-primary mb-2!">My Articles</h1>
      <p class="!text-neutral !font-medium hidden md:flex">Create and manage your articles</p>
    </div>
    <RouterLink :to="{ name: 'article.create' }" class="btn btn-primary">
      <svg
        width="20px"
        height="20px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M11 8C11 7.44772 11.4477 7 12 7C12.5523 7 13 7.44772 13 8V11H16C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13H13V16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16V13H8C7.44771 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11H11V8Z"
            fill="currentColor"
          ></path>
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM3.00683 12C3.00683 16.9668 7.03321 20.9932 12 20.9932C16.9668 20.9932 20.9932 16.9668 20.9932 12C20.9932 7.03321 16.9668 3.00683 12 3.00683C7.03321 3.00683 3.00683 7.03321 3.00683 12Z"
            fill="currentColor"
          ></path>
        </g>
      </svg>
      Create Article
    </RouterLink>
  </div>

  <div class="overflow-x-auto rounded-xl border border-base-300 bg-base-100">
    <div class="p-4 border-b border-base-300">
      <label class="input w-100!">
        <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search article..."
          data-testid="search-input"
        />
      </label>
    </div>

    <BaseTable
      :columns="columns"
      :items="articles"
      :isLoading="isLoading"
      :totalItems="paginate.totalItems"
      :perPage="paginate.perPage"
      v-model:currentPage="paginate.currentPage"
      @edit="(id) => handleEdit(id)"
      @delete="(id) => openDeleteModal(id)"
    >
      <template #column-thumbnail="{ value }">
        <img :src="value" alt="Thumbnail" class="h-[45px] w-full object-cover rounded-sm" />
      </template>

      <template #column-category="{ value }">
        <span
          class="badge badge-soft badge-primary text-primary/80 h-auto w-auto rounded-full !font-medium !text-xs"
        >
          {{ value }}
        </span>
      </template>

      <template #column-createdAt="{ value }">
        <span>{{ formatDate(value) }}</span>
      </template>
    </BaseTable>
  </div>

  <!-- Delete Modal -->
  <ConfirmationModal
    v-model:visible="deleteModal.show"
    :loading="deleteModal.isLoading"
    title="Delete Article"
    message="Are you want to delete this article?"
    :buttonText="deleteModal.isLoading ? 'Deleting' : 'Delete'"
    @confirm="handleDelete"
  />
</template>

<script setup>
  import { ref, reactive, watch, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useToast } from '@/composables/useToast'
  import api from '@/utils/api'
  import { formatDate } from '@/utils/dateFormat'
  import { useArticleStore } from '@/stores/article'

  const router = useRouter()
  const toast = useToast()
  const articleStore = useArticleStore()

  /********** TABLE **********/
  const columns = ref([
    { key: 'thumbnail', label: '' },
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category' },
    { key: 'createdAt', label: 'Created At' },
  ])
  const paginate = reactive({
    page: 1,
    perPage: 10,
    totalItems: 0,
    currentPage: 1,
  })

  /********** STATE **********/
  const articles = ref([])
  const isLoading = ref(false)
  const selectedId = ref(null)
  const searchQuery = ref('')
  const deleteModal = reactive({
    show: false,
    isLoading: false,
  })

  /********** LOAD DATA **********/
  const loadArticles = async () => {
    isLoading.value = true
    try {
      const res = await api.get('/articles/own', {
        params: {
          search: searchQuery.value || undefined,
          _page: paginate.page,
          _per_page: paginate.perPage,
          sortBy: 'createdAt',
          sortDir: 'DESC',
        },
      })
      const data = res.data.data
      if (res.data.result) {
        articles.value = data.items.map((article) => ({
          id: article.id,
          title: article.title,
          thumbnail: article.thumbnail,
          category: article.category.name,
          createdAt: article.createdAt,
        }))
        paginate.totalItems = data.meta.totalItems
        paginate.totalPages = data.meta.totalPages
      }
    } catch (error) {
      console.error(error)
      const message = error?.response?.data?.message || 'Failed to fetch articles.'
      toast.showError(message)
    } finally {
      isLoading.value = false
    }
  }
  onMounted(loadArticles)

  /********** WATCHERS **********/
  watch(
    () => paginate.currentPage,
    (newPage, oldPage) => {
      if (newPage !== oldPage) {
        paginate.page = newPage
        loadArticles()
      }
    }
  )

  let debounceTimer
  watch(searchQuery, () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      paginate.page = 1
      loadArticles()
    }, 350)
  })

  /********** ACTIONS **********/
  const handleEdit = (id) => {
    // router.push({ name: 'article.edit', params: { id } })
    console.log(`Article ID: ${id}`)
  }

  const openDeleteModal = (id) => {
    selectedId.value = id
    deleteModal.show = true
  }

  const handleDelete = async () => {
    if (!selectedId.value) return
    deleteModal.isLoading = true

    try {
      const res = await articleStore.deleteArticle(selectedId.value)
      if (!res.result) throw new Error(res.message || 'Failed to delete article.')

      await loadArticles()
      deleteModal.show = false
      toast.showSuccess("You've successfully deleted article.")
    } catch (error) {
      toast.showError(error?.message || 'Failed to delete article.')
    } finally {
      deleteModal.isLoading = false
      selectedId.value = null
    }
  }
</script>

<style scoped>
  ::v-deep tbody tr td:first-of-type {
    padding: 5px 10px !important;
  }

  ::v-deep thead tr th:nth-of-type(2) {
    padding-left: 5px !important;
  }
  
  ::v-deep tbody tr td:nth-of-type(2) {
    padding-left: 5px !important;
    font-weight: 600 !important;
    color: var(--color-neutral) !important;
  }
</style>