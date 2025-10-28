import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/utils/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)

  const getToken = computed(() => token.value)

  const setToken = (newToken) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  const register = async (payload) => {
    try {
      const res = await api.post('/auth/register', payload)
      return res.data
    } catch (err) {
      throw err.response?.data || err.message
    }
  }

  return { getToken, setToken, register }
})
