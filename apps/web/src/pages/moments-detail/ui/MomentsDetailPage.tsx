import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';

import type { PostDetailDataType } from '@/src/entities/post';
import { useDeletePostMutation } from '@/src/features/moments-detail/api/useDeletePostMutation';
import { usePostDetailMetaQuery } from '@/src/features/moments-detail/api/usePostDetailMetaQuery';
import { usePostDetailQuery } from '@/src/features/moments-detail/api/usePostDetailQuery';
import { PostDetailMenu } from '@/src/features/moments-detail/ui/PostDetailMenu';
import {
  momentsListMetaPageRootQueryOptions,
  momentsListRootQueryOptions,
} from '@/src/features/moments-list';
import { useOnboardingStatusQuery } from '@/src/features/onboarding-status';
import { isApiError } from '@/src/shared/api';
import { LoadableBoundary } from '@/src/shared/ui/boundary/LoadableBoundary';
import { ErrorScreen } from '@/src/shared/ui/error-screen/ErrorScreen';
import { useSetHeaderAction } from '@/src/widgets/layout/header-action-context';
import { MomentsDetailLikeSection } from '@/src/widgets/moments-detail-like';
import { PostDetailView } from '@/src/widgets/moments-post-detail';

import { MomentsDetailPageSkeleton } from './MomentsDetailPage.skeleton';

interface MomentsDetailPageProps {
  initialData?: PostDetailDataType;
}

export function MomentsDetailPage({ initialData }: MomentsDetailPageProps) {
  const router = useRouter();
  const { data: onboardingStatus } = useOnboardingStatusQuery();
  const isLoggedIn = onboardingStatus !== 'unauthorized';

  const postId = Number(router.query.postId);
  const isPostIdValid = !Number.isNaN(postId) && postId > 0;

  const { data, error, isLoading } = usePostDetailQuery(postId, {
    enabled: isPostIdValid,
    initialData,
  });

  const { data: metaData } = usePostDetailMetaQuery(postId, {
    enabled: isLoggedIn && isPostIdValid,
  });

  const mergedData = useMemo(
    () => (data && metaData ? { ...data, ...metaData } : data),
    [data, metaData],
  );

  const queryClient = useQueryClient();

  const { mutate: deletePost, isPending: isDeleting } = useDeletePostMutation({
    onSuccess: () => {
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: momentsListRootQueryOptions().queryKey }),
        queryClient.invalidateQueries({
          queryKey: momentsListMetaPageRootQueryOptions().queryKey,
        }),
      ]);
      router.replace('/moments');
    },
  });

  const handleEdit = useCallback(() => {
    if (!mergedData?.postId) return;
    router.push(`/moments/post/${mergedData.postId}/edit`);
  }, [mergedData?.postId, router]);

  const handleDelete = useCallback(async () => {
    if (!mergedData?.postId) return;
    if (isDeleting) return;

    deletePost({ postId: mergedData.postId });
  }, [mergedData?.postId, deletePost, isDeleting]);

  useSetHeaderAction(() => {
    if (!mergedData?.isAuthor) return null;
    return <PostDetailMenu onEdit={handleEdit} onDelete={handleDelete} isDeleting={isDeleting} />; //내 게시글일 때만 보여주기
  }, [mergedData?.isAuthor, handleEdit, handleDelete, isDeleting]);

  //TODO: error page 따로 생성
  if (Number.isNaN(postId) || postId <= 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-text-subtle">잘못된 게시글 ID입니다.</p>
      </div>
    );
  }

  return (
    <LoadableBoundary
      isLoading={isLoading}
      error={error}
      data={mergedData}
      renderLoading={() => <MomentsDetailPageSkeleton />}
      renderError={(err) => {
        const variant =
          isApiError(err) &&
          (err.code === 'POST_NOT_FOUND' || err.code === 'RESOURCE_NOT_FOUND' || err.status === 404)
            ? 'not-found'
            : 'unexpected';
        return <ErrorScreen variant={variant} />;
      }}
    >
      {(postData) => (
        <PostDetailView
          data={postData}
          footer={
            <MomentsDetailLikeSection
              postId={postData.postId}
              likeCount={postData.likeCount}
              isLiked={postData.isLiked}
              isLoggedIn={isLoggedIn}
            />
          }
        />
      )}
    </LoadableBoundary>
  );
}
