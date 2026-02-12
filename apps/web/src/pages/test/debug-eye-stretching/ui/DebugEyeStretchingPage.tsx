import type { EyeStretchingReference } from '@repo/eye-stretching-session';
import { useEyeStretchingSession } from '@repo/eye-stretching-session/hook';

import { EyeStretchingGazeDot } from '@/src/features/eye-stretching-session/ui/EyeStretchingGazeDot';
import { EyeStretchingGuideDot } from '@/src/features/eye-stretching-session/ui/EyeStretchingGuideDot';
import { EyeStretchingOverlay } from '@/src/features/eye-stretching-session/ui/EyeStretchingOverlay';

/**
 * eyestetching.json 의 EYES step → EyeStretchingReference 로 직접 변환
 */
const MOCK_REFERENCE: EyeStretchingReference = {
  keyFrames: [
    { phase: 'follow1', x: 0.5, y: 0.5, holdMs: 3000 },
    { phase: 'follow2', x: 0.1, y: 0.1, holdMs: 1500 },
    { phase: 'follow3', x: 0.5, y: 0.1, holdMs: 1500 },
    { phase: 'follow4', x: 0.9, y: 0.1, holdMs: 1500 },
    { phase: 'follow5', x: 0.9, y: 0.5, holdMs: 3000 },
    { phase: 'follow6', x: 0.9, y: 0.9, holdMs: 3000 },
    { phase: 'follow7', x: 0.5, y: 0.9, holdMs: 1500 },
    { phase: 'follow8', x: 0.1, y: 0.9, holdMs: 1500 },
    { phase: 'follow9', x: 0.1, y: 0.5, holdMs: 3000 },
    { phase: 'follow10', x: 0.1, y: 0.1, holdMs: 3000 },
    { phase: 'follow11', x: 0.5, y: 0.5, holdMs: 3000 },
    { phase: 'follow12', x: 0.9, y: 0.9, holdMs: 3000 },
    { phase: 'follow13', x: 0.1, y: 0.9, holdMs: 3000 },
    { phase: 'follow14', x: 0.5, y: 0.5, holdMs: 3000 },
    { phase: 'follow15', x: 0.9, y: 0.1, holdMs: 3000 },
    { phase: 'hold1', x: 1.0, y: 0.5, holdMs: 10000 },
    { phase: 'hold2', x: 0.0, y: 0.5, holdMs: 10000 },
    { phase: 'hold3', x: 0.5, y: 0.0, holdMs: 10000 },
    { phase: 'hold4', x: 0.5, y: 1.0, holdMs: 10000 },
  ],
  totalDurationMs: 67000,
};

const MOCK_LIMIT_TIME_SECONDS = 60;

export function DebugEyeStretchingPage() {
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
    guideX,
    guideY,
    error,
  } = useEyeStretchingSession(MOCK_REFERENCE, {
    limitTimeSeconds: MOCK_LIMIT_TIME_SECONDS,
  });

  const currentTarget = MOCK_REFERENCE.keyFrames[currentTargetIndex];
  const targetHoldSeconds = currentTarget ? currentTarget.holdMs / 1000 : 0;
  const calibrationRemainingSeconds = Math.max(0, Math.ceil(targetHoldSeconds - holdSeconds));

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <span className="text-text-muted text-sm font-medium">
          시선 추적을 준비하고 있습니다...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <span className="text-error-600 text-sm font-medium">
          오류가 발생했습니다: {error.message}
        </span>
      </div>
    );
  }

  if (isSessionComplete) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
        <span className="text-brand-600 text-lg font-semibold">눈운동이 완료되었습니다!</span>
        <span className="text-text-muted text-sm">최종 정확도: {Math.round(score)}%</span>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full">
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

          {currentTarget && (
            <EyeStretchingGuideDot
              phase={phase}
              targetX={guideX}
              targetY={guideY}
              calibrationRemainingSeconds={calibrationRemainingSeconds}
            />
          )}

          <EyeStretchingGazeDot gazeX={gazeX} gazeY={gazeY} />
        </>
      )}
    </div>
  );
}
