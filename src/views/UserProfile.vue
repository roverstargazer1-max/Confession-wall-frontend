<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

// 使用 useRoute 来访问当前路由信息
const route = useRoute()

// 存储用户ID和用户信息
const userId = ref<string | string[]>('')
const userInfo = ref<any>(null) // 你可以为此创建一个更具体的类型
const userPosts = ref<any[]>([]) // 存储用户的帖子
const isLoading = ref(false)

// 模拟一个API调用函数来获取用户信息
const fetchUserData = async (id: string | string[]) => {
  if (!id) return
  isLoading.value = true
  console.log(`正在获取 ID 为 ${id} 的用户信息...`)
  
  try {
    // --- 在这里，你需要调用真实的API来获取用户信息和该用户的帖子 ---
    // 下面是模拟数据
    await new Promise(resolve => setTimeout(resolve, 500)); // 模拟网络延迟
    
    // 模拟用户信息
    userInfo.value = {
      id: id,
      hostname: `用户${id}`,
      avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      bio: '这个人很懒，什么都没有留下...',
    }
    // 模拟用户的帖子列表
    userPosts.value = [
      { postId: 101, title: '我的第一篇帖子', content: '这是我的主页！' },
      { postId: 102, title: '关于Vue', content: 'Vue真好用！' },
    ]

  } catch (error) {
    console.error("获取用户数据失败:", error)
  } finally {
    isLoading.value = false
  }
}

// 组件挂载时，获取初始用户ID并加载数据
onMounted(() => {
  userId.value = route.params.userId
  fetchUserData(userId.value)
})

// 监听路由参数的变化（例如从一个用户主页跳转到另一个用户主页）
watch(
  () => route.params.userId,
  (newUserId) => {
    if (newUserId) {
      userId.value = newUserId
      fetchUserData(newUserId)
    }
  }
)

</script>

<template>
  <div class="user-profile-container" v-if="!isLoading && userInfo">
    <header class="profile-header">
      <el-avatar :size="80" :src="userInfo.avatar" />
      <div class="profile-info">
        <h1>{{ userInfo.hostname }}</h1>
        <p>{{ userInfo.bio }}</p>
      </div>
    </header>

    <div class="posts-section">
      <h2>TA的帖子</h2>
      <div v-if="userPosts.length > 0" class="user-posts-list">
        <div v-for="post in userPosts" :key="post.postId" class="post-item">
          <h3>{{ post.title }}</h3>
          <p>{{ post.content }}</p>
        </div>
      </div>
      <p v-else>这位用户还没有发布任何帖子。</p>
    </div>
  </div>
  <div v-else class="loading-state">
    <p>正在加载用户数据...</p>
  </div>
</template>

<style scoped lang="scss">
.user-profile-container {
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.profile-info h1 {
  margin: 0;
  font-size: 24px;
}

.profile-info p {
  margin-top: 8px;
  color: #606266;
}

.posts-section {
  margin-top: 30px;
}

.user-posts-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.post-item { 
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.loading-state {
  text-align: center;
  padding: 50px;
  color: #909399;
}
</style>