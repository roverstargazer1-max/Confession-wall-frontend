<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Edit, ChatDotRound, Promotion } from '@element-plus/icons-vue' // 引入 Promotion 图标
import { useHomePostsStore } from '@/stores/homePosts'
import type { Post } from '@/types/HomeType' // 引入 Post 类型

const homePostsStore = useHomePostsStore()
const { posts, isLoading, hasMore } = storeToRefs(homePostsStore)

// 为每个帖子创建一个独立的评论输入框内容
const newCommentText = ref<{ [key: number]: string }>({})

onMounted(() => {
  if (posts.value.length === 0) {
    homePostsStore.fetchPosts()
  }
})

const loadMore = () => {
  homePostsStore.fetchPosts()
}

const handlePostLike = (postId: number) => {
  homePostsStore.toggleLikeStatus(postId)
}

// 【修改】点击评论图标时，调用 store action
const handleCommentIconClick = (postId: number) => {
  homePostsStore.toggleCommentSection(postId)
}

// 【新增】提交评论的处理函数
const submitComment = async (post: Post) => {
  const content = newCommentText.value[post.postId]
  if (!content || !content.trim()) {
    return;
  }
  await homePostsStore.addComment(post.postId, content)
  // 成功后清空输入框
  newCommentText.value[post.postId] = ''
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
          <div class="action-item" @click="handleCommentIconClick(post.postId)">
            <el-button text>
                <el-icon><ChatDotRound /></el-icon>
            </el-button>
            <span>{{ post.comments > 0 ? post.comments : '评论' }}</span>
          </div>
          
          <div class="action-item" @click="handlePostLike(post.postId)">
            <el-button text :style="{ color: post.liked ? 'red' : 'inherit' }">
                ❤️
            </el-button>
            <span>{{ post.likes > 0 ? post.likes : '点赞' }}</span>
          </div>
        </div>

        <div v-if="post.showComments" class="comment-section">
          <div class="comment-input-area">
            <el-input
              v-model="newCommentText[post.postId]"
              placeholder="发布你的评论..."
              :rows="2"
              type="textarea"
              resize="none"
              @keyup.enter="submitComment(post)"
            />
            <el-button
              type="primary"
              :icon="Promotion"
              circle
              @click="submitComment(post)"
            />
          </div>
          <div v-if="post.commentsData && post.commentsData.length > 0" class="comment-list">
            <div v-for="comment in post.commentsData" :key="comment.subcommentId" class="comment-item">
              <el-avatar :size="35" :src="comment.hostportrait.url" />
              <div class="comment-content">
                <span class="comment-hostname">{{ comment.hostname }}</span>
                <p class="comment-text">{{ comment.content }}</p>
              </div>
            </div>
          </div>
          <p v-else class="no-comments">暂无评论</p>
        </div>
      </div>

      <p v-if="isLoading" class="loading-tip">加载中...</p>
      <p v-if="!hasMore && posts.length > 0" class="loading-tip">没有更多了</p>
    </div>
  </div>
</template>

<style scoped lang="scss">

/* 【新增】评论区样式 */
.comment-section {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f0f2f5;
}

.comment-input-area {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.comment-item {
  display: flex;
  gap: 10px;
}

.comment-content {
  display: flex;
  flex-direction: column;
}

.comment-hostname {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
}

.comment-text {
  margin: 0;
  line-height: 1.5;
  font-size: 14px;
}

.no-comments {
  color: #909399;
  font-size: 14px;
}

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
  justify-content: space-around; /* 改为 space-around 使其分布更均匀 */
  align-items: center;
  color: #8a919f;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 8px; /* 图标和文字的间距 */
  cursor: pointer;
  transition: color 0.2s;
  font-size: 14px;
}

.action-item:hover {
  color: #409eff;
}

.loading-tip {
  text-align: center;
  color: #909399;
  padding: 20px;
}
</style>