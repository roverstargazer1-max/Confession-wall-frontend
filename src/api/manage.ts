import request from '@/utils/request'
import { useUserStore } from '@/stores/user'
import { type deletePost } from '@/types/manageType'

// 修改帖子接口，以支持 FormData
// 【修改】API现在只接收一个 pictures 字段，所有图片（新旧）都放在里面
export const revisePostApi = (data: FormData, postId: number) => {
  const userStore = useUserStore()
  const token = userStore.token
  return request({
    url: `/api/post/${postId}`,
    method: 'PATCH',
    headers: {
      'x-api-key': token
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