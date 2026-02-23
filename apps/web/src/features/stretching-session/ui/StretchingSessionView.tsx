import { ProgressBar } from '@repo/ui/progress-bar';
import { toast } from '@repo/ui/toast';
import { useEffect, useRef } from 'react';

import { STRETCHING_SESSION_CONFIG } from '../config/constants';
import { STRETCHING_SESSION_MESSAGES } from '../config/messages';
import { StretchingSessionDebugOptions, useStretchingSession } from '../lib/useStretchingSession';
import { StretchingSessionCompletionResult } from './StretchingSessionCompletionResult';
import { StretchingSessionGuideCard } from './StretchingSessionGuideCard';
import { StretchingSessionHomeButton } from './StretchingSessionHomeButton';
import { StretchingSessionOverlay } from './StretchingSessionOverlay';
import { StretchingSessionResultMessage } from './StretchingSessionResultMessage';

type StretchingSessionViewProps = {
  sessionId: string;
  debugOptions?: StretchingSessionDebugOptions;
  targetFps?: number;
};

export function StretchingSessionView({
  sessionId,
  debugOptions,
  targetFps,
}: StretchingSessionViewProps) {
  const {
    videoRef,
    canvasRef,
    totalSteps,
    currentStepIndex,
    currentStep,
    timeRemainingSeconds,
    accuracyPercent,
    accuracyTone,
    timerTone,
    repsCount,
    repsPopupValue,
    holdSeconds,
    stepOutcome,
    isCanvasReady,
    isSessionComplete,
    completionResult,
    isCompleting,
  } = useStretchingSession(sessionId, { debug: debugOptions, targetFps });
  const hasShownGuideToastRef = useRef(false);

  const accuracyColorBorderClassName =
    accuracyTone === 'danger'
      ? 'border-error-600'
      : accuracyTone === 'warn'
        ? 'border-warning-600'
        : 'border-brand-600';

  const progressCurrent = totalSteps === 0 ? 0 : Math.min(totalSteps, currentStepIndex + 1);
  const isReps = currentStep?.exercise.type === 'REPS';
  const targetReps = currentStep?.targetReps ?? 0;
  const shouldShowReps = isReps && targetReps > 0;
  const shouldShowAccuracy = !isReps;
  const resultMessage = stepOutcome
    ? stepOutcome === 'success'
      ? STRETCHING_SESSION_MESSAGES.STATUS.RESULT_SUCCESS
      : STRETCHING_SESSION_MESSAGES.STATUS.RESULT_FAIL
    : null;

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    console.log('stepOutcome', stepOutcome);
    console.log('currentStepIndex', currentStepIndex);
  }, [currentStepIndex, stepOutcome]);

  useEffect(() => {
    if (!isCanvasReady) return;
    if (!currentStep) return;
    if (hasShownGuideToastRef.current) return;

    toast({
      title: STRETCHING_SESSION_MESSAGES.TOAST.GUIDE_TITLE,
      description: STRETCHING_SESSION_MESSAGES.TOAST.GUIDE_DESCRIPTION,
      variant: 'info',
      duration: STRETCHING_SESSION_CONFIG.GUIDE_TOAST_DURATION_MS,
    });

    hasShownGuideToastRef.current = true;
  }, [currentStep, isCanvasReady]);

  if (isSessionComplete) {
    return <StretchingSessionCompletionResult result={completionResult} isLoading={isCompleting} />;
  }

  return (
    <div className="relative h-full w-full p-6">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-center gap-1">
          <ProgressBar total={totalSteps} current={progressCurrent} className="w-full" showValue />
          <StretchingSessionHomeButton variant="icon" />
        </div>

        {currentStep && (
          <div className="pt-3">
            <StretchingSessionGuideCard
              name={currentStep.exercise.name}
              content={currentStep.exercise.content}
              effect={currentStep.exercise.effect}
            />
          </div>
        )}

        <div className="relative mt-4 h-full flex-1">
          {isCanvasReady && (
            <StretchingSessionOverlay
              timeRemainingSeconds={timeRemainingSeconds}
              timerTone={timerTone}
              accuracyPercent={accuracyPercent}
              accuracyTone={accuracyTone}
              showAccuracy={shouldShowAccuracy}
              repsCount={repsCount}
              targetReps={targetReps}
              showReps={shouldShowReps}
              repsPopupValue={repsPopupValue}
              holdSeconds={holdSeconds}
            />
          )}

          <video ref={videoRef} className="absolute inset-0 w-full opacity-0" playsInline muted />
          <canvas
            ref={canvasRef}
            className={`absolute inset-0 h-full w-full rounded-2xl ${accuracyColorBorderClassName}`}
          />
          {!isCanvasReady && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-text-muted text-sm font-medium">
                {STRETCHING_SESSION_MESSAGES.STATUS.LOADING}
              </span>
            </div>
          )}
          <StretchingSessionResultMessage message={resultMessage} />
        </div>
      </div>
    </div>
  );
}
