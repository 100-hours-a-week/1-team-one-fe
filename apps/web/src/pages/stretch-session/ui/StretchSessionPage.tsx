import { Spinner } from '@repo/ui/spinner';
import { useRouter } from 'next/router';

import { useExerciseSessionQuery } from '@/src/features/exercise-session';
import { EYE_STRETCHING_SESSION_MESSAGES } from '@/src/features/eye-stretching-session/config/messages';
import { EyeStretchingSessionView } from '@/src/features/eye-stretching-session/ui';
import { StretchingSessionView } from '@/src/features/stretching-session';

export function StretchSessionPage() {
  const router = useRouter();
  const sessionId = router.query.sessionId;

  if (typeof sessionId !== 'string') return null;

  return <StretchSessionPageContent sessionId={sessionId} />;
}

function StretchSessionPageContent({ sessionId }: { sessionId: string }) {
  const { data: session, isLoading: isSessionLoading } = useExerciseSessionQuery(sessionId);

  if (isSessionLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Spinner size="sm" />
          <span className="text-text-muted text-sm font-medium">
            {EYE_STRETCHING_SESSION_MESSAGES.LOADING.SESSION.TITLE}
          </span>
        </div>
      </div>
    );
  }

  const firstStep = session?.routineSteps[0];
  const isEyes = firstStep?.exercise.type === 'EYES';

  if (isEyes && firstStep.exercise.pose.eyeReference) {
    return (
      <EyeStretchingSessionView
        sessionId={sessionId}
        reference={firstStep.exercise.pose.eyeReference}
        limitTimeSeconds={firstStep.limitTime}
      />
    );
  }

  return <StretchingSessionView sessionId={sessionId} />;
}
