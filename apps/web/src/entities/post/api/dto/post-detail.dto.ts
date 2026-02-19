import type { ApiResponse } from '@/src/shared/api';

export interface PostAuthor {
  userId: number;
  profileImageUrl: string;
  nickname: string;
  level: number;
  streak: number;
}

export interface PostTag {
  tagId: number;
  name: string;
}

export interface PostDetailData {
  postId: number;
  isAuthor: boolean;
  author: PostAuthor;
  title: string;
  content: string;
  images: string[];
  tags: PostTag[];
  likeCount: number;
  createdAt: string;
  isLiked: boolean;
}

export interface PostDetailResponseData {
  post: PostDetailData;
}

export type PostDetailResponse = ApiResponse<PostDetailResponseData>;
