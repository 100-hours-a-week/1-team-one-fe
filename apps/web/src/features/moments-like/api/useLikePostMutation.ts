import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import { type PostLikeDataType, togglePostLikeFn } from '@/src/entities/post';
import type { ApiError } from '@/src/shared/api';

import { useLikePostMutationOptions } from '../model/useLikePostMutationOptions';

interface LikePostMutationVariables {
  postId: number;
  isLiked: boolean;
}

export type LikePostMutationOptions = Omit<
  UseMutationOptions<PostLikeDataType, ApiError, LikePostMutationVariables>,
  'mutationFn'
>;

export function useLikePostMutation(options?: LikePostMutationOptions) {
  const optimisticOptions = useLikePostMutationOptions();

  return useMutation({
    mutationFn: async ({ postId, isLiked }: LikePostMutationVariables) => {
      const liked = !isLiked;
      return togglePostLikeFn(postId, { liked });
    },
    ...optimisticOptions,
    ...options,
  });
}
