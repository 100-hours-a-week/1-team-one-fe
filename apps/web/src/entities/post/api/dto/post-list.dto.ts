import type { ApiResponse } from '@/src/shared/api';

import type { PostAuthorType, PostTagType } from './post-detail.dto';

export interface PostListItemType {
  postId: number;
  author: PostAuthorType;
  title: string;
  content: string;
  imageUrl: string | null;
  tags: PostTagType[];
  likeCount: number;
  createdAt: string;
  isLiked: boolean;
}

export interface PostListPagingType {
  nextCursor: string | null;
  hasNext: boolean;
}

export interface PostListResponseDataType {
  posts: PostListItemType[];
  paging: PostListPagingType;
}

export type PostListResponseDTO = ApiResponse<PostListResponseDataType>;
