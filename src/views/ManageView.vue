<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Post, User } from '@/types/HomeType'
import { otherPostGetApi, type otherPostGet } from '@/api/otherUser'
import { useUserStore } from '@/stores/user'
import { ChatDotRound } from '@element-plus/icons-vue'

// 1. 获取 user store 实例
const userStore = useUserStore()

// 2. 直接将 store 中的用户信息赋值给 ref，这是响应式的
const userInfo = ref<User>(userStore.userInfo)
const userPosts = ref<Post[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

/**
 * 仅获取当前用户的帖子列表
 * @param id - 当前登录用户的ID
 */
const fetchUserPosts = async (id: number) => {
  if (isNaN(id)) {
    error.value = "无效的用户ID";
    return;
  }
  
  isLoading.value = true
  error.value = null
  
  try {
    const apiParams: otherPostGet = { userId: id }
    const postsResponse = await otherPostGetApi(apiParams)

    if (postsResponse.data.code === 200) {
      userPosts.value = postsResponse.data.data
    } else {
      throw new Error(postsResponse.data.message || '获取您的帖子失败')
    }

  } catch (err: any) {
    console.error("获取用户帖子失败:", err)
    error.value = err.message || "加载帖子时发生未知错误。"
  } finally {
    isLoading.value = false
  }
}

// 3. 组件挂载时，从响应式的 userInfo 中获取 ID 并请求帖子数据
onMounted(() => {
  // 检查 userInfo.id 是否存在并且类型是数字
  if (userInfo.value && typeof userInfo.value.id === 'number') {
    fetchUserPosts(userInfo.value.id)
  } else {
    error.value = "无法获取您的用户信息，请尝试重新登录。"
  }
})
</script>

<template>
  <div class="user-profile-container">
    <div v-if="isLoading" class="loading-tip">正在加载您的帖子...</div>
    
    <div v-else-if="error" class="error-tip">
      <p>抱歉，加载失败</p>
      <p class="error-message">{{ error }}</p>
    </div>
    
    <div v-else-if="userInfo" class="profile-content">
      <header class="profile-header">
        <el-avatar :size="80" :src="userInfo.portrait?.url" />
        <div class="user-details">
          <h1>{{ userInfo.name }}</h1>
          <span class="username">@{{ userInfo.username }}</span>
        </div>
      </header>

      <div class="user-posts-section">
        <h2>我发布的帖子</h2>
        <div v-if="userPosts.length > 0" class="posts-list">
          <div v-for="post in userPosts" :key="post.postId" class="post-card">
            <div class="post-header">
              <el-avatar :size="50" :src="post.hostportrait.url" />
              <div class="user-info">
                <span class="hostname">{{ post.hostname }}</span>
              </div>
            </div>
            <div class="post-content">
              <h3 v-if="post.title" class="post-title">{{ post.title }}</h3>
              <p>{{ post.content }}</p>
            </div>
            <div
              v-if="post.pictures && post.pictures.length > 0"
              class="post-pictures"
              :class="`grid-${Math.min(post.pictures.length, 9)}`"
            >
              <div
                v-for="(picture, index) in post.pictures"
                :key="index"
                class="picture-item"
              >
                <el-image
                  :src="picture.url"
                  fit="cover"
                  lazy
                  :preview-src-list="post.pictures.map(p => p.url)"
                  :initial-index="index"
                />
              </div>
            </div>
            <div class="post-footer">
               <div class="action-item">
                  <el-icon><ChatDotRound /></el-icon>
                  <span>{{ post.comments > 0 ? post.comments : '评论' }}</span>
               </div>
               <div class="action-item">
                  <span :style="{ color: post.liked ? 'red' : 'inherit' }">❤️</span>
                  <span>{{ post.likes > 0 ? post.likes : '点赞' }}</span>
               </div>
            </div>
          </div>
        </div>
        <div v-else class="no-posts-tip">
          <p>您还没有发布任何帖子。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-profile-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}
.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #ebeef5;
}
.user-details h1 {
  margin: 0;
  font-size: 24px;
}
.user-details .username {
  color: #909399;
  font-size: 16px;
}
.user-posts-section h2 {
  font-size: 20px;
  margin-bottom: 1.5rem;
  color: #303133;
}
.loading-tip, .no-posts-tip {
  text-align: center;
  color: #909399;
  padding: 40px 20px;
  font-size: 16px;
}
.error-tip {
  text-align: center;
  padding: 40px 20px;
  color: #f56c6c;
}
.error-message {
  font-size: 14px;
  color: #909399;
}
.posts-list {
  overflow: visible;
}
.post-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}
.user-info {
  margin-left: 15px;
}
.hostname {
  font-weight: bold;
  font-size: 16px;
}
.post-content .post-title {
  margin-top: 0;
  margin-bottom: 8px;
}
.post-content p {
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
}
.post-pictures {
  margin-top: 15px;
  display: grid;
  gap: 8px;
}
.grid-1 { grid-template-columns: minmax(0, 2fr); }
.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(2, 1fr); }
.grid-5, .grid-6, .grid-7, .grid-8, .grid-9 { grid-template-columns: repeat(3, 1fr); }
.picture-item .el-image {
  width: 100%;
  height: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 6px;
  object-fit: cover;
}
.post-footer {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: #8a919f;
}
.action-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}
</style>