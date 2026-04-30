import { Chip } from '@repo/ui/chip';
import { UserStatusCard } from '@repo/ui/user-status-card';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

import { useUserByIdQuery } from '@/src/entities/user';
import {
  MOMENTS_LIST_CONFIG,
  momentsListRootQueryOptions,
  usePostsInfiniteQuery,
} from '@/src/features/moments-list';
import {
  ProfileNicknameEditForm,
  ProfilePencilBadge,
  useProfileImageUpload,
  useUserProfileQuery,
} from '@/src/features/user-profile';
import { StreakImoji } from '@/src/shared/assets/StreakImoji';
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

  const isMyProfile = currentUser !== undefined && currentUser.userId === authorId;

  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const imageUpload = useProfileImageUpload();

  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (!imageUpload.file) {
      setPreviewUrl(undefined);
      return;
    }
    const url = URL.createObjectURL(imageUpload.file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageUpload.file]);

  const handleEditDone = () => {
    imageUpload.reset();
    setIsEditing(false);
    void queryClient.invalidateQueries({ queryKey: momentsListRootQueryOptions().queryKey });
  };

  const handleEditCancel = () => {
    imageUpload.reset();
    setIsEditing(false);
  };

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
                avatarSrc={
                  isEditing && previewUrl ? previewUrl : buildImageUrl(user.profile.imagePath)
                }
                avatarAlt={`${user.profile.nickname} 프로필 이미지`}
                nickname={user.profile.nickname}
                level={user.character.level}
                streak={user.character.streak}
                currentExp={user.character.exp}
                totalExp={TOTAL_EXP}
                streakIcon={<StreakImoji className="h-7 w-7" aria-hidden="true" />}
                avatarBadge={
                  isEditing ? (
                    <ProfilePencilBadge
                      onFileSelect={imageUpload.uploadFile}
                      isLoading={imageUpload.isUploading}
                      accept="image/jpeg,image/png,image/gif,image/webp,image/heic,image/heif"
                    />
                  ) : undefined
                }
                rightContent={
                  isEditing ? (
                    <ProfileNicknameEditForm
                      authorId={authorId}
                      initialNickname={user.profile.nickname}
                      imageUpload={imageUpload}
                      onDone={handleEditDone}
                      onCancel={handleEditCancel}
                    />
                  ) : undefined
                }
                rightContentClassName="min-h-24"
              />
              <div className="absolute top-3 right-3 flex items-center gap-2">
                {isMyProfile && !isEditing && (
                  <>
                    <Chip
                      label={MOMENTS_USER_FEED_MESSAGES.MY_FEED_LABEL}
                      variant="default"
                      size="sm"
                    />
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="text-text-muted text-sm underline"
                    >
                      {MOMENTS_USER_FEED_MESSAGES.EDIT_BUTTON}
                    </button>
                  </>
                )}
              </div>
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
          />
        )}
      </LoadableBoundary>
    </div>
  );
}
