import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import {
  createPostFn,
  type PostCreateDataType,
  requestPostImageUploadUrlFn,
  uploadPostImageToPresignedPutFn,
} from '@/src/entities/post';
import type { ApiError } from '@/src/shared/api';

import { MOMENTS_CREATE_QUERY_KEYS } from '../config/query-keys';
import type { MomentsCreateFormValues } from '../model/moments-create-schema';

async function uploadImages(images: File[]): Promise<string[]> {
  return Promise.all(
    images.map(async (file) => {
      const { uploadUrl, filePath } = await requestPostImageUploadUrlFn({
        fileName: file.name,
        contentType: file.type,
      });
      await uploadPostImageToPresignedPutFn(uploadUrl, file, file.type);
      return filePath;
    }),
  );
}

async function createPostWithImages(values: MomentsCreateFormValues): Promise<PostCreateDataType> {
  const imagePaths = values.images.length > 0 ? await uploadImages(values.images) : [];

  return createPostFn({
    title: values.title,
    content: values.content,
    tags: values.tags,
    images: imagePaths,
  });
}

export type CreatePostMutationOptions = Omit<
  UseMutationOptions<PostCreateDataType, ApiError, MomentsCreateFormValues>,
  'mutationFn'
>;

export function useCreatePostMutation(options?: CreatePostMutationOptions) {
  return useMutation({
    mutationKey: MOMENTS_CREATE_QUERY_KEYS.create(),
    mutationFn: createPostWithImages,
    ...options,
    meta: { ...options?.meta, disableToast: true },
  });
}
