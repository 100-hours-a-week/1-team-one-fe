import { useQueryClient } from '@tanstack/react-query';

import type { PostLikeDataType } from '@/src/entities/post';

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
}

export function useLikePostMutationOptions(): LikePostMutationOptions {
  const queryClient = useQueryClient();

  return {
    onMutate: async (variables) => {
      const snapshots = getMomentsListQuerySnapshots(queryClient);
      const updates = getToggleMomentsListQueryUpdates(snapshots, variables.postId);

      const previousQueries = updates.map(({ queryKey, previousData }) => ({
        queryKey,
        data: previousData,
      }));

      await Promise.all(
        previousQueries.map(({ queryKey }) => queryClient.cancelQueries({ queryKey })),
      );

      applyMomentsListQueryUpdates(queryClient, updates);
      return { previousQueries } satisfies LikePostOptimisticContext;
    },

    onError: (_error, _variables, context) => {
      if (!context) return;
      if (typeof context !== 'object') return;
      if (!('previousQueries' in context)) return;

      const previousQueries = (context as LikePostOptimisticContext).previousQueries;
      previousQueries.forEach(({ queryKey, data }) => {
        if (data === undefined) return;
        queryClient.setQueryData(queryKey, data);
      });
    },

    onSuccess: (responseData, variables) => {
      const serverData = responseData as PostLikeDataType;
      const snapshots = getMomentsListQuerySnapshots(queryClient);
      const updates = getSyncMomentsListQueryUpdates(
        snapshots,
        variables.postId,
        serverData.isLiked,
      );
      applyMomentsListQueryUpdates(queryClient, updates);
    },
  };
}
