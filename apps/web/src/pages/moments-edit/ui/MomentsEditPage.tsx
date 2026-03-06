import { Button } from '@repo/ui/button';
import { Spinner } from '@repo/ui/spinner';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

import type { PostDetailDataType } from '@/src/entities/post';
import { postDetailQueryOptions, usePostDetailQuery } from '@/src/features/moments-detail';
import { MOMENTS_EDIT_MESSAGES, useUpdatePostMutation } from '@/src/features/moments-edit';
import { MOMENTS_LIST_QUERY_KEYS } from '@/src/features/moments-list';
import { isApiError } from '@/src/shared/api';
import type { MomentsPostFormValues } from '@/src/shared/types';
import { LoadableBoundary } from '@/src/shared/ui/boundary/LoadableBoundary';
import { ErrorScreen } from '@/src/shared/ui/error-screen/ErrorScreen';
import { useSetHeaderAction } from '@/src/widgets/layout/header-action-context';
import { MomentsPostForm } from '@/src/widgets/moments-post-form';

const FORM_ID = 'moments-edit-form';

function buildEditDefaultValues(data: PostDetailDataType): MomentsPostFormValues {
  return {
    title: data.title,
    content: data.content,
    tags: data.tags.map((tag) => tag.name),
    images: data.images.map((path, index) => ({
      id: `existing-${index}-${path}`,
      type: 'existing',
      path,
    })),
  };
}

export function MomentsEditPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync: updatePost } = useUpdatePostMutation();

  const postIdParam = router.query.postId;
  const postId = typeof postIdParam === 'string' ? Number(postIdParam) : Number.NaN;
  const isPostIdValid = !Number.isNaN(postId) && postId > 0;

  const { data, error, isLoading } = usePostDetailQuery(postId, {
    enabled: isPostIdValid,
  });

  const canEdit = data?.isAuthor ?? false;

  useSetHeaderAction(() => {
    if (!canEdit) return null;
    return (
      <Button
        type="submit"
        form={FORM_ID}
        disabled={!isValid || isSubmitting}
        isLoading={isSubmitting}
      >
        {MOMENTS_EDIT_MESSAGES.BUTTON.SUBMIT}
      </Button>
    );
  }, [canEdit, isValid, isSubmitting]);

  const handleFormStateChange = useCallback(
    ({
      isValid: nextIsValid,
      isSubmitting: nextIsSubmitting,
    }: {
      isValid: boolean;
      isSubmitting: boolean;
    }) => {
      setIsValid(nextIsValid);
      setIsSubmitting(nextIsSubmitting);
    },
    [],
  );

  const handleSuccess = useCallback(async () => {
    if (!isPostIdValid) return;

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: postDetailQueryOptions(postId).queryKey }),
      queryClient.invalidateQueries({ queryKey: MOMENTS_LIST_QUERY_KEYS.root() }),
    ]);
    router.replace(`/moments/post/${postId}`);
  }, [isPostIdValid, postId, queryClient, router]);

  if (!isPostIdValid) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-text-subtle">{MOMENTS_EDIT_MESSAGES.ERROR.INVALID_POST_ID}</p>
      </div>
    );
  }

  return (
    <LoadableBoundary
      isLoading={isLoading}
      error={error}
      data={data}
      renderLoading={() => (
        <div className="flex min-h-screen items-center justify-center">
          <Spinner size="md" />
        </div>
      )}
      renderError={(err) => {
        const variant =
          isApiError(err) && err.code === 'POST_NOT_FOUND' ? 'not-found' : 'unexpected';
        return <ErrorScreen variant={variant} />;
      }}
    >
      {(postData) => {
        if (!postData.isAuthor) {
          return (
            <div className="flex min-h-screen items-center justify-center">
              <p className="text-text-subtle">{MOMENTS_EDIT_MESSAGES.ERROR.ACCESS_DENIED}</p>
            </div>
          );
        }

        const defaultValues = buildEditDefaultValues(postData);
        const handleSubmit = async (values: MomentsPostFormValues) => {
          await updatePost({ postId: postData.postId, ...values });
          await handleSuccess();
        };

        return (
          <MomentsPostForm
            id={FORM_ID}
            defaultValues={defaultValues}
            onFormStateChange={handleFormStateChange}
            onSubmit={handleSubmit}
          />
        );
      }}
    </LoadableBoundary>
  );
}
