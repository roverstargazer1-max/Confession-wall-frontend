import { Management } from '@element-plus/icons-vue'
import { createRouter, createWebHistory } from 'vue-router'

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
      // 使用动态导入函数来实现懒加载
      // 只有当用户访问 /login 路由时，LoginView.vue 的代码才会被加载
      component: () => import('@/views/LoginView.vue')
      
    },
    {
      path:'/:pathMatch(.*)*',
      name:'NotFound',
      component: () => import('@/views/NotFoundView.vue') 
    },

    {
      path:"/home",
      name:"home",
      // AppLayout 作为布局组件也可以懒加载
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