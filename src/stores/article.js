import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/utils/api'

export const useArticleStore = defineStore('article', () => {
  const articles = ref([])
  const categories = ref([])
  const isLoading = ref(false)
  const search = ref('')

  const onLoadArticles = async (params = {}) => {
    isLoading.value = true
    try {
      const res = await api.get('articles', { params })
      articles.value = res.data.data
      return res.data.paginate?.total || 0
    } catch (err) {
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Fetch all categories for Select options
  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories', {
        params: {
          _per_page: 100,
          sortBy: 'name',
        },
      })
      if (res.data.result) categories.value = res.data.data.items
      console.log(categories.value)
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  return {
    articles,
    categories,
    isLoading,
    search,
    onLoadArticles,
    fetchCategories,
  }
})
