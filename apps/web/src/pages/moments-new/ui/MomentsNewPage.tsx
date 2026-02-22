import { Button } from '@repo/ui/button';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

import { MOMENTS_CREATE_MESSAGES, useCreatePostMutation } from '@/src/features/moments-create';
import type { MomentsPostFormValues } from '@/src/shared/types';
import { useSetHeaderAction } from '@/src/widgets/layout/header-action-context';
import { MomentsPostForm } from '@/src/widgets/moments-post-form';

const FORM_ID = 'moments-create-form';

export function MomentsNewPage() {
  const router = useRouter();
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync: createPost } = useCreatePostMutation();

  useSetHeaderAction(
    () => (
      <Button
        type="submit"
        form={FORM_ID}
        disabled={!isValid || isSubmitting}
        isLoading={isSubmitting}
      >
        {MOMENTS_CREATE_MESSAGES.BUTTON.SUBMIT}
      </Button>
    ),
    [isValid, isSubmitting],
  );

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

  const handleSubmit = useCallback(
    async (values: MomentsPostFormValues) => {
      const data = await createPost(values);
      router.replace(`/moments/post/${data.postId}`);
    },
    [createPost, router],
  );

  return (
    <MomentsPostForm
      id={FORM_ID}
      defaultValues={{ title: '', content: '', tags: [], images: [] }}
      onFormStateChange={handleFormStateChange}
      onSubmit={handleSubmit}
    />
  );
}
