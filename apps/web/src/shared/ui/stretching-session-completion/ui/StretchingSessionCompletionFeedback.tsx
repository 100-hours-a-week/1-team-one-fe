import { Button } from '@repo/ui/button';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useEffect, useState } from 'react';

import { STRETCHING_SESSION_COMPLETION_MESSAGES } from '../config/messages';

type StretchingSessionFeedbackType = 'like' | 'dislike';

type StretchingSessionCompletionFeedbackProps = {
  canSubmit: boolean;
  isSubmitting?: boolean;
  isSubmitted?: boolean;
  onSubmit?: (feedback: StretchingSessionFeedbackType) => void;
};

const feedbackOptions = [
  {
    value: 'like',
    label: STRETCHING_SESSION_COMPLETION_MESSAGES.FEEDBACK_LIKE,
    Icon: ThumbsUp,
  },
  {
    value: 'dislike',
    label: STRETCHING_SESSION_COMPLETION_MESSAGES.FEEDBACK_DISLIKE,
    Icon: ThumbsDown,
  },
] as const;

export function StretchingSessionCompletionFeedback({
  canSubmit,
  isSubmitting = false,
  isSubmitted = false,
  onSubmit,
}: StretchingSessionCompletionFeedbackProps) {
  const [selectedFeedback, setSelectedFeedback] = useState<StretchingSessionFeedbackType | null>(
    null,
  );

  useEffect(() => {
    if (canSubmit) return;
    setSelectedFeedback(null);
  }, [canSubmit]);

  const isSubmitDisabled = !canSubmit || !selectedFeedback || isSubmitting || isSubmitted;

  const handleSubmit = () => {
    if (!selectedFeedback) return;
    if (!canSubmit) return;
    if (isSubmitting) return;
    if (isSubmitted) return;

    onSubmit?.(selectedFeedback);
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-text text-center text-base font-semibold">
        {STRETCHING_SESSION_COMPLETION_MESSAGES.FEEDBACK_TITLE}
      </p>
      <p className="text-text-muted text-center text-sm">
        {STRETCHING_SESSION_COMPLETION_MESSAGES.FEEDBACK_DESCRIPTION}
      </p>

      <div className="grid grid-cols-2 gap-3">
        {feedbackOptions.map(({ value, label, Icon }) => {
          const isSelected = selectedFeedback === value;

          return (
            <Button
              key={value}
              type="button"
              variant="ghost"
              size="lg"
              aria-pressed={isSelected}
              disabled={!canSubmit || isSubmitting || isSubmitted}
              onClick={() => setSelectedFeedback(value)}
              className={[
                'h-24 flex-col gap-2 rounded-2xl border-0',
                isSelected
                  ? 'bg-brand-100 text-brand-800 hover:bg-brand-200'
                  : 'bg-bg-subtle text-text hover:bg-bg-muted',
              ].join(' ')}
            >
              <Icon className="h-6 w-6" aria-hidden="true" />
              <span>{label}</span>
            </Button>
          );
        })}
      </div>

      <Button
        type="button"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isSubmitting}
        disabled={isSubmitDisabled}
        onClick={handleSubmit}
      >
        {isSubmitted
          ? STRETCHING_SESSION_COMPLETION_MESSAGES.SUBMIT_DONE_LABEL
          : STRETCHING_SESSION_COMPLETION_MESSAGES.SUBMIT_LABEL}
      </Button>

      <p className="text-text-muted text-center text-xs">
        {STRETCHING_SESSION_COMPLETION_MESSAGES.SUBMIT_HELPER}
      </p>
    </div>
  );
}

export type { StretchingSessionFeedbackType };
