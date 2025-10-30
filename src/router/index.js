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
      path: '/',
      redirect: '/dashboard',
      component: () => import('@/layouts/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/Dashboard/DashboardView.vue'),
          meta: { title: 'Dashboard' },
        },
        {
          path: 'categories',
          name: 'category.index',
          component: () => import('@/views/Category/IndexView.vue'),
          meta: { title: 'Categories' },
        },
        {
          path: 'articles',
          name: 'article.index',
          component: () => import('@/views/Article/IndexView.vue'),
          meta: { title: 'My Articles' },
        },
      ],
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  document.title = to.meta.title ? `${to.meta.title} | Admin` : 'Admin'

  const requiresAuth = to.meta.requiresAuth
  const isAuthPage = to.name === 'login' || to.name === 'register'
  const { getToken: token, isAuthenticated } = authStore

  // Redirect authenticated users away from auth pages
  if (isAuthPage && isAuthenticated) {
    return next({ name: 'dashboard' })
  }

  // Handle protected routes
  if (requiresAuth) {
    if (!token) {
      return next({ name: 'login' })
    }

    // Has token but not authenticated (no user data) - fetch profile
    if (!isAuthenticated) {
      try {
        await authStore.fetchProfile()
        return next()
      } catch (error) {
        return next({ name: 'login' })
      }
    }

    return next()
  }

  next()
})

export default router
