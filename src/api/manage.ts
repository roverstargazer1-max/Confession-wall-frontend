import request from '@/utils/request'
import { useUserStore } from '@/stores/user'
import { type upDataPost, type deletePost } from '@/types/manageType'

// 【修改】修改帖子接口，以支持 FormData
export const revisePostApi = (data: FormData, postId: number) => {
  const userStore = useUserStore()
  const token = userStore.token
  return request({
    url: `/api/post/${postId}`,
    method: 'PATCH', // 通常更新部分数据用 PATCH，也可以是 POST
    headers: {
      'x-api-key': token
      // 注意：当 data 是 FormData 时，浏览器会自动设置 Content-Type，我们不要手动设置
    },
    data: data
  })
}

// 删除帖子接口
export const deletePostApi = (params: deletePost) => {
  const userStore = useUserStore()
  const token = userStore.token
  return request({
    headers: {
      'x-api-key': token,
      'Content-Type': 'application/json'
    },
    url: `/api/post/${params.postId}`,
    method: 'delete'
  })
}