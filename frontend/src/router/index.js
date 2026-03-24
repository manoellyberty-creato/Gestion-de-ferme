import { createRouter, createWebHistory } from 'vue-router'

// Importations des vues
import Login from '../views/Login.vue'
import DashboardAdmin from '../views/Dashboard/DashboardAdmin.vue'
import DashboardGerant from '@/views/Dashboard/DashboardGerant.vue'
import DashboardVeto from '@/views/Dashboard/DashboardVeto.vue'
import DashboardAgent from '@/views/Dashboard/DashboardAgent.vue'
import DasboardComptable from '@/views/Dashboard/DasboardComptable.vue'
import Departement from '../views/Departement.vue'
import Campagne from '../views/Campagne.vue'
import CampaignForm from '../components/CampaignForm.vue'
import CampaignDetail from '@/components/CampaignDetail.vue'
import Alert from '../views/Alert.vue'
import Health from '../views/Health.vue'
import Feed from '../views/Feed.vue'
import Users from '../views/Users.vue'
import Reports from '../views/Reports.vue'
import Finance from '@/views/Finance.vue'
import NavBar from '@/layouts/NavBar.vue'
import AsideBar from '@/layouts/AsideBar.vue'

const routes = [
  // --- Dashboards par Rôle ---
  {
    path: '/admin-dashboard',
    name: 'Home', 
    component: DashboardAdmin,
    meta: { requiresAuth: true, role: 'admin' } 
  },
  {
    path: '/manager-dashboard',
    name: 'manager', 
    component: DashboardGerant,
    meta: { requiresAuth: true, role: 'manager' } 
  },
  {
    path: '/veto-dashboard',
    name: 'veto', 
    component: DashboardVeto,
    meta: { requiresAuth: true, role: 'veterinaire' } 
  },
  {
    path: '/agent-dashboard',
    name: 'agent', 
    component: DashboardAgent,
    meta: { requiresAuth: true, role: 'agent' } 
  },
  {
    path: '/comptable-dashboard',
    name: 'comptable', 
    component: DasboardComptable,
    meta: { requiresAuth: true, role: 'comptable' } 
  },

  // --- Authentification ---
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false, hideNavigation: true }
  },
  {
    path: '/',
    redirect: '/admin-dashboard'
  },

  // --- Layout components ---
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

  // --- Département / Animal Management ---
  { 
    path: '/departement', 
    name: 'departement', 
    component: Departement, 
    meta: { requiresAuth: true } 
  },

  // --- Section Campagnes ---
  { 
    path: '/campaigns', 
    name: 'Campaigns', 
    component: Campagne, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/campaigns/create', 
    name: 'CampaignCreate', 
    component: CampaignForm, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/campaigns/:id', 
    name: 'CampaignDetail', 
    component: CampaignDetail, 
    meta: { requiresAuth: true } 
  },

  // --- Autres Modules ---
  { path: '/feed', name: 'Feed', component: Feed, meta: { requiresAuth: true } },
  { path: '/users', name: 'Users', component: Users, meta: { requiresAuth: true } },
  { path: '/reports', name: 'Reports', component: Reports, meta: { requiresAuth: true } },
  { path: '/alerts', name: 'Alerts', component: Alert, meta: { requiresAuth: true } },
  { path: '/health', name: 'Health', component: Health, meta: { requiresAuth: true } },
  { path: '/finance', name: 'finance', component: Finance, meta: { requiresAuth: true } },
  
  // --- 404 ---
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { requiresAuth: false, hideNavigation: true }
  }
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Guards d'authentification et d'autorisation par rôle
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