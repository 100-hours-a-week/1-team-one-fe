import { Button } from '@repo/ui/button';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

import { PostCreateDataType } from '@/src/entities/post';
import { MOMENTS_CREATE_MESSAGES, MomentsCreateForm } from '@/src/features/moments-create';
import { useSetHeaderAction } from '@/src/widgets/layout/header-action-context';

const FORM_ID = 'moments-create-form';

export function MomentsNewPage() {
  const router = useRouter();
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleOnSuccess = useCallback(
    (data: PostCreateDataType) => {
      router.replace(`/moments/post/${data.postId}`);
    },
    [router],
  );

  return (
    <MomentsCreateForm
      id={FORM_ID}
      onFormStateChange={handleFormStateChange}
      onSuccess={handleOnSuccess}
    />
  );
}
