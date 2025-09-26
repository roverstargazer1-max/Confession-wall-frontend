// src/types/index.ts
export interface Post {
  id: string;
  content: string;
  isAnonymous: boolean; //是否匿名阀体
  isPublic: boolean; //是否公开
  authorId: string; //作者编号，其实改成userid也一样
  authorName: string;
  createdAt: string;
  updatedAt?: string;
}
