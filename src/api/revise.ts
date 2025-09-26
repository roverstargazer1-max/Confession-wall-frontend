import request from '@/utils/request'
import { useUserStore } from '@/stores/user'


// 密码类型
export interface RevisePassword {
  newpassword: string
  orginpassword:string
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
// 上传头像接口
export const revisePortraitApi = (data: FormData) => {
  const userStore = useUserStore()
  const token = userStore.token
  return request({
    url: '/api/user/amend/portrait', 
    method: 'POST', 
    headers: {
      'x-api-key': token,
      // 当使用 FormData 时，不需要手动设置 'Content-Type'
      // 浏览器会自动设置 'Content-Type': 'multipart/form-data' 并附带正确的 boundary
    },
    data: data // 包含 user_id 和 picture 的 FormData
  })
}