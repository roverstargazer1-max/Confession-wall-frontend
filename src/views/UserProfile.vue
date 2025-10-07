<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { Post, User } from '@/types/HomeType'
import { getUserInfoApi } from '@/api/users'
import { otherPostGetApi, type otherPostGet, blackApi, unBlackApi, blackGetApi } from '@/api/otherUser'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

// 导入 Element Plus 图标，用于帖子展示
import { ChatDotRound } from '@element-plus/icons-vue'
import { lo } from 'element-plus/es/locales.mjs'

const route = useRoute()
const userStore = useUserStore()

// 存储用户信息和帖子列表
const userInfo = ref<User | null>(null)
const userPosts = ref<Post[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const isBlacked = ref(false)

/**
 * 根据用户ID获取用户信息和帖子列表
 * @param id - 目标用户的ID
 */
const fetchUserData = async (id: number) => {
  if (isNaN(id)) {
    error.value = "无效的用户ID";
    return;
  }
  
  const loggedInUserId = userStore.userInfo.id;

  // **【修正】** 明确检查 loggedInUserId 是否为 null 或 undefined
  // 这样 ID 为 0 的用户也能被正确识别
  if (loggedInUserId == null) {
    error.value = "无法获取您的登录信息，请重新登录。";
    return;
  }

  isLoading.value = true
  error.value = null
  console.log(`正在获取 ID 为 ${id} 的用户信息...`)
  
  try {
    const apiParams: otherPostGet = { userId: id }
    const [infoResponse, postsResponse, blackListResponse] = await Promise.all([
      getUserInfoApi(apiParams),
      otherPostGetApi(apiParams),
      blackGetApi({ userId: loggedInUserId })
    ])
    console.log(infoResponse,postsResponse,blackListResponse)
    // 处理用户信息请求结果
    if (infoResponse.data.code === 200) {
      userInfo.value = infoResponse.data.data
    } else {
      throw new Error(infoResponse.data.message || '获取用户信息失败')
    }

    // 处理用户帖子请求结果
    if (postsResponse.data.code === 200) {
      userPosts.value = postsResponse.data.data
    } else {
      throw new Error(postsResponse.data.message || '获取用户帖子失败')
    }

    // 处理拉黑列表结果

    if (blackListResponse.data.code === 200) {
      const targetUserId = Number(id);
      isBlacked.value = blackListResponse.data.data.includes(targetUserId);
    } else {
      console.error('获取我的拉黑列表失败')
    }

  } catch (err: any) {
    console.error("获取用户数据失败:", err)
    error.value = err.message || "加载数据时发生未知错误。"
  } finally {
    isLoading.value = false
  }
}

// 拉黑用户
const handleBlock = async () => {
  try {
    const userId = Number(route.params.id)
    const response = await blackApi({ target_id: userId });
    if (response.data.code === 200) {
      ElMessage.success('拉黑成功');
      isBlacked.value = true;
    } else {
      ElMessage.error(response.data.msg || '操作失败');
    }
  } catch (error) {
    ElMessage.error('操作失败，请重试');
  }
};

// 取消拉黑用户
const handleUnblock = async () => {
  try {
    const userId = Number(route.params.id)
    console.log(userId)
    const Response = await unBlackApi({ target_id: userId })
    console.log(Response)

    if (Response.data.code === 200) {
      ElMessage.success('已取消拉黑');
      isBlacked.value = false;
    } else {
      ElMessage.error(Response.data.msg || '操作失败');
    }
  } catch (error) {
    ElMessage.error('操作失败，请重试');
  }
};

onMounted(() => {
  const userId = Number(route.params.id)
  fetchUserData(userId)
})

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      fetchUserData(Number(newId))
    }
  }
)
</script>

<template>
  <div class="user-profile-container">
    <div v-if="isLoading" class="loading-tip">未加载出...</div>
    
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
        <div class="actions">
          <el-button v-if="isBlacked" type="info" @click="handleUnblock">取消拉黑</el-button>
          <el-button v-else type="danger" @click="handleBlock">拉黑</el-button>
        </div>
      </header>

      <div class="user-posts-section">
        <h2>发布的帖子</h2>
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
          <p>该用户还没有发布任何帖子。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 为用户主页添加样式 */
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

.actions {
  margin-left: auto;
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


/* 复用 HomeView 的帖子卡片样式，保证UI统一 */
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