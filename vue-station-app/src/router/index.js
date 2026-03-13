import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Station from '../views/Station.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/station/:id',
    name: 'Station',
    component: Station,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
