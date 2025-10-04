<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Edit, ChatDotRound, Promotion, Present } from '@element-plus/icons-vue'
import { useHomePostsStore } from '@/stores/homePosts'
import type { Post, Comment } from '@/types/HomeType' 

const homePostsStore = useHomePostsStore()
const { posts, isLoading, hasMore } = storeToRefs(homePostsStore)

const newCommentText = ref<{ [key: number]: string }>({})
const replyTexts = ref<{ [key: number]: string }>({})

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

const handleCommentIconClick = (postId: number) => {
  homePostsStore.toggleCommentSection(postId)
}

const submitComment = async (post: Post) => {
  const content = newCommentText.value[post.postId]
  if (!content || !content.trim()) {
    return;
  }
  await homePostsStore.addComment(post.postId, content)
  newCommentText.value[post.postId] = ''
}

const handleCommentLike = (postId: number, commentId: number) => {
  homePostsStore.toggleCommentLike(postId, commentId);
};

const handleToggleReply = (postId: number, commentId: number) => {
  homePostsStore.toggleReplyBox(postId, commentId);
};

const handleSubmitReply = async (postId: number, comment: Comment) => {
  const content = replyTexts.value[comment.commentId]; // 使用 commentId
  if (!content) return;

  await homePostsStore.submitReply(postId, comment.commentId, content);
  
  replyTexts.value[comment.commentId] = '';
};
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
          <router-link :to="`/user/${post.host}`" target="_blank">
            <el-avatar :size="50" :src="post.hostportrait.url" />
          </router-link>
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
            <div v-for="comment in post.commentsData" :key="comment.commentId" class="comment-item">
              <router-link :to="`/user/${comment.host}`" class="hostname-link" target="_blank">
                <el-avatar :size="35" :src="comment.hostportrait.url" />
              </router-link>
              <div class="comment-main">
                <div class="comment-content">
                  <span class="comment-hostname">{{ comment.hostname }}</span>
                  <p class="comment-text">{{ comment.content }}</p>
                </div>

                <div class="comment-actions">
                  <span class="action-btn" :class="{ 'liked': comment.liked }" @click="handleCommentLike(post.postId, comment.commentId)">
                    <el-icon><Present /></el-icon> {{ comment.likes }}
                  </span>
                  <span class="action-btn" @click="handleToggleReply(post.postId, comment.commentId)">回复</span>
                </div>

                <div v-if="comment.showReply" class="reply-input-area">
                   <el-input
                      v-model="replyTexts[comment.commentId]"
                      :placeholder="`回复 @${comment.hostname}`"
                      size="small"
                   />
                   <el-button type="primary" size="small" @click="handleSubmitReply(post.postId, comment)">发送</el-button>
                </div>
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
/* 样式部分无需修改，所以省略 */
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
.comment-main {
  flex: 1;
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
  height: calc(100vh - 200px); 
  overflow: auto;
  padding-right: 10px; 
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
.comment-actions {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}
.action-btn {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}
.action-btn:hover {
  color: #409eff;
}
.action-btn.liked {
  color: #409eff;
}
.reply-input-area {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
</style>