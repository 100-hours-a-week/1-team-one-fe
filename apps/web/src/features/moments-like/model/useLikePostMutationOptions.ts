import { useQueryClient } from '@tanstack/react-query';

import {
  postDetailMetaQueryOptions,
  type PostLikeDataType,
  type PostMetaDataType,
} from '@/src/entities/post';

import type { LikePostMutationOptions } from '../api/useLikePostMutation';
import {
  applyMomentsListQueryUpdates,
  getMomentsListQuerySnapshots,
  getSyncMomentsListQueryUpdates,
  getToggleMomentsListQueryUpdates,
} from './optimistic-update-helpers';

interface LikePostOptimisticContext {
  previousQueries: Array<{
    queryKey: ReturnType<typeof getMomentsListQuerySnapshots>[number]['queryKey'];
    data: ReturnType<typeof getMomentsListQuerySnapshots>[number]['data'];
  }>;
  previousDetailMeta: {
    queryKey: ReturnType<typeof postDetailMetaQueryOptions>['queryKey'];
    data: PostMetaDataType | null | undefined;
  };
}

function isLikePostOptimisticContext(context: unknown): context is LikePostOptimisticContext {
  if (!context) return false;
  if (typeof context !== 'object') return false;
  if (!('previousQueries' in context)) return false;
  if (!('previousDetailMeta' in context)) return false;
  return true;
}

function patchDetailMetaLikeState(
  data: PostMetaDataType | null | undefined,
  nextIsLiked: boolean,
): PostMetaDataType | null | undefined {
  if (!data) return data;
  if (data.isLiked === nextIsLiked) return data;

  const nextLikeCount = nextIsLiked ? data.likeCount + 1 : Math.max(0, data.likeCount - 1);

  return {
    ...data,
    isLiked: nextIsLiked,
    likeCount: nextLikeCount,
  };
}

export function useLikePostMutationOptions(): LikePostMutationOptions {
  const queryClient = useQueryClient();

  return {
    onMutate: async (variables) => {
      const snapshots = getMomentsListQuerySnapshots(queryClient);
      const updates = getToggleMomentsListQueryUpdates(snapshots, variables.postId);
      const detailMetaQueryKey = postDetailMetaQueryOptions(variables.postId).queryKey;

      const previousQueries = updates.map(({ queryKey, previousData }) => ({
        queryKey,
        data: previousData,
      }));

      const previousDetailMeta = queryClient.getQueryData<PostMetaDataType | null>(
        detailMetaQueryKey,
      );

      await Promise.all([
        ...previousQueries.map(({ queryKey }) => queryClient.cancelQueries({ queryKey })),
        queryClient.cancelQueries({ queryKey: detailMetaQueryKey }),
      ]);

      applyMomentsListQueryUpdates(queryClient, updates);
      queryClient.setQueryData<PostMetaDataType | null>(detailMetaQueryKey, (old) =>
        patchDetailMetaLikeState(old, !variables.isLiked),
      );

      return {
        previousQueries,
        previousDetailMeta: {
          queryKey: detailMetaQueryKey,
          data: previousDetailMeta,
        },
      } satisfies LikePostOptimisticContext;
    },

    onError: (_error, _variables, context) => {
      if (!isLikePostOptimisticContext(context)) return;

      context.previousQueries.forEach(({ queryKey, data }) => {
        if (data === undefined) return;
        queryClient.setQueryData(queryKey, data);
      });

      if (context.previousDetailMeta.data === undefined) return;
      queryClient.setQueryData(
        context.previousDetailMeta.queryKey,
        context.previousDetailMeta.data,
      );
    },

    onSuccess: (responseData, variables) => {
      const serverData = responseData as PostLikeDataType;
      const targetPostId = serverData.postId ?? variables.postId;
      const snapshots = getMomentsListQuerySnapshots(queryClient);
      const updates = getSyncMomentsListQueryUpdates(snapshots, targetPostId, serverData.isLiked);
      applyMomentsListQueryUpdates(queryClient, updates);

      const detailMetaQueryKey = postDetailMetaQueryOptions(targetPostId).queryKey;
      queryClient.setQueryData<PostMetaDataType | null>(detailMetaQueryKey, (old) =>
        patchDetailMetaLikeState(old, serverData.isLiked),
      );
    },
  };
}
