import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Animal from '../views/Animal.vue'
import Campagne from '../views/Campagne.vue'
import AlertView from '../views/Alert.vue'
import Health from '../views/Health.vue'
import DashboardAdmin from '../views/Dashboard/DashboardAdmin.vue'
import Feed from '../views/Feed.vue'
import Users from '../views/Users.vue'
import Reports from '../views/Reports.vue'

const routes = [
  { path: '/', name: 'Home', component: DashboardAdmin, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: Login },
  { path: '/animals', name: 'Animals', component: Animal, meta: { requiresAuth: true } },
  { path: '/feed', name: 'Feed', component: Feed, meta: { requiresAuth: true } },
  { path: '/users', name: 'Users', component: Users, meta: { requiresAuth: true } },
  { path: '/reports', name: 'Reports', component: Reports, meta: { requiresAuth: true } },
  { path: '/campaigns', name: 'Campaigns', component: Campagne, meta: { requiresAuth: true } },
  { path: '/alerts', name: 'Alerts', component: AlertView, meta: { requiresAuth: true } },
  { path: '/health', name: 'Health', component: Health, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) return next({ name: 'Login' })
  next()
})

export default router
