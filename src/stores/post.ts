import { defineStore } from 'pinia'
import type { Post, CreatePostRequest } from '@/types'
import { useUserStore } from './user'
import { confessionApi } from '@/api/postapi'

export const usePostStore = defineStore('post', {
  state: () => ({
    posts: [] as Post[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    // 设置错误信息
    setError(error: string | null) {
      this.error = error
    },

    // 设置加载状态
    setLoading(loading: boolean) {
      this.loading = loading
    },

    // 创建新帖子 - 结合API和本地状态
    async createPost(postData: CreatePostRequest): Promise<boolean> {
      const userStore = useUserStore()
      if (!userStore.userInfo) {
        this.setError('请先登录')
        return false
      }

      this.setLoading(true)
      this.setError(null)

      try {
        // 创建FormData对象
        const formData = new FormData()
        
        // 添加文本字段
        formData.append('content', postData.content)
        formData.append('isAnonymous', postData.isAnonymous.toString())
        formData.append('isPublic', postData.isPublic.toString())
        
        // 添加定时发送时间（如果有）
        if (postData.scheduledTime) {
          formData.append('scheduledTime', postData.scheduledTime)
        }
        
        // 添加图片文件
        postData.images.forEach((file, index) => {
          formData.append('images', file) // 使用相同的字段名，后端会接收数组
        })

        // 调用API创建帖子
        const response = await confessionApi.createPost(formData)
        
        if (response.code === 200) {
          // 将服务器返回的帖子添加到本地状态
          const serverPost = response.data
          this.posts.unshift(serverPost)
          return true
        } else {
          this.setError(response.message || '创建帖子失败')
          return false
        }
      } catch (error: any) {
        this.setError(error.message || '创建帖子失败')
        console.error('创建帖子失败:', error)
        return false
      } finally {
        this.setLoading(false)
      }
    },

    // 清除错误
    clearError() {
      this.error = null
    }
  }
})