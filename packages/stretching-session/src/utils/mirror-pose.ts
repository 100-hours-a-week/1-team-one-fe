import type { Landmark2D, PoseFrame } from '@repo/stretching-accuracy';

const MIRROR_LANDMARK_INDEX_MAP: Readonly<Record<number, number>> = {
  1: 4,
  2: 5,
  3: 6,
  4: 1,
  5: 2,
  6: 3,
  7: 8,
  8: 7,
  9: 10,
  10: 9,
  11: 12,
  12: 11,
  13: 14,
  14: 13,
  15: 16,
  16: 15,
  17: 18,
  18: 17,
  19: 20,
  20: 19,
  21: 22,
  22: 21,
  23: 24,
  24: 23,
  25: 26,
  26: 25,
  27: 28,
  28: 27,
  29: 30,
  30: 29,
  31: 32,
  32: 31,
};

const mirrorLandmark = (landmark: Landmark2D): Landmark2D => ({
  ...landmark,
  x: Number.isFinite(landmark.x) ? 1 - landmark.x : landmark.x,
});

export const mirrorPoseLandmarks = (
  landmarks: ReadonlyArray<Landmark2D>,
): ReadonlyArray<Landmark2D> => {
  if (landmarks.length === 0) return landmarks;

  return landmarks.map((landmark, index) => {
    const sourceIndex = MIRROR_LANDMARK_INDEX_MAP[index] ?? index;
    const source = landmarks[sourceIndex] ?? landmark;
    return mirrorLandmark(source);
  });
};

export const mirrorPoseFrame = (frame: PoseFrame): PoseFrame => ({
  ...frame,
  landmarks: mirrorPoseLandmarks(frame.landmarks),
});
