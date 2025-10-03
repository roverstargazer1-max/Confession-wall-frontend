import { defineStore } from 'pinia'
import type { Post } from '@/types/HomeType'
import { homeGetApi } from '@/api/home'
// 模拟的 API 响应数据
// const sampleApiResponse = {
//     "code": 200,
//     "msg": "OK",
//     "data": [
//         // ... 此处省略您提供的完整 data 数组 ...
//         // 为了演示加载效果，我只保留几条
//         { "id": 1, "host": 2, "title": "BiliBili的蜂群大家好!", "content": "10月舰长海报还在制作中~请蜂群耐心等待哦", "depth": 1, "hidden": false, "likes": 64, "comments": 3, "hostname": "Vedal和Neuro-sama", "hostportrait": { "width": 322, "height": 322, "url": "https://i.pravatar.cc/50?u=1" }, "subcomments": [], "pictures": [ { "width": 4, "height": 4, "url": "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg" }, { "width": 4, "height": 4, "url": "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg" }, { "width": 4, "height": 4, "url": "https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg" } ], "liked": false },
//         { "id": 3, "host": 2, "title": "刺杀小说家2周边", "content": "赤发鬼归位，双世危机再燃！《刺杀小说家2》周边众筹正式开冲！", "depth": 1, "hidden": false, "likes": 102, "comments": 15, "hostname": "哔哩哔哩会员购", "hostportrait": { "width": 322, "height": 322, "url": "https://i.pravatar.cc/50?u=2" }, "subcomments": null, "pictures": [ { "width": 322, "height": 322, "url": "https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg" } ], "liked": true },
//         // 更多数据...
//     ]
// };
// src/stores/homePosts.ts

// 【修改】这个函数现在应该直接返回帖子数组
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
  },
})