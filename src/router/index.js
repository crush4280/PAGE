/**
 * 智慧园区 - 前端路由配置
 */

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false, title: '登录' }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('../views/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'devices',
        name: 'Devices',
        component: () => import('../views/Devices.vue'),
        meta: { title: '设备管理' }
      },
      {
        path: 'alarms',
        name: 'Alarms',
        component: () => import('../views/Alarms.vue'),
        meta: { title: '告警中心' }
      },
      {
        path: 'tickets',
        name: 'Tickets',
        component: () => import('../views/Tickets.vue'),
        meta: { title: '工单系统' }
      },
      {
        path: 'energy',
        name: 'Energy',
        component: () => import('../views/Energy.vue'),
        meta: { title: '能源管理' }
      },
      {
        path: 'parking',
        name: 'Parking',
        component: () => import('../views/Parking.vue'),
        meta: { title: '停车管理' }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('../views/Users.vue'),
        meta: { title: '用户管理' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router