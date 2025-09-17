import request from '@/utils/request'

// 登录参数类型
export interface LoginParams {
  username: string
  password: string
}

// 登录接口
export const login = (params: LoginParams) => {
  return request({
    url: '/user/login',
    method: 'post',
    data: params
  })
}