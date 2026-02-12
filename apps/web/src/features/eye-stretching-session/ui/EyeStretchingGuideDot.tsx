import type { EyePhase } from '@repo/eye-stretching-session';

type EyeStretchingGuideDotProps = {
  /** 현재 phase */
  phase: EyePhase;
  /** 목표 x 좌표 (0~1 정규화) */
  targetX: number;
  /** 목표 y 좌표 (0~1 정규화) */
  targetY: number;
  /** 캘리브레이션 카운트다운 남은 초 */
  calibrationRemainingSeconds: number;
};

type EdgeDirection = 'left' | 'right' | 'up' | 'down';

const ARROW_ROTATION: Record<EdgeDirection, number> = {
  right: 0,
  down: 90,
  left: 180,
  up: 270,
};

function getEdgeDirection(x: number, y: number): EdgeDirection | null {
  if (x <= 0) return 'left';
  if (x >= 1) return 'right';
  if (y <= 0) return 'up';
  if (y >= 1) return 'down';
  return null;
}

function EdgeArrow({ direction }: { direction: EdgeDirection }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      className="text-brand-500 animate-pulse"
      style={{ transform: `rotate(${ARROW_ROTATION[direction]}deg)` }}
    >
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function EyeStretchingGuideDot({
  phase,
  targetX,
  targetY,
  calibrationRemainingSeconds,
}: EyeStretchingGuideDotProps) {
  const isFollow = phase.startsWith('follow');
  const isHold = phase.startsWith('hold');
  if (!isFollow && !isHold) return null;

  const edge = getEdgeDirection(targetX, targetY);
  const isVerticalEdge = edge === 'up' || edge === 'down';

  // 화면 가장자리 타겟은 살짝 안쪽으로 클램프하여 dot이 보이도록
  const displayX = Math.max(0.02, Math.min(0.98, targetX));
  const displayY = Math.max(0.03, Math.min(0.97, targetY));

  return (
    <div
      className={`pointer-events-none absolute z-20 flex items-center gap-1 ${
        isVerticalEdge ? 'flex-col' : 'flex-row'
      }`}
      style={{
        left: `${displayX * 100}%`,
        top: `${displayY * 100}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {(edge === 'left' || edge === 'up') && <EdgeArrow direction={edge} />}

      <div className="flex flex-col items-center">
        {isFollow && (
          <span className="text-brand-600 mb-2 text-lg font-semibold">
            {calibrationRemainingSeconds}초
          </span>
        )}
        <div className="relative">
          <span className="bg-brand-400 absolute inset-0 h-5 w-5 animate-ping rounded-full opacity-40" />
          <span className="bg-brand-500 relative block h-5 w-5 rounded-full" />
        </div>
      </div>

      {(edge === 'right' || edge === 'down') && <EdgeArrow direction={edge} />}
    </div>
  );
}
