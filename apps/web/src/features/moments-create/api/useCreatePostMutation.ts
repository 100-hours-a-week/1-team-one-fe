import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import { createPostFn, type PostCreateDataType, resolvePostImagePaths } from '@/src/entities/post';
import type { ApiError } from '@/src/shared/api';
import type { MomentsPostFormValues } from '@/src/shared/types';

import { MOMENTS_CREATE_QUERY_KEYS } from '../config/query-keys';

async function createPostWithImages(values: MomentsPostFormValues): Promise<PostCreateDataType> {
  const imagePaths = values.images.length > 0 ? await resolvePostImagePaths(values.images) : [];

  return createPostFn({
    title: values.title,
    content: values.content,
    tags: values.tags,
    images: imagePaths,
  });
}

export type CreatePostMutationOptions = Omit<
  UseMutationOptions<PostCreateDataType, ApiError, MomentsPostFormValues>,
  'mutationFn'
>;

export function useCreatePostMutation(options?: CreatePostMutationOptions) {
  return useMutation({
    mutationKey: MOMENTS_CREATE_QUERY_KEYS.create(),
    mutationFn: createPostWithImages,
    ...options,
  });
}
