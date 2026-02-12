import { getHttpClient } from '@/src/shared/api';

import type {
  ProfileImageUploadUrlDataType,
  ProfileImageUploadUrlRequestDTO,
  ProfileImageUploadUrlResponseDTO,
} from './dto/profile-image-upload.dto';

export const PROFILE_IMAGE_UPLOAD_ERROR_CODE = 'PROFILE_IMAGE_UPLOAD_FAILED';

export async function requestProfileImageUploadUrlFn(
  payload: ProfileImageUploadUrlRequestDTO,
): Promise<ProfileImageUploadUrlDataType> {
  const client = getHttpClient();
  const response = await client.post<ProfileImageUploadUrlResponseDTO>(
    '/images/upload-url/profile',
    payload,
  );

  return response.data.data;
}

export async function uploadToPresignedPutFn(
  uploadUrl: string,
  file: File,
  contentType: string,
): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType || 'application/octet-stream',
    },
    body: file,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`${PROFILE_IMAGE_UPLOAD_ERROR_CODE}:${response.status}:${text}`);
  }
}
