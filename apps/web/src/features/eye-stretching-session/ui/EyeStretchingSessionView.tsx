import type { EyeStretchingReference } from '@repo/eye-stretching-session';
import { useEyeStretchingSession } from '@repo/eye-stretching-session/hook';
import { useEffect, useRef, useState } from 'react';

import {
  type CompleteExerciseSessionResponseData,
  useCompleteExerciseSessionMutation,
  useExerciseSessionQuery,
} from '@/src/features/exercise-session';
import { formatDateTime } from '@/src/shared/lib/date/format-date-time';

import { EyeStretchingGazeDot } from './EyeStretchingGazeDot';
import { EyeStretchingGuideDot } from './EyeStretchingGuideDot';
import { EyeStretchingOverlay } from './EyeStretchingOverlay';

type EyeStretchingSessionViewProps = {
  /** 세션 ID */
  sessionId: string;
  /** 눈운동 레퍼런스 데이터 */
  reference: EyeStretchingReference;
  /** 제한 시간 (초) */
  limitTimeSeconds?: number;
};

export function EyeStretchingSessionView({
  sessionId,
  reference,
  limitTimeSeconds,
}: EyeStretchingSessionViewProps) {
  const {
    isLoading,
    isTrackerReady,
    isSessionComplete,
    phase,
    currentTargetIndex,
    score,
    holdSeconds,
    progressRatio,
    timeRemainingSeconds,
    gazeX,
    gazeY,
    error,
  } = useEyeStretchingSession(reference, { limitTimeSeconds });

  const sessionStartedAtRef = useRef<Date | null>(null);
  const hasSubmittedResultRef = useRef(false);

  const { data: sessionData } = useExerciseSessionQuery(sessionId);

  const [, setCompletionResult] = useState<CompleteExerciseSessionResponseData | null>(null);
  const { mutate: completeSession } = useCompleteExerciseSessionMutation({
    sessionId,
    onSuccess: (payload) => setCompletionResult(payload),
  });

  // 세션 시작 시각 기록
  useEffect(() => {
    if (isTrackerReady && !sessionStartedAtRef.current) {
      sessionStartedAtRef.current = new Date();
    }
  }, [isTrackerReady]);

  // 세션 완료 → API 호출
  useEffect(() => {
    if (!isSessionComplete) return;
    if (hasSubmittedResultRef.current) return;

    const firstStep = sessionData?.routineSteps[0];
    if (!firstStep) return;

    const startedAt = sessionStartedAtRef.current ?? new Date();
    const endedAt = new Date();

    hasSubmittedResultRef.current = true;

    completeSession({
      startAt: formatDateTime(startedAt),
      endAt: formatDateTime(endedAt),
      exerciseResult: [
        {
          routineStepId: firstStep.routineStepId,
          status: 'COMPLETED',
          accuracy: score,
          startAt: formatDateTime(startedAt),
          endAt: formatDateTime(endedAt),
          pose_record: [],
        },
      ],
    });
  }, [isSessionComplete, completeSession, sessionData, score]);

  // 현재 target 정보
  const currentTarget = reference.keyFrames[currentTargetIndex];
  const targetHoldSeconds = currentTarget ? currentTarget.holdMs / 1000 : 0;
  const calibrationRemainingSeconds = Math.max(0, Math.ceil(targetHoldSeconds - holdSeconds));

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="text-text-muted text-sm font-medium">
          시선 추적을 준비하고 있습니다...
        </span>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="text-error-600 text-sm font-medium">
          오류가 발생했습니다: {error.message}
        </span>
      </div>
    );
  }

  // 세션 완료
  if (isSessionComplete) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="text-brand-600 text-lg font-semibold">눈운동이 완료되었습니다!</span>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {isTrackerReady && (
        <>
          <EyeStretchingOverlay
            progressRatio={progressRatio}
            score={score}
            holdSeconds={holdSeconds}
            timeRemainingSeconds={timeRemainingSeconds}
            phase={phase}
            calibrationRemainingSeconds={calibrationRemainingSeconds}
          />

          {currentTarget && phase.startsWith('follow') && (
            <EyeStretchingGuideDot
              phase={phase}
              targetX={currentTarget.x}
              targetY={currentTarget.y}
              calibrationRemainingSeconds={calibrationRemainingSeconds}
            />
          )}

          <EyeStretchingGazeDot gazeX={gazeX} gazeY={gazeY} />
        </>
      )}
    </div>
  );
}
