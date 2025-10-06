export interface upDataPost {
  newTitle: string;
  newContent: string;
  anonymity: boolean; //是否匿名
  isPublic: boolean; //是否公开
  postId: number;
  // 【修改】将 pictures 分为两部分
  existingPictures: string[]; // 保留的现有图片的URL列表
  newPictures: File[];        // 新上传的图片文件列表
}

export interface deletePost {
  postId: number;
}