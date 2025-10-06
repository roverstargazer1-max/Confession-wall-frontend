// personalPosts.ts
import { defineStore } from 'pinia'
import type { Post, CreatePostRequest } from '@/types'
import { useUserStore } from './user'
import { createPostApi } from '@/api/postApi'

export const usePostStore = defineStore('post', {
  state: () => ({
    posts: [] as Post[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    setError(error: string | null) {
      this.error = error
    },
    setLoading(loading: boolean) {
      this.loading = loading
    },
    async createPost(postData: CreatePostRequest): Promise<boolean> {
      const userStore = useUserStore()
      if (!userStore.userInfo) {
        this.setError('请先登录')
        return false
      }

      this.setLoading(true)
      this.setError(null)

      try {
        const formData = new FormData()
        
        // 【修改】添加字段以匹配API文档
        formData.append('title', postData.title); // 【新增】
        formData.append('content', postData.content);
        formData.append('anonymity', postData.anonymity.toString()); // 【重命名】
        formData.append('isPublic', postData.isPublic.toString());
      
        // 【修改】添加图片文件，使用'pictures'作为字段名
        postData.images.forEach((file) => {
          formData.append('pictures', file); 
        });

        const response = await createPostApi(formData)
        if (response.data.code === 200) {
          const serverPost = response.data
          this.posts.unshift(serverPost)
          return true
        } else {
          this.setError(response.data.msg || '111创建帖子失败')
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
    clearError() {
      this.error = null
    }
  }
})