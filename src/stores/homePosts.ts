import { defineStore } from 'pinia'
import type { Post } from '@/types/HomeType'
import { homeGetApi, postLikeApi  } from '@/api/home'
import { ElMessage } from 'element-plus'

const fetchPostsFromApi = async (page: number, limit: number): Promise<Post[]> => {
  console.log(`Fetching page ${page} with limit ${limit}`);
  try {
    const response = await homeGetApi();
    // 【关键修改】检查API响应成功，并返回最内层的 data 数组
    if (response.data && response.data.code === 200 && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.error("API response is not in the expected format:", response.data);
      return []; // 返回空数组以防出错
    }
  } catch (error) {
    console.error("API request failed:", error);
    return []; // 请求失败也返回空数组
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
        // 现在 newPosts 已经是正确的帖子数组了
        const newPosts = await fetchPostsFromApi(this.page, limit);

        // 这个判断现在可以正常工作了
        if (newPosts.length > 0) {
          this.posts.push(...newPosts);
          this.page++;
        } else {
          this.hasMore = false;
        }
      } catch (error) {
        console.error("Failed to process posts:", error);
      } finally {
        this.isLoading = false;
      }
    },
    // 【新增】处理点赞/取消点赞的 action
    async toggleLikeStatus(postId: number) {
      // 1. 在 state 中找到要操作的帖子
      const post = this.posts.find(p => p.postId === postId);
      if (!post) {
        console.error('未找到要点赞的帖子');
        return;
      }

      // 先保存原始状态，然后立即修改 UI
      const originalLiked = post.liked;
      const originalLikes = post.likes;

      if (originalLiked) {
        // 如果已点赞，则取消点赞
        post.liked = false;
        post.likes--;
      } else {
        // 如果未点赞，则点赞
        post.liked = true;
        post.likes++;
      }

      // 3. 调用 API
      try {
        if (!originalLiked) {
          // 调用点赞接口
          await postLikeApi({ postId });;
        } 
      } catch (error) {
        // 4. "回滚"：如果 API 调用失败，将 UI 状态恢复到原始状态
        console.error('点赞操作失败:', error);
        post.liked = originalLiked;
        post.likes = originalLikes;
        ElMessage.error('操作失败，请重试');
      }
    }
  },  
})