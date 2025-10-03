// src/types/index.ts

export interface Picture {
  width: number;
  height: number;
  url: string;
}

export interface HostPortrait {
  width: number;
  height: number;
  url: string;
}

export interface Post {
  postId: number;
  host: number;
  title: string;
  content: string;
  depth: number;
  hidden: boolean;
  likes: number;
  comments: number;
  hostname: string;
  hostportrait: HostPortrait;
  subcomments: any[] | null; // 根据实际情况可定义更具体的类型
  pictures: Picture[] | null;
  liked: boolean;
}