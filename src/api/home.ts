import request from '@/utils/request'
import { useUserStore } from '@/stores/user'
//获得首页推送
export const homeGetApi = () => {
  const userStore = useUserStore()
  const token = userStore.token
  return request ({
    "headers":{
      "x-api-key": token,
      "Content-Type": "application/json",
    } ,
    url: '/api/post/homepage',
    method: 'get',
  })
}
//点赞接口
export interface PostLike{
  postId: number
}
export const postLikeApi = (params: PostLike) => {
  const userStore = useUserStore()
  const token = userStore.token
  // 注意：API 路径变量 {postId} 需要被实际值替换
  return request({
    "headers":{
      "x-api-key": token,
      "Content-Type": "application/json",
    },
    url: `/api/post/${params.postId}/like`, // 使用模板字符串替换路径参数
    method: 'post',
  })
}

// 获得评论接口
export interface CommentGet {
  postId: number
}
export const commentGetApi = (params: CommentGet) => {
  const userStore = useUserStore()
  const token = userStore.token
  return request({
    "headers":{
      "x-api-key": token,
      "Content-Type": "application/json",
    },
    url: `/api/post/${params.postId}/comments`, // 使用模板字符串替换路径参数
    method: 'get',
  })
}

// 发布评论接口
export interface CommentPost {
  postId: number,
  content: string
}
export const commentPostApi = (params: CommentPost) => {
  const userStore = useUserStore()
  const token = userStore.token
  return request({
    "headers":{
      "x-api-key": token,
    },
    url: `/api/comment/post/${params.postId}`, // 使用模板字符串替换路径参数
    method: 'post',
    params: { // 根据文档，content 是 Query 参数
      content: params.content
    }
  })
}
