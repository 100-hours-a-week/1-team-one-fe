import { Button } from '@repo/ui/button';
import { useCallback, useState } from 'react';

import { MOMENTS_CREATE_MESSAGES, MomentsCreateForm } from '@/src/features/moments-create';
import { useSetHeaderAction } from '@/src/widgets/layout/header-action-context';

const FORM_ID = 'moments-create-form';

export function MomentsNewPage() {
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

  return <MomentsCreateForm id={FORM_ID} onFormStateChange={handleFormStateChange} />;
}
