import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Station from '../views/Station.vue'
import VisualDemo from '../views/VisualDemo.vue'

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
  },
    {
    path: '/visual-demo',
    name: 'VisualDemo',
    component: VisualDemo
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
