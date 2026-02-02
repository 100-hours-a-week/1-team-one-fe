import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import { type ApiError, type ApiResponse, getHttpClient } from '@/src/shared/api';

export type ProfileImageUploadUrlRequest = {
  fileName: string;
  contentType: string;
};

export type ProfileImageUploadUrlData = {
  uploadUrl: string;
  filePath: string;
  expiresAt: string;
};

type ProfileImageUploadUrlResponse = ApiResponse<ProfileImageUploadUrlData>;

export const PROFILE_IMAGE_UPLOAD_ERROR_CODE = 'PROFILE_IMAGE_UPLOAD_FAILED';

async function requestProfileImageUploadUrl(
  payload: ProfileImageUploadUrlRequest,
): Promise<ProfileImageUploadUrlData> {
  const client = getHttpClient();
  const response = await client.post<ProfileImageUploadUrlResponse>(
    '/images/upload-url/profile',
    payload,
  );

  return response.data.data;
}

export async function uploadToPresignedPut(
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

export type ProfileImageUploadMutationOptions = Omit<
  UseMutationOptions<ProfileImageUploadUrlData, ApiError, ProfileImageUploadUrlRequest>,
  'mutationFn'
>;

export function useProfileImageUploadMutation(options?: ProfileImageUploadMutationOptions) {
  return useMutation({
    mutationFn: requestProfileImageUploadUrl,
    ...options,
    meta: { ...options?.meta, disableToast: true },
  });
}
