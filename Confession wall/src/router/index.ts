import { createRouter, createWebHistory } from 'vue-router'
import Applayout from '@/components/layout/AppLayout.vue'
import AppLayout from '@/components/layout/AppLayout.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:"/",
      name:"home",
      component:AppLayout,
    },
    


  ],
})

export default router