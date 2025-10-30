<template>
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between !mb-5">
    <div>
      <h1 class="text-[28px] font-bold! text-primary mb-2!">Category</h1>
      <p class="!text-neutral !font-medium hidden md:flex">
        Create and manage categories for different types of article
      </p>
    </div>
    <div>
      <BaseButton @click="openCreateModal()">
        <template #icon>
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
        </template>
        Create Category
      </BaseButton>
    </div>
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
          placeholder="Search category..."
          data-testid="search-input"
        />
      </label>
    </div>

    <BaseTable
      :columns="columns"
      :items="categories"
      :isLoading="isLoading"
      :totalItems="paginate.totalItems"
      :perPage="paginate.perPage"
      v-model:currentPage="paginate.currentPage"
      @edit="(id) => openEditModal(id)"
      @delete="(id) => openDeleteModal(id)"
    >
    </BaseTable>
  </div>

  <!-- Create/Edit Modal -->
  <FormModal
    v-model:show="modal.show"
    :title="modal.isEdit ? 'Edit Category' : 'Create Category'"
    :loading="modal.isLoading"
    @save="handleSave"
  >
    <CategoryForm ref="formRef" v-model="formData" />
  </FormModal>

  <!-- Delete Modal -->
  <ConfirmationModal
    v-model:visible="deleteModal.show"
    :loading="deleteModal.isLoading"
    title="Delete Category"
    message="Are you want to delete this category?"
    :buttonText="deleteModal.isLoading ? 'Deleting' : 'Delete'"
    @confirm="handleDelete"
  />
</template>

<script setup>
  import { ref, reactive, watch, onMounted } from 'vue'
  import FormModal from '@/components/common/FormModal.vue'
  import { useToast } from '@/composables/useToast'
  import api from '@/utils/api'
  import CategoryForm from '@/components/forms/CategoryForm.vue'

  const toast = useToast()

  /********** TABLE **********/
  const columns = ref([{ key: 'name', label: 'Category Name' }])
  const paginate = reactive({
    page: 1,
    perPage: 10,
    totalItems: 0,
    currentPage: 1,
  })

  /********** STATE **********/
  const categories = ref([])
  const modal = reactive({
    show: false,
    isEdit: false,
    isLoading: false,
  })

  const deleteModal = reactive({
    show: false,
    isLoading: false,
  })

  // Form state
  const formRef = ref(null)
  const isLoading = ref(false)
  const selectedId = ref(null)
  const searchQuery = ref('')

  const formData = reactive({
    name: '',
  })

  /********** LOAD DATA **********/
  const loadCategories = async () => {
    isLoading.value = true
    try {
      const res = await api.get('/categories', {
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
        categories.value = data.items.map((cat) => ({
          id: cat.id,
          name: cat.name,
        }))
        paginate.totalItems = data.meta.totalItems
        paginate.totalPages = data.meta.totalPages
      }
    } catch (error) {
      console.error(error)
      const message = error?.response?.data?.message || 'Failed to fetch categories.'
      toast.showError(message)
    } finally {
      isLoading.value = false
    }
  }
  onMounted(loadCategories)

  /********** WATCHERS **********/
  watch(
    () => paginate.currentPage,
    (newPage, oldPage) => {
      if (newPage !== oldPage) {
        paginate.page = newPage
        loadCategories()
      }
    }
  )

  let debounceTimer
  watch(searchQuery, () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      paginate.page = 1
      loadCategories()
    }, 350)
  })

  /********** MODAL ACTIONS **********/
  const openCreateModal = async () => {
    modal.isEdit = false
    modal.show = true
    formRef.value?.resetForm()
  }

  const openEditModal = async (id) => {
    modal.isEdit = true
    formRef.value.resetForm()
    selectedId.value = id

    try {
      const res = await api.get(`/categories/${id}`)
      if (res.data.result) {
        const cat = res.data.data
        Object.assign(formData, { name: cat.name })
        modal.show = true
      }
    } catch (error) {
      toast.showError(error?.response?.data?.message || 'Failed to load category for edit.')
    }
  }

  const openDeleteModal = (id) => {
    selectedId.value = id
    deleteModal.show = true
  }

  /********** SUBMISSION **********/
  const handleSave = async () => {
    if (!formRef.value.validateForm()) return
    modal.isLoading = true

    try {
      if (modal.isEdit) {
        const res = await api.put(`/categories/${selectedId.value}`, formData)
        if (!res.data.result) {
          throw new Error(res.data.message || 'Failed to update category')
        }
      } else {
        const res = await api.post('/categories', formData)
        if (!res.data.result) {
          throw new Error(res.data.message || 'Failed to create category')
        }
      }

      await loadCategories()
      modal.show = false
      selectedId.value = null

      toast.showSuccess(
        modal.isEdit
          ? "You've successfully updated category."
          : "You've successfully created new category."
      )
    } catch (error) {
      console.error(error)
      toast.showError(error?.response?.data?.message || 'Failed to save category.')
    } finally {
      modal.isLoading = false
    }
  }

  const handleDelete = async () => {
    if (!selectedId.value) return
    deleteModal.isLoading = true

    try {
      const res = await api.delete(`/categories/${selectedId.value}`)
      if (!res.data.result) throw new Error(res.data.message || 'Failed to delete category.')

      await loadCategories()
      deleteModal.show = false
      toast.showSuccess("You've successfully deleted category.")
    } catch (error) {
      toast.showError(error?.response?.data?.message || 'Failed to delete category.')
    } finally {
      deleteModal.isLoading = false
      selectedId.value = null
    }
  }
</script>