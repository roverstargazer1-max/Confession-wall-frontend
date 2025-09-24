import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import "@/styles/index.scss"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { Edit, User, Lock } from '@element-plus/icons-vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
const pinia =createPinia()

// 注册所有图标
import type { Component } from 'vue'

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component as Component)
}

app.component('Edit', Edit)
app.component('User', User)
app.component('Lock', Lock)
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.mount('#app')
