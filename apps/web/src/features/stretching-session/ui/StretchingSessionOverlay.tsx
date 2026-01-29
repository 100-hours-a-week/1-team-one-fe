import { formatDuration } from '@/src/shared/lib/format/format-duration';

import { STRETCHING_SESSION_MESSAGES } from '../config/messages';

type StretchingSessionOverlayProps = {
  timeRemainingSeconds: number;
  timerTone: 'danger' | 'default';
  accuracyPercent: number;
  accuracyTone: 'danger' | 'warn' | 'brand';
  repsCount: number;
  targetReps: number;
  showReps: boolean;
  repsPopupValue: number | null;
  holdSeconds: number;
};

export function StretchingSessionOverlay({
  timeRemainingSeconds,
  timerTone,
  accuracyPercent,
  accuracyTone,
  repsCount,
  targetReps,
  showReps,
  repsPopupValue,
  holdSeconds,
}: StretchingSessionOverlayProps) {
  const timerTextClassName = timerTone === 'danger' ? 'text-error-600' : 'text-text';

  const accuracyTextClassName =
    accuracyTone === 'danger'
      ? 'text-error-600'
      : accuracyTone === 'warn'
        ? 'text-warning-600'
        : 'text-brand-600';

  return (
    <div className="pointer-events-none absolute top-4 right-4 left-4 z-10">
      <div className="bg-surface grid grid-cols-3 items-start rounded-lg py-2">
        <div className="flex flex-col items-center gap-1 rounded-xl">
          <span className="text-text-muted text-xs">
            {STRETCHING_SESSION_MESSAGES.OVERLAY.TIME_REMAINING}
          </span>
          <span className={`text-lg font-semibold ${timerTextClassName}`}>
            {formatDuration(timeRemainingSeconds)}
          </span>
        </div>

        <div className="relative flex flex-col items-center gap-1">
          {showReps && (
            <>
              <span className="text-text-muted text-xs">
                {STRETCHING_SESSION_MESSAGES.OVERLAY.REPS_COUNT}
              </span>
              <span className="text-text text-lg font-semibold">
                {repsCount}/{targetReps}
              </span>
            </>
          )}
          {!showReps && holdSeconds > 0 && (
            <>
              <span className="text-text-muted text-xs">
                {STRETCHING_SESSION_MESSAGES.OVERLAY.SUCCESS_COUNT}
              </span>
              <span className="text-text text-lg font-semibold">{holdSeconds}</span>
            </>
          )}
          {repsPopupValue !== null && showReps && (
            <span className="text-brand-600 absolute -top-6 text-base font-semibold">
              {repsPopupValue}
            </span>
          )}
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-text-muted text-xs">
            {STRETCHING_SESSION_MESSAGES.OVERLAY.ACCURACY}
          </span>
          <span className={`text-lg font-semibold ${accuracyTextClassName}`}>
            {Math.round(accuracyPercent)}%
          </span>
        </div>
      </div>
    </div>
  );
}
