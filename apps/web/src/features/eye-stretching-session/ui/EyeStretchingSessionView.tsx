import type { EyeStretchingReference } from '@repo/eye-stretching-session';
import { useEyeStretchingSession } from '@repo/eye-stretching-session/hook';
import { Spinner } from '@repo/ui/spinner';
import { useEffect, useRef, useState } from 'react';

import {
  useCompleteExerciseSessionMutation,
  useExerciseSessionQuery,
} from '@/src/entities/stretching-session';
import { EYE_STRETCHING_SESSION_LAYOUT } from '@/src/features/eye-stretching-session/config/constants';
import { EYE_STRETCHING_SESSION_MESSAGES } from '@/src/features/eye-stretching-session/config/messages';
import { WEBGAZER_MODEL_REDIRECTS } from '@/src/features/eye-stretching-session/config/webgazer-models';
import { formatDateTime } from '@/src/shared/lib/date/format-date-time';
import { StretchingSessionCompletionScreen } from '@/src/shared/ui/stretching-session-completion';

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
    isLoading: isSessionPreparing,
    isTrackerReady,
    isSessionComplete,
    isBlinking,
    phase,
    currentTargetIndex,
    score,
    holdSeconds,
    progressRatio,
    timeRemainingSeconds,
    guideX,
    guideY,
    error,
  } = useEyeStretchingSession(reference, {
    limitTimeSeconds,
    webgazerModelRedirects: WEBGAZER_MODEL_REDIRECTS,
  });

  const sessionStartedAtRef = useRef<Date | null>(null);
  const hasSubmittedResultRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [overlaySafeTopRatio, setOverlaySafeTopRatio] = useState(0);

  const { data: sessionData, isLoading: isSessionDataLoading } = useExerciseSessionQuery(sessionId);

  const { mutate: completeSession } = useCompleteExerciseSessionMutation({ sessionId });

  useEffect(() => {
    hasSubmittedResultRef.current = false;
    sessionStartedAtRef.current = null;
  }, [sessionId]);

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
          pose_record: { frames: [] },
        },
      ],
    });
  }, [isSessionComplete, completeSession, sessionData, score]);

  // 현재 target 정보
  const currentTarget = reference.keyFrames[currentTargetIndex];
  const targetHoldSeconds = currentTarget ? currentTarget.holdMs / 1000 : 0;
  const phaseRemainingSeconds = Math.max(0, Math.ceil(targetHoldSeconds - holdSeconds));
  const totalFollowCount = reference.keyFrames.filter((kf) => kf.phase.startsWith('follow')).length;
  const shouldRenderSessionUi = isTrackerReady || isSessionPreparing;

  useEffect(() => {
    const container = containerRef.current;
    const overlay = overlayRef.current;
    if (!container || !overlay) return;
    if (typeof ResizeObserver === 'undefined') return;

    const updateSafeTop = () => {
      const containerRect = container.getBoundingClientRect();
      const overlayRect = overlay.getBoundingClientRect();
      if (containerRect.height <= 0) return;

      const overlayBottomPx = overlayRect.bottom - containerRect.top;
      const safeTopPx = overlayBottomPx + EYE_STRETCHING_SESSION_LAYOUT.OVERLAY_SAFE_MARGIN_PX;
      const nextSafeTopRatio = Math.max(0, Math.min(1, safeTopPx / containerRect.height));

      setOverlaySafeTopRatio((prev) =>
        Math.abs(prev - nextSafeTopRatio) < 0.001 ? prev : nextSafeTopRatio,
      );
    };

    updateSafeTop();

    const observer = new ResizeObserver(updateSafeTop);
    observer.observe(container);
    observer.observe(overlay);
    window.addEventListener('resize', updateSafeTop);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSafeTop);
    };
  }, [isSessionPreparing, isTrackerReady]);

  // 로딩 상태
  if (isSessionDataLoading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3">
        <span className="text-text-muted text-sm font-medium">
          {EYE_STRETCHING_SESSION_MESSAGES.LOADING.SESSION.TITLE}
        </span>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="text-error-600 text-sm font-medium">
          {EYE_STRETCHING_SESSION_MESSAGES.ERROR.GENERIC} {error.message}
        </span>
      </div>
    );
  }

  // 세션 완료
  if (isSessionComplete) {
    return <StretchingSessionCompletionScreen sessionId={sessionId} />;
  }

  return (
    <div ref={containerRef} className="relative flex h-full w-full flex-1">
      {isSessionPreparing && (
        <div
          className="bg-overlay bg-opacity-30 absolute inset-0 z-20 flex items-center justify-center"
          role="status"
          aria-live="polite"
        >
          <div className="bg-surface text-text flex flex-col items-center gap-2 rounded-xl px-5 py-4 text-sm shadow-sm">
            <Spinner size="sm" />
            <span className="font-semibold">
              {EYE_STRETCHING_SESSION_MESSAGES.LOADING.PREPARING.TITLE}
            </span>
            <span className="text-text-muted">
              {EYE_STRETCHING_SESSION_MESSAGES.LOADING.PREPARING.DESCRIPTION}
            </span>
          </div>
        </div>
      )}

      {shouldRenderSessionUi && (
        <>
          <EyeStretchingOverlay
            progressRatio={progressRatio}
            score={score}
            timeRemainingSeconds={timeRemainingSeconds}
            phase={phase}
            phaseRemainingSeconds={phaseRemainingSeconds}
            totalFollowCount={totalFollowCount}
            containerRef={overlayRef}
          />

          {currentTarget && (
            <EyeStretchingGuideDot
              phase={phase}
              targetX={guideX}
              targetY={guideY}
              safeTopRatio={overlaySafeTopRatio}
            />
          )}

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
