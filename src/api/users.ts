import request from '@/utils/request'
import { useUserStore } from '@/stores/user'


// 登录参数类型
export interface LoginParams {
  username: string
  password: string
}

// 登录接口
export const loginApi = (params: LoginParams) => {
  return request ({
    "headers":{
      "Content-Type": "application/json",
    } ,
    url: 'api/user/login',
    method: 'post',
    data: params
  })
}
// 定义 getUserInfoApi 的参数类型
export interface UserInfoParams {
  userId: number;
}

//获取用户数据
export const getUserInfoApi = (params: UserInfoParams) => {
  const userStore = useUserStore()
  const token = userStore.token
  return request({
    "headers":{
      "x-api-key": token,
      "Content-Type": "application/json",
    } ,
   
    url: `/api/user/${params.userId}`, 
    method: 'get',
  })
}
// 注册参数类型
export interface RegisterParams {
  username: string
  password: string
  name: string
  type: number
}

export const registerApi = (params: RegisterParams) => {
  return request ({
    "headers":{
      "Content-Type": "application/json",
    } ,
    url: '/api/user/register',
    method: 'post',
    data: params
  })
}