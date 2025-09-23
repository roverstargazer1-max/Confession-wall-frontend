import request from '@/utils/request'
import { useUserStore } from '@/stores/user'


// 密码类型
export interface RevisePassword {
  newpassword: string
  user_id: number
}

// 改密码接口,提交新密码
export const revisePasswApi = (params: RevisePassword) => {
  const userStore = useUserStore()
  const token = userStore.token
  return request ({
    "headers":{
      "x-api-key": token,
      "Content-Type": "application/json",
    } ,
    url: '/api/user/amend/password',
    method: 'PATCH',
    data: params
  })
}

// 昵称类型
export interface ReviseName {
  newname: string
  user_id: number

}

// 改昵称接口,提交新昵称
export const reviseNameApi = (params: ReviseName) => {
  const userStore = useUserStore()
  const token = userStore.token
  return request ({
    "headers":{
      "x-api-key": token,
      "Content-Type": "application/json",
    } ,
    url: '/api/user/amend/name',
    method: 'PATCH',
    data: params
  })
}