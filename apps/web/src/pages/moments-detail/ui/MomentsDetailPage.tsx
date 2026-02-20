import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { useDeletePostMutation } from '@/src/features/moments-detail/api/useDeletePostMutation';
import { usePostDetailQuery } from '@/src/features/moments-detail/api/usePostDetailQuery';
import { PostDetailMenu } from '@/src/features/moments-detail/ui/PostDetailMenu';
import { PostDetailView } from '@/src/features/moments-detail/ui/PostDetailView';
import { isApiError } from '@/src/shared/api';
import { LoadableBoundary } from '@/src/shared/ui/boundary/LoadableBoundary';
import { ErrorScreen } from '@/src/shared/ui/error-screen/ErrorScreen';
import { useSetHeaderAction } from '@/src/widgets/layout/header-action-context';

import { MomentsDetailPageSkeleton } from './MomentsDetailPage.skeleton';

export function MomentsDetailPage() {
  const router = useRouter();

  const postId = Number(router.query.postId);
  const isPostIdValid = !Number.isNaN(postId) && postId > 0;

  const { data, error, isLoading } = usePostDetailQuery(postId, {
    enabled: isPostIdValid,
  });

  const { mutate: deletePost, isPending: isDeleting } = useDeletePostMutation({
    onSuccess: () => {
      //TODO: moments list api 추가 후 invalidate
      router.replace('/moments');
    },
  });

  const handleEdit = useCallback(() => {
    if (!data?.postId) return;
    router.push(`/moments/post/${data.postId}/edit`);
  }, [data?.postId, router]);

  const handleDelete = useCallback(async () => {
    if (!data?.postId) return;
    if (isDeleting) return;

    deletePost({ postId: data.postId });
  }, [data?.postId, deletePost, isDeleting]);

  useSetHeaderAction(() => {
    if (!data?.isAuthor) return null;
    return <PostDetailMenu onEdit={handleEdit} onDelete={handleDelete} isDeleting={isDeleting} />; //내 게시글일 때만 보여주기
  }, [data?.isAuthor, handleEdit, handleDelete, isDeleting]);

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
      data={data}
      renderLoading={() => <MomentsDetailPageSkeleton />}
      renderError={(err) => {
        const variant =
          isApiError(err) && err.code === 'POST_NOT_FOUND' ? 'not-found' : 'unexpected';
        return <ErrorScreen variant={variant} />;
      }}
    >
      {(postData) => <PostDetailView data={postData} />}
    </LoadableBoundary>
  );
}
