import type { QueryKey } from '@tanstack/react-query';

import type { PostListItemType } from '@/src/entities/post';
import { MOMENTS_LIST_CONFIG, MOMENTS_LIST_MESSAGES } from '@/src/features/moments-list';
import { InfiniteScrollTrigger } from '@/src/shared/ui/infinite-scroll-trigger';
import { MomentsPostCardItem } from '@/src/widgets/moments-post-card';

type MomentsListProps = {
  items: PostListItemType[];
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onFetchNext: () => void;
  isLoggedIn: boolean;
  listQueryKey: QueryKey;
};

export function MomentsList({
  items,
  isFetchingNextPage,
  hasNextPage,
  onFetchNext,
  isLoggedIn,
  listQueryKey,
}: MomentsListProps) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((post) => (
        <MomentsPostCardItem
          key={post.postId}
          post={post}
          isLoggedIn={isLoggedIn}
          listQueryKey={listQueryKey}
        />
      ))}
      {isFetchingNextPage && (
        <div className="text-text-muted flex justify-center text-sm">
          {MOMENTS_LIST_MESSAGES.LIST.FETCHING_MORE}
        </div>
      )}
      <InfiniteScrollTrigger
        isActive={hasNextPage && !isFetchingNextPage}
        onIntersect={onFetchNext}
        rootMargin={MOMENTS_LIST_CONFIG.INFINITE_SCROLL_ROOT_MARGIN}
      />
    </div>
  );
}
