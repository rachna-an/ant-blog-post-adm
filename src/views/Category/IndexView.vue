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
      @delete="
        () => {
          deleteModal.show = true
        }
      "
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
  import { ref, reactive, watch, onMounted, nextTick } from 'vue'
  import FormModal from '@/components/common/FormModal.vue'
  import { useToast } from '@/composables/useToast'
  import api from '@/utils/api'
  import CategoryForm from '@/components/forms/CategoryForm.vue'

  const toast = useToast()

  const categories = ref([
    { id: 1, name: 'Technology' },
    { id: 2, name: 'Health' },
    { id: 3, name: 'Travel' },
    { id: 4, name: 'Food' },
    { id: 5, name: 'Lifestyle' },
    { id: 6, name: 'Education' },
    { id: 7, name: 'Finance' },
    { id: 8, name: 'Entertainment' },
    { id: 9, name: 'Sports' },
    { id: 10, name: 'News' },
    { id: 11, name: 'Science' },
    { id: 12, name: 'Art' },
  ])

  /********** TABLE **********/
  const columns = ref([{ key: 'name', label: 'Category Name' }])
  const paginate = reactive({
    page: 1,
    perPage: 2,
    totalItems: 20,
    currentPage: 1,
  })

  /********** STATE **********/
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
  const editingData = ref(null)
  const searchQuery = ref('')

  const formData = reactive({
    name: '',
  })

  /********** WATCHERS **********/
  watch(
    () => paginate.currentPage,
    (newPage, oldPage) => {
      if (newPage !== oldPage) {
        paginate.page = newPage
        // loadActivities(false)
      }
    }
  )

  /********** MODAL ACTIONS **********/
  const openCreateModal = async () => {
    modal.isEdit = false
    modal.show = true
    formRef.value?.resetForm()
  }

  const openEditModal = async (id) => {
    modal.isEdit = true
    formRef.value.resetForm()
    modal.show = true

    const cat = categories.value.find((c) => c.id === id)
    if (cat) {
      editingData.value = { ...cat }
      Object.assign(formData, {
        name: cat.name,
      })
    }
    return
    try {
      const res = await api.get(`/category/${id}`)
      if (res.data.result) {
        const cat = res.data.data
        editingData.value = { ...cat }
        Object.assign(formData, {
          name: cat.name,
        })
      }
    } catch (error) {
      const message = error?.response?.data?.msg || 'Failed to load category for edit.'
      toast.showError(message)
    }
  }

  /********** SUBMISSION **********/
  const handleSave = async () => {
    if (!formRef.value.validateForm()) return
    modal.isLoading = true

    try {
      if (modal.isEdit) {
        const res = await api.put(`/categories/${editingData.value.id}`, formData)
        if (!res.data.result) {
          throw new Error(res.data.msg || 'Failed to update category')
        }
      } else {
        const res = await api.post('/categories', formData)
        if (!res.data.result) {
          throw new Error(res.data.msg || 'Failed to create category')
        }
      }

      //   await loadCategories()
      modal.show = false
      editingData.value = null

      toast.showSuccess(
        modal.isEdit
          ? "You've successfully updated category."
          : "You've successfully created new category."
      )
    } catch (error) {
      console.error(error)
    } finally {
      modal.isLoading = false
    }
  }

  const handleDelete = async () => {
    deleteModal.isLoading = true
    try {
      const res = await api.delete('/category', {
        data: {
          ids: deletedIds.value,
        },
      })
      if (!res.data.result) throw new Error(res.data.msg || 'Failed to delete category.')

      // await loadCategories()
      deleteModal.show = false

      toast.showSuccess("You've successfully deleted category.")
    } catch (error) {
      toast.showError(error?.response?.data?.msg || 'Failed to delete category.')
    } finally {
      deleteModal.isLoading = false
    }
  }
</script>