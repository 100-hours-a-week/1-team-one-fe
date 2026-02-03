import type { Landmark2D, PoseFrame } from '@repo/stretching-accuracy';

// MediaPipe Pose (33 landmarks) 0-based index
// 0: nose (no swap)
// 1~6: eyes/ears swap (L/R)
// 7~32: body joints swap (L/R)
const MIRROR_PAIRS = [
  // face
  [1, 4], // left_eye_inner  <-> right_eye_inner
  [2, 5], // left_eye        <-> right_eye
  [3, 6], // left_eye_outer  <-> right_eye_outer
  [7, 8], // left_ear        <-> right_ear
  [9, 10], // left_mouth     <-> right_mouth

  // upper body
  [11, 12], // left_shoulder <-> right_shoulder
  [13, 14], // left_elbow    <-> right_elbow
  [15, 16], // left_wrist    <-> right_wrist
  [17, 18], // left_pinky    <-> right_pinky
  [19, 20], // left_index    <-> right_index
  [21, 22], // left_thumb    <-> right_thumb

  // lower body
  [23, 24], // left_hip      <-> right_hip
  [25, 26], // left_knee     <-> right_knee
  [27, 28], // left_ankle    <-> right_ankle
  [29, 30], // left_heel     <-> right_heel
  [31, 32], // left_foot_idx <-> right_foot_idx
] as const;

const MIRROR_LANDMARK_INDEX_MAP: Readonly<Record<number, number>> = (() => {
  const map: Record<number, number> = {};
  for (const [a, b] of MIRROR_PAIRS) {
    map[a] = b;
    map[b] = a;
  }
  return map;
})();

const mirrorLandmark = (landmark: Landmark2D): Landmark2D => ({
  ...landmark,
  x: Number.isFinite(landmark.x) ? 1 - landmark.x : landmark.x,
});

export const mirrorPoseLandmarks = (
  landmarks: ReadonlyArray<Landmark2D>,
): ReadonlyArray<Landmark2D> => {
  if (landmarks.length === 0) return landmarks;

  return landmarks.map((_, index) => {
    const sourceIndex = MIRROR_LANDMARK_INDEX_MAP[index] ?? index;
    const source = landmarks[sourceIndex] ?? landmarks[index]!;
    return mirrorLandmark(source);
  });
};

export const mirrorPoseFrame = (frame: PoseFrame): PoseFrame => ({
  ...frame,
  landmarks: mirrorPoseLandmarks(frame.landmarks),
});
