import type { Landmark2D, ReferenceKeyframe, ReferencePose } from '@repo/stretching-session';

import type { ReferenceKeyframeResponse, ReferencePoseResponse } from '../api/types';

type TargetKeypoint = Readonly<[number, number, number]>;

/**
 * @description API 응답 형태의 ReferencePoseResponse 를 정확도 엔진의 input 형식으로 변환
 */

const toLandmark = (keypoint: TargetKeypoint): Landmark2D => {
  const [x, y, z] = keypoint;
  return { x, y, z };
};

const toReferenceKeyframe = (keyframe: ReferenceKeyframeResponse): ReferenceKeyframe => {
  return {
    phase: keyframe.phase,
    timestampRatio: keyframe.timestampRatio,
    keypoints: keyframe.keypoints.map(toLandmark),
  };
};

export function toReferencePose(referencePose: ReferencePoseResponse): ReferencePose {
  return {
    targetKeypoints: referencePose.targetKeypoints,
    keyframes: referencePose.keyframes.map(toReferenceKeyframe),
    totalDuration: referencePose.totalDuration,
    fpsHint: referencePose.fpsHint,
  };
}
