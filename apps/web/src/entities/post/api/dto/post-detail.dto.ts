import type { ApiResponse } from '@/src/shared/api';

export interface PostAuthorType {
  userId: number;
  profileImageUrl: string;
  nickname: string;
  level: number;
  streak: number;
}

export interface PostTagType {
  tagId: number;
  name: string;
}

export interface PostDetailDataType {
  postId: number;
  isAuthor: boolean;
  author: PostAuthorType;
  title: string;
  content: string;
  images: string[];
  tags: PostTagType[];
  likeCount: number;
  createdAt: string;
  isLiked: boolean;
}

export interface PostDetailResponseDataType {
  post: PostDetailDataType;
}

export type PostDetailResponseDTO = ApiResponse<PostDetailResponseDataType>;
