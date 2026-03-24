import { createRouter, createWebHistory } from 'vue-router'

// Importations des vues
import Login from '../views/Login.vue'
import DashboardAdmin from '../views/Dashboard/DashboardAdmin.vue'
import Animal from '../views/Animal.vue'
import Campagne from '../views/Campagne.vue'
import CampaignForm from '../components/CampaignForm.vue'
import Alert from '../views/Alert.vue'
import Health from '../views/Health.vue'
import Feed from '../views/Feed.vue'
import Users from '../views/Users.vue'
import Reports from '../views/Reports.vue'
import CampaignDetail from '@/components/CampaignDetail.vue'

const routes = [
  { path: '/', name: 'Home', component: DashboardAdmin, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: Login },

  // --- Section Campagnes ---
  { path: '/campaigns', name: 'Campaigns', component: Campagne, meta: { requiresAuth: true } },
  { path: '/campaigns/create', name: 'CampaignCreate', component: CampaignForm, meta: { requiresAuth: true } },
  { path: '/campaigns/:id', name: 'CampaignDetail', component: CampaignDetail, meta: { requiresAuth: true } },

  // --- Autres Modules ---
  { path: '/animals', name: 'Animals', component: Animal, meta: { requiresAuth: true } },
  { path: '/feed', name: 'Feed', component: Feed, meta: { requiresAuth: true } },
  { path: '/users', name: 'Users', component: Users, meta: { requiresAuth: true } },
  { path: '/reports', name: 'Reports', component: Reports, meta: { requiresAuth: true } },
  { path: '/alerts', name: 'Alerts', component: Alert, meta: { requiresAuth: true } },
  { path: '/health', name: 'Health', component: Health, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// router.beforeEach((to) => {
//   const token = localStorage.getItem('token')
//   if (to.meta.requiresAuth && !token) {
//     return { name: 'Login' }
//   }
//   if (to.name === 'Login' && token) {
//     return { name: 'Home' }
//   }
// })

export default router