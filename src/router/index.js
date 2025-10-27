import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Auth/RegisterView.vue'),
      meta: { title: 'Register' },
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) document.title = `${to.meta.title} | Admin`
  else document.title = 'Admin'

  next()
})

export default router
