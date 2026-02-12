import type { ApiResponse } from '@/src/shared/api';

export interface ProfileImageUploadUrlRequestDTO {
  fileName: string;
  contentType: string;
}

export interface ProfileImageUploadUrlDataType {
  uploadUrl: string;
  filePath: string;
  expiresAt: string;
}

export type ProfileImageUploadUrlResponseDTO = ApiResponse<ProfileImageUploadUrlDataType>;
