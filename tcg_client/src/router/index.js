import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/generator',
    name: 'code-gen',
    component: () => import('../views/Generator.vue')
  },
  {
    path: '/list',
    name: 'code-list',
    component: () => import('../views/List.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
