import { useMutation, type UseMutationOptions, useQueryClient } from '@tanstack/react-query';

import {
  deletePostFn,
  type PostDeleteDataType,
  type PostDeleteRequestDTO,
} from '@/src/entities/post';
import type { ApiError } from '@/src/shared/api';

import { postDetailQueryOptions } from './query-options';

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
        queryKey: postDetailQueryOptions(variables.postId).queryKey,
      });
      onSuccess?.(data, variables, onMutateResult, context);
    },
    ...restOptions,
  });
}
