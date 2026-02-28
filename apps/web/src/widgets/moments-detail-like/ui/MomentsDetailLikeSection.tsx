import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import type { PostDetailDataType, PostLikeDataType } from '@/src/entities/post';
import { MOMENTS_DETAIL_QUERY_KEYS } from '@/src/features/moments-detail/config/query-keys';
import { useLikePostMutation } from '@/src/features/moments-like';
import { createLikeUpdater, createSingleOptimisticHandlers } from '@/src/shared/lib/react-query';
import { MomentsLikeButton } from '@/src/widgets/moments-like-button';

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

  const optimisticHandlers = createSingleOptimisticHandlers({
    queryClient,
    queryKey: MOMENTS_DETAIL_QUERY_KEYS.detail(postId),
    updater: createLikeUpdater<PostDetailDataType>(),
    invalidateOnSettled: false,
    onSuccessCallback: (responseData, variables) => {
      const serverData = responseData as PostLikeDataType;
      const queryKey = MOMENTS_DETAIL_QUERY_KEYS.detail((variables as { postId: number }).postId);
      queryClient.setQueryData<PostDetailDataType>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          isLiked: serverData.isLiked,
          likeCount: serverData.isLiked ? old.likeCount : Math.max(0, old.likeCount),
        };
      });
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
