import type { EyeGazePoint } from '../types';

/**
 * 시선 좌표 노이즈 필터링 (Exponential Moving Average)
 *
 * eye-tracker 원시 데이터의 떨림을 완화하여 안정적인 좌표를 반환
 *
 * @param alpha - EMA 가중치 (0~1, 낮을수록 더 안정적, 기본값: 0.4)
 */
export function createGazeSmoother(alpha: number = 0.4) {
  const clampedAlpha = Math.min(1, Math.max(0, alpha));
  let prev: EyeGazePoint | null = null;

  const smooth = (point: EyeGazePoint): EyeGazePoint => {
    if (prev === null) {
      prev = { ...point };
      return prev;
    }

    const smoothed: EyeGazePoint = {
      x: clampedAlpha * point.x + (1 - clampedAlpha) * prev.x,
      y: clampedAlpha * point.y + (1 - clampedAlpha) * prev.y,
    };
    prev = smoothed;
    return smoothed;
  };

  const reset = () => {
    prev = null;
  };

  return { smooth, reset };
}
