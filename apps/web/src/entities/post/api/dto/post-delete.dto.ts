import type { ApiResponse } from '@/src/shared/api';

export interface PostDeleteRequestDTO {
  postId: number;
}

export type PostDeleteDataType = Record<string, never>;

export type PostDeleteResponseDTO = ApiResponse<PostDeleteDataType>;
