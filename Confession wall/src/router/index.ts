import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '@/views/IndexView.vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import LoginView from '@/views/LoginView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login' // 默认重定向到登录页
    },

    {
      path:"/login",
      name:"login",
      component:LoginView
    },

    {
      path:"/home",
      name:"home",
      component:AppLayout,
      children:[
        {
          path:'/home',
          component:IndexView,
        }
      ]
    },
    


  ],
})

export default router