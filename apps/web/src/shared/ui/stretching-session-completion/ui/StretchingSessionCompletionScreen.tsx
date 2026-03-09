import { STRETCHING_SESSION_COMPLETION_MESSAGES } from '../config/messages';
import {
  StretchingSessionCompletionFeedback,
  type StretchingSessionFeedbackType,
} from './StretchingSessionCompletionFeedback';
import { StretchingSessionCompletionNavigation } from './StretchingSessionCompletionNavigation';

type StretchingSessionCompletionScreenProps = {
  sessionId: string;
  onSubmitFeedback?: (feedback: StretchingSessionFeedbackType) => void;
};

export function StretchingSessionCompletionScreen({
  sessionId,
  onSubmitFeedback,
}: StretchingSessionCompletionScreenProps) {
  const title = STRETCHING_SESSION_COMPLETION_MESSAGES.COMPLETED_TITLE;
  const description = STRETCHING_SESSION_COMPLETION_MESSAGES.COMPLETED_DESCRIPTION;

  return (
    <div className="flex h-full w-full flex-col justify-center gap-8 p-6">
      <div className="flex flex-col items-center justify-center gap-3 pt-8 text-center">
        <h1 className="text-text text-xl font-semibold">{title}</h1>
        <p className="text-text-muted text-sm">{description}</p>
      </div>

      <div className="flex flex-col gap-6">
        <StretchingSessionCompletionFeedback canSubmit onSubmit={onSubmitFeedback} />
        <StretchingSessionCompletionNavigation sessionId={sessionId} />
      </div>
    </div>
  );
}
