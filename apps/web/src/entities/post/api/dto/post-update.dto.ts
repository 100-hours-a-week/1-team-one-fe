import type { ApiResponse } from '@/src/shared/api';

export interface PostUpdateRequestDTO {
  postId: number;
  title: string;
  content: string;
  tags?: string[];
  images?: string[];
}

export type PostUpdateDataType = Record<string, never>;

export type PostUpdateResponseDTO = ApiResponse<PostUpdateDataType>;
