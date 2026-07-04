import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView },
    { path: '/reservations', component: () => import('@/views/ReservationListView.vue') },
    { path: '/reservations/new', component: () => import('@/views/ReservationNewView.vue') },
    { path: '/admin', component: () => import('@/views/AdminView.vue') },
  ],
})

export default router
