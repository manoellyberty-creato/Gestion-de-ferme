import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Animal from '../views/Departement.vue'
import Campagne from '../views/Campagne.vue'
import AlertView from '../views/Alert.vue'
import Health from '../views/Health.vue'
import DashboardAdmin from '../views/Dashboard/DashboardAdmin.vue'
import Feed from '../views/Feed.vue'
import Users from '../views/Users.vue'
import Reports from '../views/Reports.vue'
import DashboardGerant from '@/views/Dashboard/DashboardGerant.vue'
import DashboardVeto from '@/views/Dashboard/DashboardVeto.vue'
import DashboardAgent from '@/views/Dashboard/DashboardAgent.vue'
import DasboardComptable from '@/views/Dashboard/DasboardComptable.vue'
import NavBar from '@/layouts/NavBar.vue'
import AsideBar from '@/layouts/AsideBar.vue'
import Finance from '@/views/Finance.vue'
import Departement from '../views/Departement.vue'

const routes = [
  {
    path: '/admin-dashboard',
    name: 'Home', 
    component: DashboardAdmin,
    meta: { requiresAuth: true } 
  },
  {
    path: '/manager-dashboard',
    name: 'manager', 
    component: DashboardGerant,
    meta: { requiresAuth: true } 
  },
  {
    path: '/veto-dashboard',
    name: 'veto', 
    component: DashboardVeto,
    meta: { requiresAuth: true } 
  },
  {
    path: '/agent-dashboard',
    name: 'agent', 
    component: DashboardAgent,
    meta: { requiresAuth: true } 
  },
  {
    path: '/comptable-dashboard',
    name: 'comptable', 
    component: DasboardComptable,
    meta: { requiresAuth: true } 
  },
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false, hideNavigation: true }
  },
  {
    path: '/navbar',
    name: 'navbar',
    component: NavBar
  },
  {
    path: '/aside',
    name: 'aside',
    component: AsideBar
  },
  { path: '/departement', name: 'departement', component: Departement, meta: { requiresAuth: true } },
  { path: '/feed', name: 'Feed', component: Feed, meta: { requiresAuth: true } },
  { path: '/users', name: 'Users', component: Users, meta: { requiresAuth: true } },
  { path: '/reports', name: 'Reports', component: Reports, meta: { requiresAuth: true } },
  { path: '/campaigns', name: 'Campaigns', component: Campagne, meta: { requiresAuth: true } },
  { path: '/alerts', name: 'Alerts', component: AlertView, meta: { requiresAuth: true } },
  { path: '/health', name: 'Health', component: Health, meta: { requiresAuth: true } },
  { path: '/finance', name: 'finance', component: Finance, meta: { requiresAuth: true } },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { requiresAuth: false, hideNavigation: true }// Accessible à tous
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  // 1. Si la page demande une connexion et que l'user n'est pas loggé
  if (to.meta.requiresAuth && !token) {
    return next({ name: 'Login' })
  }

  // 2. Si la page demande un rôle précis et que l'user ne l'a pas
  if (to.meta.role && user.role !== to.meta.role) {
    // On le redirige vers sa propre page d'accueil selon son rôle réel
    const homeByRole = {
      admin: '/admin-dashboard',
      manager: '/manager-dashboard',
      veterinaire: '/veto-dashboard',
      agent: '/agent-dashboard',
      comptable: '/comptable-dashboard'
    }
    return next(homeByRole[user.role] || '/login')
  }

  // 3. Si tout est OK ou que la page est publique (comme le 404)
  next()
})

export default router
