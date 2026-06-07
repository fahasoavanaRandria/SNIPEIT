import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import BackofficeLayout from '../views/backoffice/BackofficeLayout.vue'
import DashboardView from '../views/backoffice/DashboardView.vue'
import ResetView from '../views/backoffice/ResetView.vue'
import FrontofficeLayout from '../views/frontoffice/FrontofficeLayout.vue'
import path from 'node:path'

//routes BACKOFFICE
const routes = [
  { path: '/', redirect: '/login'},

  { path: '/login', name: 'Login', component: LoginView},
  
  { path: '/backoffice', component: BackofficeLayout, meta: { requireAuth: true},
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardView
      },
      {
        path: 'reset',
        name: 'Reset',
        component: ResetView
      },
      {
        path: 'import',
        name: 'Import',
        component: () => import('../views/backoffice/ImportView.vue')
      },
      {
        path: 'tickets',
        name: 'Tickets',
        component: () => import('../views/backoffice/TicketsView.vue')
      }
    ]
  },

  //FRONTOFFICE
  {
    path: '/',
    component: FrontofficeLayout,
    children: [
      {
        path: 'elements',
        name: 'Elements',
        component: () => import('../views/frontoffice/ElementsView.vue')
      },
      {
        path: 'nouveau-ticket',
        name: 'NouveauTicket',
        component: () => import('../views/frontoffice/NouveauTicketView.vue')
      }
    ]
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

//Protection
router.beforeEach((to) => {
  const isAuthenticated = localStorage.getItem('bo_auth') === 'true'
  if (to.meta.requiresAuth && !isAuthenticated) {
    return '/login'
  }
  return true
})

export default router
