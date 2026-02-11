import { useRouter } from 'next/router';

import { useExerciseSessionQuery } from '@/src/features/exercise-session';
import { EyeStretchingSessionView } from '@/src/features/eye-stretching-session/ui';
import { StretchingSessionView } from '@/src/features/stretching-session';

export function StretchSessionPage() {
  const router = useRouter();
  const sessionId = router.query.sessionId;

  if (typeof sessionId !== 'string') return null;

  return <StretchSessionPageContent sessionId={sessionId} />;
}

function StretchSessionPageContent({ sessionId }: { sessionId: string }) {
  const { data: session } = useExerciseSessionQuery(sessionId);

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
