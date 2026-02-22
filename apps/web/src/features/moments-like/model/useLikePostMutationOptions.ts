import type { InfiniteData } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import type { PostLikeDataType } from '@/src/entities/post';
import type { PostListResponseDataType } from '@/src/entities/post';
import type { ApiError } from '@/src/shared/api';

import { MOMENTS_LIST_QUERY_KEYS } from '../../moments-list/config/query-keys';
import { findPostInInfiniteData, updatePostLikeInInfiniteData } from './optimistic-update-helpers';

interface LikePostMutationVariables {
  postId: number;
  isLiked: boolean;
}

type QueryCacheEntry = {
  queryKey: readonly unknown[];
  data: InfiniteData<PostListResponseDataType> | undefined;
};

type LikePostOptimisticContextType = {
  previousQueries: QueryCacheEntry[];
};

function getLikePostOptimisticContext(value: unknown): LikePostOptimisticContextType | undefined {
  if (typeof value !== 'object' || value === null) {
    return undefined;
  }
  if (!('previousQueries' in value)) {
    return undefined;
  }
  return value as LikePostOptimisticContextType;
}

export function useLikePostMutationOptions() {
  const queryClient = useQueryClient();

  //optimistic update 를 적용하고 스냅샷을 저장
  const handleMutate = useCallback(
    async (variables: LikePostMutationVariables): Promise<LikePostOptimisticContextType> => {
      const { postId, isLiked } = variables;

      await queryClient.cancelQueries({
        queryKey: MOMENTS_LIST_QUERY_KEYS.root(),
      });

      const queryCache = queryClient.getQueriesData<InfiniteData<PostListResponseDataType>>({
        queryKey: MOMENTS_LIST_QUERY_KEYS.root(),
      });

      const previousQueries: QueryCacheEntry[] = queryCache.map(([queryKey, data]) => ({
        queryKey,
        data,
      }));

      queryCache.forEach(([queryKey, data]) => {
        const currentPost = findPostInInfiniteData(data, postId);
        if (!currentPost) return;

        const newIsLiked = !isLiked;
        const newLikeCount = newIsLiked
          ? currentPost.likeCount + 1
          : Math.max(0, currentPost.likeCount - 1);

        const updatedData = updatePostLikeInInfiniteData(data, postId, {
          isLiked: newIsLiked,
          likeCount: newLikeCount,
        });

        queryClient.setQueryData(queryKey, updatedData);
      });

      return { previousQueries };
    },
    [queryClient],
  );

  //실패 시 롤백
  const handleError = useCallback(
    (_error: ApiError, _variables: LikePostMutationVariables, onMutateResult: unknown) => {
      const context = getLikePostOptimisticContext(onMutateResult);
      if (!context?.previousQueries) return;

      context.previousQueries.forEach(({ queryKey, data }) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    [queryClient],
  );

  //서버 응답과 캐시 동기화
  const handleSuccess = useCallback(
    (data: PostLikeDataType, variables: LikePostMutationVariables) => {
      const { postId } = variables;

      const queryCache = queryClient.getQueriesData<InfiniteData<PostListResponseDataType>>({
        queryKey: MOMENTS_LIST_QUERY_KEYS.root(),
      });

      queryCache.forEach(([queryKey, cachedData]) => {
        const currentPost = findPostInInfiniteData(cachedData, postId);
        if (!currentPost) return;

        const updatedData = updatePostLikeInInfiniteData(cachedData, postId, {
          isLiked: data.isLiked,
          likeCount: data.isLiked ? currentPost.likeCount : Math.max(0, currentPost.likeCount),
        });

        queryClient.setQueryData(queryKey, updatedData);
      });
    },
    [queryClient],
  );

  //error, 성공 시에도 invalidate -> 정합성
  const handleSettled = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: MOMENTS_LIST_QUERY_KEYS.root(),
    });
  }, [queryClient]);

  return {
    onMutate: handleMutate,
    onError: handleError,
    onSuccess: handleSuccess,
    onSettled: handleSettled,
  };
}
