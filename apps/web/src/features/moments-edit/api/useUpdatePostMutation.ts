import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import { type PostUpdateDataType, resolvePostImagePaths, updatePostFn } from '@/src/entities/post';
import type { ApiError } from '@/src/shared/api';
import type { MomentsPostFormValues } from '@/src/shared/types';

import { MOMENTS_EDIT_QUERY_KEYS } from '../config/query-keys';

type UpdatePostMutationVariables = MomentsPostFormValues & {
  postId: number;
};

async function updatePostWithImages(
  values: UpdatePostMutationVariables,
): Promise<PostUpdateDataType> {
  const { postId, images, ...payload } = values;
  const imagePaths = images.length > 0 ? await resolvePostImagePaths(images) : [];

  return updatePostFn({
    postId,
    ...payload,
    images: imagePaths,
  });
}

export type UpdatePostMutationOptions = Omit<
  UseMutationOptions<PostUpdateDataType, ApiError, UpdatePostMutationVariables>,
  'mutationFn'
>;

export function useUpdatePostMutation(options?: UpdatePostMutationOptions) {
  return useMutation({
    mutationKey: MOMENTS_EDIT_QUERY_KEYS.update(),
    mutationFn: updatePostWithImages,
    ...options,
  });
}
