import request from '@/utils/request'
import { useUserStore } from '@/stores/user'
import type { Post, CreatePostRequest, ApiResponse, PaginatedResponse } from '@/types'

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

//用ApiService来应对内容管理，为了便利所以放在一起了
class ApiService {
  // 获取用户帖子列表
  async getUserPosts(page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<Post>> {
    const response = await request.get(`/user/posts?page=${page}&pageSize=${pageSize}`);
    return response.data;
  }

  // 更新帖子
  async updatePost(id: number, postData: Partial<Post>): Promise<Post> {
    const response = await request.put(`/posts/${id}`, postData);
    return response.data;
  }

  // 删除帖子
  async deletePost(id: number): Promise<void> {
    await request.delete(`/posts/${id}`);
  }

  // 获取单个帖子详情
  async getPost(id: number): Promise<Post> {
    const response = await request.get(`/posts/${id}`);
    return response.data;
  }
}

// 创建 ApiService 实例
export const apiService = new ApiService();

export const confessionApi = {
  createPost: createPostApi,
  getUserPosts: apiService.getUserPosts.bind(apiService),
  updatePost: apiService.updatePost.bind(apiService),
  deletePost: apiService.deletePost.bind(apiService),
  getPost: apiService.getPost.bind(apiService)
}

export default confessionApi