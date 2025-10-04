import request from '@/utils/request'
import { useUserStore } from '@/stores/user'
//获取某用户的表白数据
export interface otherPostGet {
  userId: number
}
export const otherPostGetApi = (params: otherPostGet) => {
  const userStore = useUserStore()
  const token = userStore.token
  return request({
    "headers":{
      "x-api-key": token,
      "Content-Type": "application/json",
    },
    url: `/api/user/${params.userId}/posts`, // 使用模板字符串替换路径参数
    method: 'get',
  })
}