import type { ApiResponse } from '@/src/shared/api';

export interface PostImageUploadUrlRequestDTO {
  fileName: string;
  contentType: string;
}

export interface PostImageUploadUrlDataType {
  uploadUrl: string;
  filePath: string;
  expiresAt: string;
}

export type PostImageUploadUrlResponseDTO = ApiResponse<PostImageUploadUrlDataType>;
