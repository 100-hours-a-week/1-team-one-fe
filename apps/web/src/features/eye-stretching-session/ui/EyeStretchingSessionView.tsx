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
    isBlinking,
    phase,
    currentTargetIndex,
    score,
    holdSeconds,
    progressRatio,
    timeRemainingSeconds,
    gazeX,
    gazeY,
    guideX,
    guideY,
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
  const phaseRemainingSeconds = Math.max(0, Math.ceil(targetHoldSeconds - holdSeconds));
  const totalFollowCount = reference.keyFrames.filter((kf) => kf.phase.startsWith('follow')).length;

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
            timeRemainingSeconds={timeRemainingSeconds}
            phase={phase}
            phaseRemainingSeconds={phaseRemainingSeconds}
            totalFollowCount={totalFollowCount}
          />

          {currentTarget && (
            <EyeStretchingGuideDot
              phase={phase}
              targetX={guideX}
              targetY={guideY}
              calibrationRemainingSeconds={phase === 'follow1' ? phaseRemainingSeconds : 0}
            />
          )}

          <EyeStretchingGazeDot gazeX={gazeX} gazeY={gazeY} />

          {phase.startsWith('close') && (
            <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 rounded-xl bg-black/60 px-6 py-3 text-center">
              <p className="text-sm font-medium text-white/60">눈 감기</p>
              <p
                className={`mt-0.5 text-2xl font-bold ${isBlinking ? 'text-brand-400' : 'text-white'}`}
              >
                {isBlinking ? '감지됨' : '눈을 감으세요'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
