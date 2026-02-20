import { useMutation, type UseMutationOptions, useQueryClient } from '@tanstack/react-query';

import {
  deletePostFn,
  type PostDeleteDataType,
  type PostDeleteRequestDTO,
} from '@/src/entities/post';
import type { ApiError } from '@/src/shared/api';

import { MOMENTS_DETAIL_QUERY_KEYS } from '../config/query-keys';

export type DeletePostMutationOptions = Omit<
  UseMutationOptions<PostDeleteDataType, ApiError, PostDeleteRequestDTO>,
  'mutationFn'
>;

export function useDeletePostMutation(options?: DeletePostMutationOptions) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation({
    mutationFn: deletePostFn,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: MOMENTS_DETAIL_QUERY_KEYS.detail(variables.postId),
      });
      onSuccess?.(data, variables, onMutateResult, context);
    },
    ...restOptions,
  });
}
