import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import type { PostLikeDataType, PostMetaDataType } from '@/src/entities/post';
import { postDetailMetaQueryOptions } from '@/src/features/moments-detail';
import {
  MomentsLikeButton,
  syncPostLikeInAllMomentsListQueries,
  useLikePostMutation,
} from '@/src/features/moments-like';
import { createLikeUpdater, createSingleOptimisticHandlers } from '@/src/shared/lib/react-query';

interface MomentsDetailLikeSectionProps {
  postId: number;
  likeCount: number;
  isLiked: boolean;
  isLoggedIn: boolean;
}

export function MomentsDetailLikeSection({
  postId,
  likeCount,
  isLiked,
  isLoggedIn,
}: MomentsDetailLikeSectionProps) {
  const queryClient = useQueryClient();
  const metaQueryKey = postDetailMetaQueryOptions(postId).queryKey;

  const optimisticHandlers = createSingleOptimisticHandlers({
    queryClient,
    queryKey: metaQueryKey,
    updater: createLikeUpdater<PostMetaDataType>(),
    invalidateOnSettled: false,
    onSuccessCallback: (responseData, variables) => {
      const serverData = responseData as PostLikeDataType;
      const queryKey = postDetailMetaQueryOptions(
        (variables as { postId: number }).postId,
      ).queryKey;
      queryClient.setQueryData<PostMetaDataType>(queryKey, (old) => {
        if (!old) return old;
        if (old.isLiked === serverData.isLiked) return old;

        return {
          ...old,
          isLiked: serverData.isLiked,
          likeCount: serverData.isLiked ? old.likeCount + 1 : Math.max(0, old.likeCount - 1),
        };
      });
      syncPostLikeInAllMomentsListQueries(
        queryClient,
        (variables as { postId: number }).postId,
        serverData.isLiked,
      );
    },
  });

  const { mutate: likePost } = useLikePostMutation(optimisticHandlers);

  const handleLike = useCallback(() => {
    likePost({ postId, isLiked });
  }, [likePost, postId, isLiked]);

  return (
    <MomentsLikeButton
      likeCount={likeCount}
      isLiked={isLiked}
      isLoggedIn={isLoggedIn}
      onLike={handleLike}
    />
  );
}

MomentsDetailLikeSection.displayName = 'MomentsDetailLikeSection';
