import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/utils/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null)

  const getToken = computed(() => token.value)
  const getUser = computed(() => user.value)
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const setToken = (newToken) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  const setUser = (userData) => {
    user.value = userData
  }

  const register = async (payload) => {
    try {
      const res = await api.post('/auth/register', payload)
      return res.data
    } catch (err) {
      throw err.response?.data || err.message
    }
  }

  const login = async (payload) => {
    try {
      const res = await api.post('/auth/login', payload)
      if (res.data.data.token) {
        setToken(res.data.data.token)
      }
      return res.data
    } catch (err) {
      throw err.response?.data || err.message
    }
  }

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/profile')
      setUser(res.data.data)
      console.log(res);
      return res.data
    } catch (err) {
      logout()
      throw err.response?.data || err.message
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  return { getToken, getUser, setToken, setUser, register, login, fetchProfile, logout }
})
