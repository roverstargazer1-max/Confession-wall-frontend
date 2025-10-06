// index.ts

// 帖子基础类型
export interface Post {
  id: number;
  content: string;
  images: string[];
  isAnonymous: boolean;
  isPublic: boolean;
  scheduledTime?: string;
  createdAt: string;
  updatedAt?: string;
  authorId: string;
  authorName: string;
  likeCount?: number;
  commentCount?: number;
}

// API响应类型
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  msg: string; 
  success?: boolean;
}

// 【已修改】创建帖子请求数据类型 - 与API文档对齐
export interface CreatePostRequest {
  title: string; // 【新增】
  content: string;
  images: File[]; 
  anonymity: boolean; // 【重命名】isAnonymous -> anonymity
  isPublic: boolean;
  // 【移除】scheduledTime
}

// 上传图片类型
export interface UploadImage {
  url: string;
  file?: File;
  uid: string;
  name?: string;
  status?: 'success' | 'uploading' | 'error';
}

// 【已修改】发帖表单数据类型 - 与API文档对齐
export interface PostFormData {
  title: string; // 【新增】
  content: string;
  anonymity: boolean; // 【重命名】isAnonymous -> anonymity
  isPublic: boolean;
  images: UploadImage[];
  // 【移除】scheduledTime
}