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

// 路由规则数组（每个对象对应一个页面的配置）
const routes: Array<RouteRecordRaw> = [
  {
    path: '/', // 访问根路径（比如http://localhost:8080/）
    redirect: '/login' // 自动跳转到登录页
  },
  {
    path: '/login', // 登录页的URL路径
    name: 'login', // 路由的名字（方便后续引用）
    component: LoginView, // 对应显示的页面组件（登录页）
    meta: { requiresAuth: false } // 标记：不需要登录就能访问
  },
  {
    path: '/home', // 首页的URL路径
    name: 'home', // 路由名字
    component: HomeView, // 对应显示的页面组件（首页）
    meta: { requiresAuth: true } // 标记：需要登录才能访问
  }
]

router.beforeEach((to, from, next) => {
  // 检查是否需要登录
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (token) {
      next() // 已登录，放行
    } else {
      next('/login') // 未登录，跳转登录页
    }
  } else {
    next() // 不需要登录，直接放行
  }
})


export default router