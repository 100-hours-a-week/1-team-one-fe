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
};

export function MomentsList({
  items,
  isFetchingNextPage,
  hasNextPage,
  onFetchNext,
  isLoggedIn,
}: MomentsListProps) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((post, index) => (
        <MomentsPostCardItem
          key={post.postId}
          post={post}
          isLoggedIn={isLoggedIn}
          isLcpCandidate={index === MOMENTS_LIST_CONFIG.LCP_CANDIDATE_INDEX}
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
