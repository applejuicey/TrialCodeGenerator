import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/generator',
  },
  {
    path: '/generator',
    name: 'code-gen',
    component: () => import('../views/Generator.vue')
  },
  {
    path: '/list',
    name: 'trial-list',
    component: () => import('../views/List.vue')
  },
  {
    path: '/summary',
    name: 'trial-summary',
    component: () => import('../views/Summary.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/tcg/'),
  routes
})

export default router;
