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

export function EyeStretchingGuideDot({
  phase,
  targetX,
  targetY,
  calibrationRemainingSeconds,
}: EyeStretchingGuideDotProps) {
  if (!phase.startsWith('follow')) return null;

  return (
    <div
      className="pointer-events-none absolute z-20 flex flex-col items-center"
      style={{
        left: `${targetX * 100}%`,
        top: `${targetY * 100}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* 카운트다운 */}
      <span className="text-brand-600 mb-2 text-lg font-semibold">
        {calibrationRemainingSeconds}초
      </span>
      {/* pulse ring + dot */}
      <div className="relative">
        <span className="bg-brand-400 absolute inset-0 h-5 w-5 animate-ping rounded-full opacity-40" />
        <span className="bg-brand-500 relative block h-5 w-5 rounded-full" />
      </div>
    </div>
  );
}
