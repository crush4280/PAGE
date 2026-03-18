/**
 * 智慧园区管理平台 - 前端入口
 * Smart Park Management Platform
 * 
 * 技术栈: Vue 3 + Element Plus + Pinia + Vue Router
 * 
 * 作者: Lobster 团队
 * 版本: 1.0.0
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import App from './App.vue'
import router from './router'
import './assets/styles/index.scss'

// 创建应用实例
const app = createApp(App)

// 使用插件
app.use(createPinia())
app.use(router)
app.use(ElementPlus, { locale: zhCn })

// 全局注册组件
import * as icons from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(icons)) {
  app.component(key, component)
}

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('全局错误:', err)
  console.error('错误信息:', info)
}

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  // 需要登录的页面
  if (to.meta.requiresAuth && !token) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

// 挂载应用
app.mount('#app')

console.log('🦞 智慧园区管理平台启动成功!')