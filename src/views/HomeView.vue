<script lang="ts" setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
// 【新增】从 element-plus/icons-vue 导入 Thumb 图标
import { Edit, ChatDotRound } from '@element-plus/icons-vue' 
import { useHomePostsStore } from '@/stores/homePosts'

const homePostsStore = useHomePostsStore()
const { posts, isLoading, hasMore } = storeToRefs(homePostsStore)

onMounted(() => {
  if (posts.value.length === 0) {
    homePostsStore.fetchPosts()
  }
})

const loadMore = () => {
  homePostsStore.fetchPosts()
}

// 【修改】处理点赞的函数，现在它调用 store action
const handlePostLike = (postId: number) => {
  homePostsStore.toggleLikeStatus(postId)
}
</script>

<template>
  <div class="home-container">
    <header class="home-header">
      <h1>主页</h1>
      <RouterLink to="/post" class="create-post-btn">
        <el-button type="primary" :icon="Edit">发布新帖子</el-button>
      </RouterLink>
    </header>

    <div
      v-infinite-scroll="loadMore"
      :infinite-scroll-disabled="isLoading || !hasMore"
      class="posts-list"
    >
      <div v-for="post in posts" :key="post.postId" class="post-card">
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
            <el-button text>
                <el-icon><ChatDotRound /></el-icon>
            </el-button>
            <span>{{ post.comments > 0 ? post.comments : '评论' }}</span>
          </div>
          
          <div 
            class="action-item" 
            :class="{ liked: post.liked }" 
            @click="handlePostLike(post.postId)"
          >
            <el-button text>❤️</el-button>
            <span>{{ post.likes > 0 ? post.likes : '点赞' }}</span>
          </div>
        </div>
      </div>

      <p v-if="isLoading" class="loading-tip">加载中...</p>
      <p v-if="!hasMore && posts.length > 0" class="loading-tip">没有更多了</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 1rem;
}

.posts-list {
  height: calc(100vh - 200px); /* 示例高度，确保可滚动 */
  overflow: auto;
  padding-right: 10px; /* 防止滚动条遮挡内容 */
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
  white-space: pre-wrap; /* 保留文本中的换行符 */
}

.post-pictures {
  margin-top: 15px;
  display: grid;
  gap: 8px;
}

/* 动态网格布局，最多支持3x3 */
.grid-1 { grid-template-columns: minmax(0, 2fr); } /* 单张图稍大一些 */
.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(2, 1fr); }
.grid-5, .grid-6 { grid-template-columns: repeat(3, 1fr); }
.grid-7, .grid-8, .grid-9 { grid-template-columns: repeat(3, 1fr); }


.picture-item .el-image {
  width: 100%;
  height: 100%;
  aspect-ratio: 1 / 1; /* 保持图片为正方形 */
  border-radius: 6px;
  object-fit: cover;
}


.post-footer {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between; /* 两端对齐 */
  align-items: center;
  color: #8a919f;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 8px; /* 图标和文字的间距 */
  cursor: pointer;
  transition: color 0.2s;
}

.action-item:hover {
  color: #409eff;
}

/* 当 action-item 拥有 liked 类时，改变其颜色 */
.action-item.liked {
  color: #409eff; /* 已点赞状态的颜色 */
}

.loading-tip {
  text-align: center;
  color: #909399;
  padding: 20px;
}
</style>