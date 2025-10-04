import { defineStore } from 'pinia'
import type { Post, Comment } from '@/types/HomeType' 
import { homeGetApi, postLikeApi, commentGetApi, commentPostApi, secondCommentApi, commentLikeApi } from '@/api/home'
import { ElMessage } from 'element-plus'

const fetchPostsFromApi = async (page: number, limit: number): Promise<Post[]> => {
  try {
    const response = await homeGetApi();
    if (response.data && response.data.code === 200 && Array.isArray(response.data.data)) {
      // 初始化每个帖子的评论区状态
      return response.data.data.map((post :Post) => ({
        ...post,
        showComments: false, // 默认不显示评论区
        commentsData: []     // 评论数据初始化为空数组
      }));
    } else {
      console.error("API response 格式错误:", response.data);
      return [];
    }
  } catch (error) {
    console.error("API 请求失败:", error);
    return [];
  }
};

export const useHomePostsStore = defineStore('homePosts', {
  state: () => ({
    posts: [] as Post[],
    isLoading: false,
    page: 1,
    hasMore: true,
  }),
  actions: {
    async fetchPosts() {
      if (this.isLoading || !this.hasMore) return;
      this.isLoading = true;
      try {
        const limit = 5;
        const newPosts = await fetchPostsFromApi(this.page, limit);
        if (newPosts.length > 0) {
          this.posts.push(...newPosts);
          this.page++;
        } else {
          this.hasMore = false;
        }
      } catch (error) {
        console.error("获取失败", error);
      } finally {
        this.isLoading = false;
      }
    },
    async toggleLikeStatus(postId: number) {
        const post = this.posts.find(p => p.postId === postId);
        if (!post) return;

        const originalLiked = post.liked;
        const originalLikes = post.likes;

        post.liked = !originalLiked;
        post.likes += originalLiked ? -1 : 1;
        
        try {
            await postLikeApi({ postId });
        } catch (error) {
            post.liked = originalLiked;
            post.likes = originalLikes;
            ElMessage.error('操作失败，请重试');
        }
    },
    
    // 获取评论
    async fetchComments(postId: number) {
      const post = this.posts.find(p => p.postId === postId);
      if (!post) return;

      try {
        const res = await commentGetApi({ postId });
        if (res.data.code === 200) {
          const commentsWithState = res.data.data.map((comment: Comment) => ({
            ...comment,
            showReply: false 
          }));
          post.commentsData = commentsWithState || [];
        } else {
          ElMessage.error('加载评论失败');
        }
      } catch (error) {
        console.error("获取评论失败:", error);
        ElMessage.error('加载评论失败');
      }
    },

    async toggleCommentSection(postId: number) {
        const post = this.posts.find(p => p.postId === postId);
        if (!post) return;

        post.showComments = !post.showComments;

        if (post.showComments && post.commentsData?.length === 0) {
            this.fetchComments(postId);
        }
    },
    async addComment(postId: number, content: string) {
        if (!content.trim()) {
            ElMessage.warning('评论内容不能为空');
            return;
        }
        
        try {
            const res = await commentPostApi({ postId, content });
            if (res.data.code === 200) {
                ElMessage.success('评论成功');
                this.fetchComments(postId);
            } else {
                ElMessage.error(res.data.msg || '评论失败');
            }
        } catch (error) {
            console.error("评论失败:", error);
            ElMessage.error('评论失败');
        }
    },

    // 切换评论点赞状态
    async toggleCommentLike(postId: number, commentId: number) {
      const post = this.posts.find(p => p.postId === postId);
      // [修正] 使用正确的 commentId 进行查找
      const comment = post?.commentsData.find(c => c.commentId === commentId);
      if (!comment) return;

      const originalLiked = comment.liked;
      const originalLikes = comment.likes;
      comment.liked = !comment.liked;
      comment.likes += comment.liked ? 1 : -1;

      try {
        await commentLikeApi({ commentId });
      } catch (error) {
        comment.liked = originalLiked;
        comment.likes = originalLikes;
        ElMessage.error('点赞失败，请重试');
      }
    },

    // 切换回复输入框的显示
    toggleReplyBox(postId: number, commentId: number) {
      const post = this.posts.find(p => p.postId === postId);
      // [修正] 使用正确的 commentId 进行查找
      const comment = post?.commentsData.find(c => c.commentId === commentId);
      if (comment) {
        comment.showReply = !comment.showReply;
      }
    },

    // 提交回复
    async submitReply(postId: number, commentId: number, content: string) {
      if (!content.trim()) {
        ElMessage.warning('回复内容不能为空');
        return;
      }
      try {
        await secondCommentApi({ commentId, content });
        ElMessage.success('回复成功');
        await this.fetchComments(postId);
      } catch (error) {
        ElMessage.error('回复失败，请重试');
      }
    }
  },  
})