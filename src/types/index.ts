// 帖子基础类型
export interface Post {
  id: string;
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
  message: string;
  success?: boolean;
}

// 创建帖子请求数据类型 - 用于FormData格式
export interface CreatePostRequest {
  content: string;
  images: File[]; // 改为File数组，直接上传文件
  isAnonymous: boolean;
  isPublic: boolean;
  scheduledTime?: string;
}

// 上传图片类型
export interface UploadImage {
  url: string;
  file?: File;
  uid: string;
  name?: string;
  status?: 'success' | 'uploading' | 'error';
}

// 发帖表单数据类型
export interface PostFormData {
  content: string;
  isAnonymous: boolean;
  isPublic: boolean;
  scheduledTime: string | null;
  images: UploadImage[];
}