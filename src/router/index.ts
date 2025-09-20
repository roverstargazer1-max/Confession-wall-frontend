import { Management } from '@element-plus/icons-vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

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
      component: () => import('@/views/LoginView.vue'),
      // meta: { requiresAuth: false } // 标记：不需要登录就能访问

    },
    {
      path: '/register',
      name: 'register' ,
      component:() =>import('@/views/RegisterView.vue')
    },
    {
      path:'/:pathMatch(.*)*',
      name:'NotFound',
      component: () => import('@/views/NotFoundView.vue') 
    },

    {
      path:"/home",
      name:"home",
      // meta: { requiresAuth: true }, // 标记：这个路由以及它的所有子路由都需要登录才能访问
      // AppLayout 作为布局组件也可以懒加载
      // meta: { requiresAuth: true }, // 标记：需要登录才能访问
      component: () => import('@/components/layout/AppLayout.vue'),
      children:[
        {
          path:'', 
          // 访问 /home就显示 HomeView，path为 ''
          name: 'home-index', 
          component: () => import('@/views/HomeView.vue')
        },

        {
          path:"/management",
          name:"management",
          component: () => import('@/views/ManageView.vue')
        },
        {
          path:"/post",
          name:"post",
          component: () => import('@/views/PostView.vue')
        },
        {
          path:"/profile",
          name:"profile",
          component: () => import('@/views/ProfileView.vue')
        },

      ],
    },
  ],
})

export default router