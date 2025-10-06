// API `/api/user/{id}` 返回的用户信息结构
export interface User {
  id: number;
  name: string; // 注意：API返回的是 name
  username: string;
  portrait: {
    url: string;
    width: number;
    height: number;
  } | null;
  type: number;
  isBlacked?: boolean; // 新增字段
}

// 帖子/评论中使用的头像结构
export interface HostPortrait {
  width: number;
  height: number;
  url: string;
}

// 帖子中的图片结构
export interface Picture {
  width: number;
  height: number;
  url: string;
}

// API `/api/post/homepage` 和 `/api/user/{id}/posts` 返回的帖子结构
export interface Post {
  postId: number;
  host: number; // 用户ID
  hostname: string; // 用户名
  hostportrait: HostPortrait; // 用户头像
  title: string;
  content: string;
  depth: number;
  hidden: boolean;
  likes: number;
  comments: number;
  pictures: Picture[] | null;
  liked: boolean;
  subcomments: any[] | null;

  // UI 控制属性
  showComments: boolean;
  commentsData: Comment[];

  anonymity: boolean;
  isPublic:boolean
}

// API `/api/post/{id}/comments` 返回的评论结构
export interface Comment {
  commentId: number; // 文档中是 commentId
  host: number; // 用户ID
  hostname: string; // 用户名
  hostportrait: HostPortrait; // 用户头像
  content: string;
  likes: number;
  liked: boolean;
  subcomments: any[] | null;
  depth: number;

  // UI 控制属性
  showReply?: boolean;
}
