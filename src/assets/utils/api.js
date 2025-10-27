import axios from 'axios'
import { useAuthStore } from '@/stores/useAuthStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.getToken;
     if (token) {
       config.headers.Authorization = `Bearer ${token}`
     }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
