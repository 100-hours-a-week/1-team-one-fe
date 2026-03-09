import { Card } from '@repo/ui/card';
import { Chip } from '@repo/ui/chip';

import { STRETCHING_SESSION_COMPLETION_MESSAGES } from '../config/messages';
import {
  StretchingSessionCompletionFeedback,
  type StretchingSessionFeedbackType,
} from './StretchingSessionCompletionFeedback';
import { StretchingSessionCompletionNavigation } from './StretchingSessionCompletionNavigation';

type StretchingSessionCompletionScreenProps = {
  onSubmitFeedback?: (feedback: StretchingSessionFeedbackType) => void;
};

export function StretchingSessionCompletionScreen({
  onSubmitFeedback,
}: StretchingSessionCompletionScreenProps) {
  const title = STRETCHING_SESSION_COMPLETION_MESSAGES.COMPLETED_TITLE;
  const description = STRETCHING_SESSION_COMPLETION_MESSAGES.COMPLETED_DESCRIPTION;

  return (
    <div className="flex h-full w-full flex-col items-stretch gap-6 p-6">
      <Card
        padding="md"
        variant="elevated"
        className="animate-result-fade animate-result-delay-1 flex flex-col gap-6"
      >
        <div className="animate-result-pop bg-brand-50 flex flex-col items-center gap-3 rounded-lg px-4 py-5 text-center">
          <Chip
            label={title}
            size="sm"
            className="bg-brand-100 text-brand-800 border-0 text-xs font-semibold"
          />
          <p className="text-brand-700 text-base font-semibold whitespace-pre-line">
            {description}
          </p>
        </div>

        <StretchingSessionCompletionFeedback canSubmit onSubmit={onSubmitFeedback} />
        <StretchingSessionCompletionNavigation />
      </Card>
    </div>
  );
}
