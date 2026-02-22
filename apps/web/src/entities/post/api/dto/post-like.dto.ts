import type { ApiResponse } from '@/src/shared/api';

export interface PostLikeDataType {
  postId: number;
  isLiked: boolean;
}

export interface PostLikeRequestDTO {
  liked: boolean;
}

export type PostLikeResponseDTO = ApiResponse<PostLikeDataType>;
