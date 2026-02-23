import type { InfiniteData, QueryKey } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import type {
  PostLikeDataType,
  PostListItemType,
  PostListResponseDataType,
} from '@/src/entities/post';
import {
  createInfiniteItemUpdater,
  createInfiniteOptimisticHandlers,
  createLikeUpdater,
} from '@/src/shared/lib/react-query';

interface LikePostMutationVariables {
  postId: number;
  isLiked: boolean;
}

interface LikePostOptimisticOptionsParams {
  queryKey: QueryKey;
}

export function useLikePostMutationOptions({ queryKey }: LikePostOptimisticOptionsParams) {
  const queryClient = useQueryClient();
  const queryKeys = [queryKey];

  const optimisticItemUpdater = createLikeUpdater<PostListItemType>();
  const applyOptimisticLike = (post: PostListItemType) => optimisticItemUpdater(post) ?? post;
  const optimisticDataUpdater = createInfiniteItemUpdater<
    PostListResponseDataType,
    PostListItemType,
    number
  >(
    (page) => page.posts,
    (post) => post.postId,
    (post) => applyOptimisticLike(post),
  );

  const syncDataUpdater = (isLiked: boolean) =>
    createInfiniteItemUpdater<PostListResponseDataType, PostListItemType, number>(
      (page) => page.posts,
      (post) => post.postId,
      (post) => ({
        ...post,
        isLiked,
        likeCount: isLiked ? post.likeCount : Math.max(0, post.likeCount),
      }),
    );

  return createInfiniteOptimisticHandlers<PostListResponseDataType, LikePostMutationVariables>({
    queryClient,
    queryKeys,
    updater: (data, variables) => optimisticDataUpdater(data, variables.postId),
    onSuccessCallback: (responseData, variables) => {
      const serverData = responseData as PostLikeDataType;
      const updater = syncDataUpdater(serverData.isLiked);

      queryKeys.forEach((currentKey) => {
        queryClient.setQueryData<InfiniteData<PostListResponseDataType>>(currentKey, (old) =>
          updater(old, variables.postId),
        );
      });
    },
  });
}
