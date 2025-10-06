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
//获取某用户的拉黑数据
export interface blackGet {
  userId: number
}
export const blackGetApi = (params: blackGet) => {
  const userStore = useUserStore()
  const token = userStore.token
  return request({
    "headers":{
      "x-api-key": token,
      "Content-Type": "application/json",
    },
    url: `/api/user/${params.userId}/black`, // 使用模板字符串替换路径参数
    method: 'get',
  })
}
//拉黑接口
export interface black {
  target_id: number
}
export const blackApi = (params: black) => {
  const userStore = useUserStore()
  const token = userStore.token
  return request({
    "headers":{
      "x-api-key": token,
      "Content-Type": "application/json",
    },
    url: '/api/user/blacklist', // 使用模板字符串替换路径参数
    method: 'POST',
    data:params
  })
}
//取消拉黑
export interface unBlack {
  target_id: number
}
export const unBlackApi = (params: unBlack) => {
  const userStore = useUserStore()
  const token = userStore.token
  return request({
    "headers":{
      "x-api-key": token,
      "Content-Type": "application/json",
    },
    url: '/api/user/blacklist', // 使用模板字符串替换路径参数
    method: 'DELETE',
    data:params
  })
}