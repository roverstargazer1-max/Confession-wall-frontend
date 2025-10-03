import request from '@/utils/request'
import { useUserStore } from '@/stores/user'
//获得首页推送
export const homeGetApi = () => {
  const userStore = useUserStore()
  const token = userStore.token
  return request ({
    "headers":{
      "x-api-key": token,
      "Content-Type": "application/json",
    } ,
    url: '/api/post/homepage',
    method: 'get',
  })
}