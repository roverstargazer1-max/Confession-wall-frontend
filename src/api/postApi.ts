import request from '@/utils/request'
import { useUserStore } from '@/stores/user'
//上传帖子接口
export const creatpostApi = (data: FormData) => {
  const userStore = useUserStore()
  const token = userStore.token
  return request({
    url: '/api/post/upload', 
    method: 'POST', 
    headers: {
      'x-api-key': token,
      // 当使用 FormData 时，不需要手动设置 'Content-Type'
      // 浏览器会自动设置 'Content-Type': 'multipart/form-data' 并附带正确的 boundary
    },
    data: data 
  })
}