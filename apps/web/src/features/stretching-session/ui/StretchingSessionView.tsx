import { ProgressBar } from '@repo/ui/progress-bar';

import { StretchingSessionDebugOptions, useStretchingSession } from '../lib/use-stretching-session';
import { StretchingSessionGuideCard } from './StretchingSessionGuideCard';
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
    stepOutcome,
    isCanvasReady,
  } = useStretchingSession(sessionId, { debug: debugOptions, targetFps });

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
  const resultMessage = stepOutcome ? (stepOutcome === 'success' ? '성공' : '실패') : null;

  return (
    <div className="relative h-full w-full p-6">
      <div className="flex h-full flex-col">
        <div className="flex justify-center">
          <ProgressBar total={totalSteps} current={progressCurrent} className="w-full" />
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
              repsCount={repsCount}
              targetReps={targetReps}
              showReps={shouldShowReps}
              repsPopupValue={repsPopupValue}
            />
          )}

          <video ref={videoRef} className="absolute inset-0 w-full opacity-0" playsInline muted />
          <canvas
            ref={canvasRef}
            className={`absolute inset-0 h-full w-full rounded-2xl ${accuracyColorBorderClassName}`}
          />
          {!isCanvasReady && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-text-muted text-sm font-medium">{'로딩 중...'}</span>
            </div>
          )}
          <StretchingSessionResultMessage message={resultMessage} />
        </div>
      </div>
    </div>
  );
}
