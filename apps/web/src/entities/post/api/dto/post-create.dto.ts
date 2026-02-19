import type { ApiResponse } from '@/src/shared/api';

export interface PostCreateRequestDTO {
  title: string;
  content: string;
  tags?: string[];
  images?: string[];
}

export interface PostCreateDataType {
  postId: number;
}

export type PostCreateResponseDTO = ApiResponse<PostCreateDataType>;
