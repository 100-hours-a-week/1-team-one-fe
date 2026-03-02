import type { ApiResponse } from '@/src/shared/api';

import type { PostAuthorType } from './post-detail.dto';

export interface PostMetaDataType {
  postId: number;
  author: PostAuthorType;
  likeCount: number;
  isLiked: boolean;
  isAuthor: boolean;
}

export interface PostMetaResponseDataType {
  post: PostMetaDataType;
}

export type PostMetaResponseDTO = ApiResponse<PostMetaResponseDataType | null>;

export interface PostListMetaItemType {
  postId: number;
  author: PostAuthorType;
  likeCount: number;
  isLiked: boolean;
  isAuthor: boolean;
}

export interface PostListMetaDataType {
  posts: PostListMetaItemType[];
  paging: { nextCursor: string | null; hasNext: boolean };
}

export type PostListMetaResponseDTO = ApiResponse<PostListMetaDataType | null>;
