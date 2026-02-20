import { useMutation, type UseMutationOptions, useQueryClient } from '@tanstack/react-query';

import { type PostLikeDataType, togglePostLikeFn } from '@/src/entities/post';
import type { ApiError } from '@/src/shared/api';

import { MOMENTS_LIST_QUERY_KEYS } from '../../moments-list/config/query-keys';

interface LikePostMutationVariables {
  postId: number;
  isLiked: boolean;
}

export type LikePostMutationOptions = Omit<
  UseMutationOptions<PostLikeDataType, ApiError, LikePostMutationVariables>,
  'mutationFn'
>;

export function useLikePostMutation(options?: LikePostMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, isLiked }: LikePostMutationVariables) => {
      const liked = !isLiked;
      return togglePostLikeFn(postId, { liked });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: MOMENTS_LIST_QUERY_KEYS.root(),
      });
    },
    ...options,
  });
}
