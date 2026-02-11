import type { EyePhase,EyeStretchingReference, EyeTarget } from '@repo/eye-stretching-session';

import type { EyeKeyframeResponse } from '../api/types';

/**
 * @description API 응답 형태의 EyeKeyframeResponse 를 눈운동 엔진의 input 형식으로 변환
 */

const toEyeTarget = (keyframe: EyeKeyframeResponse): EyeTarget => {
  return {
    phase: keyframe.phase as EyePhase,
    x: keyframe.x,
    y: keyframe.y,
    holdMs: keyframe.holdMs,
  };
};

export function toEyeReference(
  keyFrames: ReadonlyArray<EyeKeyframeResponse>,
  totalDurationMs: number,
): EyeStretchingReference {
  return {
    keyFrames: keyFrames.map(toEyeTarget),
    totalDurationMs,
  };
}
