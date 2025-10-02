import request from '@/utils/request'
import { useUserStore } from '@/stores/user'
import type { Post, CreatePostRequest, ApiResponse } from '@/types'

// 创建帖子接口
export const createPostApi = (data: FormData): Promise<ApiResponse<Post>> => {
  const userStore = useUserStore()
  const token = userStore.token
  
  return request({
    url: '/api/post',
    method: 'POST',
    headers: {
      'x-api-key': token,
      // 注意：使用FormData时不要设置Content-Type，浏览器会自动设置
    },
    data: data
  })
}

export const confessionApi = {
  createPost: createPostApi
}

export default confessionApi