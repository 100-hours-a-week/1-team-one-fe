import { getHttpClient } from '@/src/shared/api';
import type { MomentsPostImageItem } from '@/src/shared/types';

import type {
  PostImageUploadUrlDataType,
  PostImageUploadUrlRequestDTO,
  PostImageUploadUrlResponseDTO,
} from './dto/post-image-upload.dto';

export const POST_IMAGE_UPLOAD_ERROR_CODE = 'POST_IMAGE_UPLOAD_FAILED';

export async function requestPostImageUploadUrlFn(
  payload: PostImageUploadUrlRequestDTO,
): Promise<PostImageUploadUrlDataType> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.post<PostImageUploadUrlResponseDTO>(
    '/images/upload-url/post',
    payload,
  );

  return response.data.data;
}

export async function uploadPostImageToPresignedPutFn(
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
    throw new Error(`${POST_IMAGE_UPLOAD_ERROR_CODE}:${response.status}:${text}`);
  }
}

export async function resolvePostImagePaths(images: MomentsPostImageItem[]): Promise<string[]> {
  return Promise.all(
    images.map(async (image) => {
      if (image.type === 'existing') {
        return image.path;
      }

      const { uploadUrl, filePath } = await requestPostImageUploadUrlFn({
        fileName: image.file.name,
        contentType: image.file.type,
      });
      await uploadPostImageToPresignedPutFn(uploadUrl, image.file, image.file.type);
      return filePath;
    }),
  );
}
