import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Auth/RegisterView.vue'),
      meta: { title: 'Register' },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Auth/LoginView.vue'),
      meta: { title: 'Login' },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/Dashboard/DashboardView.vue'),
      meta: { title: 'Dashboard', requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const token = authStore.getToken

  document.title = to.meta.title ? `${to.meta.title} | Admin` : 'Admin'

  if (to.meta.requiresAuth && !token) {
    next({ name: 'login' })
  } else if ((to.name === 'login' || to.name === 'register') && token) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
