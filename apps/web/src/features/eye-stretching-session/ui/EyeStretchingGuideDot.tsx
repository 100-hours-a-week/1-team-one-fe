import type { EyePhase } from '@repo/eye-stretching-session';

import { EYE_STRETCHING_SESSION_LAYOUT } from '@/src/features/eye-stretching-session/config/constants';

type EyeStretchingGuideDotProps = {
  /** 현재 phase */
  phase: EyePhase;
  /** 목표 x 좌표 (0~1 정규화) */
  targetX: number;
  /** 목표 y 좌표 (0~1 정규화) */
  targetY: number;
  /** 상단 안전 영역 비율 (0~1) */
  safeTopRatio?: number;
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

function LargeDirectionArrow({ direction }: { direction: EdgeDirection }) {
  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 24 24"
      fill="none"
      className="text-brand-500 animate-pulse drop-shadow-lg"
      style={{ transform: `rotate(${ARROW_ROTATION[direction]}deg)` }}
    >
      <path
        d="M5 12h14M12 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2"
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
  safeTopRatio = 0,
}: EyeStretchingGuideDotProps) {
  const isFollow = phase.startsWith('follow');
  const isHold = phase.startsWith('hold');
  if (!isFollow && !isHold) return null;

  const edge = getEdgeDirection(targetX, targetY);

  // hold phase: 화면 중앙에 커다란 화살표만 표시
  if (isHold && edge) {
    return (
      <div
        className="pointer-events-none absolute flex flex-col items-center gap-4"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <LargeDirectionArrow direction={edge} />
        <p className="rounded-lg bg-black/60 px-4 py-2 text-center text-sm font-medium text-white">
          화살표 방향으로 시선을 최대한 이동해주세요!
        </p>
      </div>
    );
  }

  // follow phase: 기존 dot + edge arrow 표시
  const isVerticalEdge = edge === 'up' || edge === 'down';

  // 화면 가장자리 타겟은 살짝 안쪽으로 클램프하여 dot이 보이도록
  const maxX = 1 - EYE_STRETCHING_SESSION_LAYOUT.GUIDE_DOT_EDGE_PADDING_X;
  const maxY = 1 - EYE_STRETCHING_SESSION_LAYOUT.GUIDE_DOT_EDGE_PADDING_Y;
  const minY = Math.max(EYE_STRETCHING_SESSION_LAYOUT.GUIDE_DOT_EDGE_PADDING_Y, safeTopRatio);
  const boundedMinY = Math.min(minY, maxY);

  const displayX = Math.max(
    EYE_STRETCHING_SESSION_LAYOUT.GUIDE_DOT_EDGE_PADDING_X,
    Math.min(maxX, targetX),
  );
  const displayY = Math.max(boundedMinY, Math.min(maxY, targetY));

  return (
    <div
      className={`pointer-events-none absolute flex items-center gap-1 ${
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
        <div className="relative">
          <span className="bg-brand-400 absolute inset-0 h-5 w-5 animate-ping rounded-full opacity-40" />
          <span className="bg-brand-500 relative block h-5 w-5 rounded-full" />
        </div>
      </div>

      {(edge === 'right' || edge === 'down') && <EdgeArrow direction={edge} />}
    </div>
  );
}
