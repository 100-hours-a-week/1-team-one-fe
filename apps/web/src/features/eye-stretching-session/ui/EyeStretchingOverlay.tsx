import { EYE_MATCH_THRESHOLD, type EyePhase } from '@repo/eye-stretching-session';
import { ProgressBar } from '@repo/ui/progress-bar';

import { formatDuration } from '@/src/shared/lib/format/format-duration';

type EyeStretchingOverlayProps = {
  /** 전체 진행률 (0~1) */
  progressRatio: number;
  /** 정확도 점수 (0~100) */
  score: number;
  /** 현재 target 유지 시간 (초) */
  holdSeconds: number;
  /** 남은 제한 시간 (초) */
  timeRemainingSeconds: number;
  /** 현재 phase */
  phase: EyePhase;
  /** 캘리브레이션 카운트다운 남은 초 */
  calibrationRemainingSeconds: number;
};

function getPhaseLabel(phase: EyePhase): string {
  if (phase.startsWith('follow')) return `캘리브레이션 ${phase.replace('follow', '')}/3`;
  if (phase.startsWith('hold')) return '시선 유지';
  return '완료';
}

/** EYE_MATCH_THRESHOLD 기반 tone 판정 (stretching-session 패턴 동일) */
function getScoreTone(score: number): 'danger' | 'warn' | 'brand' {
  if (score < EYE_MATCH_THRESHOLD / 2) return 'danger';
  if (score < EYE_MATCH_THRESHOLD) return 'warn';
  return 'brand';
}

export function EyeStretchingOverlay({
  progressRatio,
  score,
  holdSeconds,
  timeRemainingSeconds,
  phase,
  calibrationRemainingSeconds,
}: EyeStretchingOverlayProps) {
  const isFollowPhase = phase.startsWith('follow');
  const scoreTone = getScoreTone(score);

  const scoreTextClassName =
    scoreTone === 'danger'
      ? 'text-error-600'
      : scoreTone === 'warn'
        ? 'text-warning-600'
        : 'text-brand-600';

  return (
    <div className="pointer-events-none absolute inset-x-4 top-4 z-10 space-y-3">
      {/* 진행률 바 */}
      <ProgressBar variant="bar" size="sm" total={100} current={Math.round(progressRatio * 100)} />

      {/* HUD 메트릭스 */}
      <div className="bg-surface grid grid-cols-3 items-start rounded-lg py-2">
        {/* 남은 시간 */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-text-muted text-xs">남은 시간</span>
          <span className="text-text text-lg font-semibold">
            {formatDuration(timeRemainingSeconds)}
          </span>
        </div>

        {/* 중앙: 캘리브레이션 카운트다운 또는 유지 시간 */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-text-muted text-xs">{getPhaseLabel(phase)}</span>
          {isFollowPhase ? (
            <span className="text-brand-600 text-lg font-semibold">
              {calibrationRemainingSeconds}초
            </span>
          ) : (
            <span className="text-text text-lg font-semibold">{holdSeconds}초</span>
          )}
        </div>

        {/* 정확도 */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-text-muted text-xs">정확도</span>
          <span className={`text-lg font-semibold ${scoreTextClassName}`}>
            {Math.round(score)}%
          </span>
        </div>
      </div>
    </div>
  );
}
