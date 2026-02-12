import type { EyeTarget } from '../types';

/**
 * Follow phase에서 이전 타겟 → 현재 타겟 사이의 보간된 위치를 계산한다.
 *
 * - follow phase이고 이전 타겟이 존재하면: holdMs 진행률 기반 선형 보간 (cursor trail)
 * - 그 외 (hold, follow1, end): 현재 타겟 위치 그대로 반환
 *
 * 용도:
 *   1. 캘리브레이션 — 보간된 위치에서 WebGazer 학습 데이터 기록
 *   2. 스코어링 — 보간된 위치와 시선 거리 비교
 *   3. UI — 가이드 dot을 보간된 위치에 표시
 */
export function interpolateFollowTarget(
  keyFrames: ReadonlyArray<EyeTarget>,
  currentIndex: number,
  holdMs: number,
): { x: number; y: number } {
  const current = keyFrames[currentIndex];
  if (!current) return { x: 0.5, y: 0.5 };

  // hold phase 또는 첫 번째 타겟: 보간 없이 현재 위치 반환
  if (!current.phase.startsWith('follow') || currentIndex === 0) {
    return { x: current.x, y: current.y };
  }

  const prev = keyFrames[currentIndex - 1]!;
  const progress = Math.min(1, holdMs / current.holdMs);

  return {
    x: prev.x + (current.x - prev.x) * progress,
    y: prev.y + (current.y - prev.y) * progress,
  };
}
