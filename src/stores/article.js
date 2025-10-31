import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/utils/api'

export const useArticleStore = defineStore('article', () => {
  const articles = ref([])
  const categories = ref([])
  const isLoading = ref(false)
  const search = ref('')
  const page = ref(1)
  const perPage = ref(8)
  const hasMore = ref(true)

  // for Dashboard
  const fetchArticles = async (loadMore = false) => {
    isLoading.value = true
    try {
      const res = await api.get('articles', {
        params: {
          _page: page.value,
          _per_page: perPage.value,
        },
      })

      const items = res.data.data.items || []
      const meta = res.data.data.meta || {}

      if (loadMore) {
        articles.value = [...articles.value, ...items]
      } else {
        articles.value = items
      }

      hasMore.value = meta.hasNextPage === true
    } catch (err) {
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const loadMoreArticles = async () => {
    page.value++
    await fetchArticles(true)
  }

  const resetPagination = () => {
    page.value = 1
    hasMore.value = true
  }

  const fetchArticleById = async (id) => {
    try {
      const res = await api.get(`/articles/${id}`)
      return res.data.data
    } catch (err) {
      throw err.response?.data || err.message
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

  const createArticle = async (payload) => {
    try {
      const res = await api.post('/articles', payload)
      return res.data
    } catch (err) {
      throw err.response?.data || err.message
    }
  }

  const createThumbnail = async (id, payload) => {
    try {
      const res = await api.post(`/articles/${id}/thumbnail`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return res.data
    } catch (err) {
      throw err.response?.data || err.message
    }
  }

  const deleteArticle = async (id) => {
    try {
      const res = await api.delete(`/articles/${id}`)
      return res.data
    } catch (err) {
      throw err.response?.data || err.message
    }
  }

  return {
    articles,
    categories,
    isLoading,
    search,
    hasMore,
    fetchArticles,
    fetchArticleById,
    loadMoreArticles,
    resetPagination,
    fetchCategories,
    createArticle,
    createThumbnail,
    deleteArticle,
  }
})
