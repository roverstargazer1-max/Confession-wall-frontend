import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import "@/styles/index.scss"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { Edit, User, Lock } from '@element-plus/icons-vue'
const app = createApp(App)

app.component('Edit', Edit)
app.component('User', User)
app.component('Lock', Lock)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.mount('#app')
