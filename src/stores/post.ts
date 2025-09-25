// src/stores/post.ts
import { defineStore } from 'pinia'
import type { Post } from '../types/PoetType'
import { useUserStore } from './user'

export const usePostStore = defineStore('post', {
  state: () => ({
    posts: [] as Post[]
  }),
  //创建一个叫post的仓库，
  // 里面包含state（存数据）、getters（筛选 / 计算数据）、actions（处理业务逻辑）
  //初始化一个空数组 posts，类型是 Post[]（即 “帖子类型的数组”，每个元素都符合Post的格式）
  getters: {
    // 获取当前用户的帖子
    myPosts: (state) => {
      const userStore = useUserStore()
      if (!userStore.userInfo) return []
      return state.posts.filter(post => post.authorId === userStore.userInfo.id)
    },
    // 获取公开的帖子（首页展示）
    publicPosts: (state) => {
      const userStore = useUserStore()
      return state.posts.filter(post => {
        // 公开的帖子，或者是当前用户自己的非公开帖子
        return post.isPublic || (userStore.userInfo && post.authorId === userStore.userInfo.id)
      })
    }
  },
  actions: {
    // 初始化帖子数据（从localStorage加载）
    initPosts() {
      const postsStr = localStorage.getItem('posts')
      if (postsStr) {
        this.posts = JSON.parse(postsStr)
      }
    },
    // 保存帖子到localStorage
    savePosts() {
      localStorage.setItem('posts', JSON.stringify(this.posts))
    },
    // 创建新帖子
    createPost(postData: Omit<Post, 'id' | 'createdAt' | 'authorId' | 'authorName'>) {
      const userStore = useUserStore()
      if (!userStore.userInfo) return false

      const newPost: Post = {
        ...postData,
        id: Date.now().toString(),
        authorId: userStore.userInfo.id,
        authorName: postData.isAnonymous ? '匿名用户' : userStore.userInfo.username,
        createdAt: new Date().toISOString()
      }

      this.posts.unshift(newPost) // 添加到数组开头
      this.savePosts()
      return true
    },
    // 更新帖子
updatePost(id: string, postData: Partial<Omit<Post, 'id' | 'createdAt' | 'authorId' | 'authorName'>>) {
  const userStore = useUserStore()
  if (!userStore.userInfo) return false // 用户没登录，更新失败

  const index = this.posts.findIndex(post => post.id === id) // 找要更新的帖子的位置
  if (index === -1) return false // 没找到帖子，更新失败

  // 检查：只有帖子作者能更新
  if (this.posts[index].authorId !== userStore.userInfo.id) return false

  // 构造“更新后的帖子”：原帖子 + 新数据 + 更新时间 + 处理作者名
  this.posts[index] = {
    ...this.posts[index],
    ...postData,
    updatedAt: new Date().toISOString(),
    authorName: postData.isAnonymous ? '匿名用户' : userStore.userInfo.username
  }

  this.savePosts() // 保存到本地
  return true // 更新成功
},
    // 删除帖子
deletePost(id: string) {
  const userStore = useUserStore()
  if (!userStore.userInfo) return false // 用户没登录，删除失败

  const index = this.posts.findIndex(post => post.id === id) // 找要删除的帖子位置
  if (index === -1) return false // 没找到帖子，删除失败

  // 检查：只有帖子作者能删除
  if (this.posts[index].authorId !== userStore.userInfo.id) return false

  this.posts.splice(index, 1) // 从数组中删除该帖子
  this.savePosts() // 保存到本地
  return true // 删除成功
    }
  }
})