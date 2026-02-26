import { Chip } from '@repo/ui/chip';
import { UserStatusCard } from '@repo/ui/user-status-card';
import { useMemo } from 'react';

import { useUserByIdQuery } from '@/src/entities/user';
import {
  MOMENTS_LIST_CONFIG,
  MOMENTS_LIST_QUERY_KEYS,
  usePostsInfiniteQuery,
} from '@/src/features/moments-list';
import { useUserProfileQuery } from '@/src/features/user-profile';
import StreakImoji from '@/src/shared/assets/streak-imoji.svg';
import { buildImageUrl } from '@/src/shared/lib/image';
import { LoadableBoundary } from '@/src/shared/ui/boundary';
import { MomentsList } from '@/src/widgets/moments-list';

import { MOMENTS_USER_FEED_MESSAGES } from '../config/messages';

const TOTAL_EXP = 1000 as const;

interface MomentsUserFeedPageProps {
  authorId: number;
}

export function MomentsUserFeedPage({ authorId }: MomentsUserFeedPageProps) {
  const {
    data: targetUser,
    isLoading: isUserLoading,
    error: userError,
  } = useUserByIdQuery(authorId);
  const { data: currentUser } = useUserProfileQuery({ retry: false });

  const listParams = useMemo(
    () => ({
      limit: MOMENTS_LIST_CONFIG.PAGE_LIMIT,
      authorId,
    }),
    [authorId],
  );

  const {
    data,
    isLoading: isPostsLoading,
    error: postsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePostsInfiniteQuery(listParams);

  const posts = useMemo(() => data?.pages?.flatMap((page) => page.posts) ?? [], [data]);
  const isEmpty = !isPostsLoading && posts.length === 0;
  const listQueryKey = MOMENTS_LIST_QUERY_KEYS.list(listParams);

  const isMyProfile = currentUser !== undefined && currentUser.userId === authorId;

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 pb-6">
      <div className="bg-bg sticky top-0 pb-2" style={{ zIndex: 'var(--z-sticky)' }}>
        <LoadableBoundary
          isLoading={isUserLoading}
          error={userError}
          data={targetUser}
          renderLoading={() => null}
          renderError={() => null}
        >
          {(user) => (
            <div className="relative">
              <UserStatusCard
                avatarSrc={buildImageUrl(user.profile.imagePath)}
                avatarAlt={`${user.profile.nickname} 프로필 이미지`}
                nickname={user.profile.nickname}
                level={user.character.level}
                streak={user.character.streak}
                currentExp={user.character.exp}
                totalExp={TOTAL_EXP}
                streakIcon={<StreakImoji className="h-7 w-7" aria-hidden="true" />}
              />
              {isMyProfile && (
                <div className="absolute top-3 right-3">
                  <Chip
                    label={MOMENTS_USER_FEED_MESSAGES.MY_FEED_LABEL}
                    variant="default"
                    size="sm"
                  />
                </div>
              )}
            </div>
          )}
        </LoadableBoundary>
      </div>

      <LoadableBoundary
        isLoading={isPostsLoading}
        error={postsError}
        data={posts}
        isEmpty={isEmpty}
        renderLoading={() => null}
        renderError={() => null}
        renderEmpty={() => (
          <div className="text-text-muted flex justify-center py-10 text-sm">
            {MOMENTS_USER_FEED_MESSAGES.EMPTY}
          </div>
        )}
      >
        {(items) => (
          <MomentsList
            items={items}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={Boolean(hasNextPage)}
            onFetchNext={() => void fetchNextPage()}
            isLoggedIn={currentUser !== undefined}
            listQueryKey={listQueryKey}
          />
        )}
      </LoadableBoundary>
    </div>
  );
}
