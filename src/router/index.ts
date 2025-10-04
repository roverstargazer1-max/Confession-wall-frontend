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
        {
          path:"/user/:id",
          name:"userProfile",
          component: () => import('@/views/UserProfile.vue')
        },

      ],
    },
  ],
})
// === 全局前置守卫 ===
router.beforeEach((to, from, next) => {
  // 获取 user store 实例
  const userStore = useUserStore()
  const token = userStore.token

  // 定义不需要登录就可以访问的页面白名单
  const whiteList = ['/login', '/register']

  // 1. 判断有无 token
  if (token) {
    // 1.1 如果有 token，还想去登录页，则重定向到主页
    if (to.path === '/login') {
      next('/home')
    } else {
      // 1.2 访问其他页面，直接放行
      next()
    }
  } else {
    // 2. 如果没有 token
    // 2.1 检查目标路径是否在白名单中
    if (whiteList.includes(to.path)) {
      // 2.2 在白名单中，直接放行
      next()
    } else {
      // 2.3 不在白名单中，强制跳转到登录页
      next(`/login?redirect=${to.fullPath}`)
    }
  }
})

export default router