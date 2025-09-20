import request from '@/utils/request'

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
  user_id: number;
}

//获取当前登录用户信息的接口
export const getUserInfoApi = (params: UserInfoParams) => {
  return request({
    url: '/api/user', 
    method: 'get',
    data: params     
  })
}