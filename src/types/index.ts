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
  images:string[]
}
export interface Confession {
  id?: string;
  content: string;
  anonymous: boolean;
  isPublic: boolean;
  images: string[]; // 图片URL数组
  scheduledTime?: string; // 定时发送时间，ISO格式
  createdAt?: string; // 创建时间
  author?: string; // 作者，匿名时为null
}

export interface ImageFile {
  file: File;
  url: string; // 临时URL用于预览
}

export enum PublishStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published'
}
