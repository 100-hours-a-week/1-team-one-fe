import type { CountedStatus, ExerciseType, ReferencePose } from '@repo/stretching-accuracy';

export const DEBUG_STRETCH_ACCURACY_CONFIG = {
  DEFAULT_FPS: 4,
  FPS_MIN: 1,
  FPS_MAX: 30,
  DEFAULT_REFERENCE_POSE: {
    targetKeypoints: [0, 11, 12],
    keyframes: [
      {
        phase: 'start',
        timestampRatio: 0,
        keypoints: [
          { x: 0.5, y: 0.25, z: 0 },
          { x: 0.45, y: 0.4, z: 0 },
          { x: 0.55, y: 0.4, z: 0 },
        ],
      },
      {
        phase: 'end',
        timestampRatio: 1,
        keypoints: [
          { x: 0.5, y: 0.22, z: 0 },
          { x: 0.43, y: 0.38, z: 0 },
          { x: 0.57, y: 0.38, z: 0 },
        ],
      },
    ],
    totalDuration: 2,
    fpsHint: 30,
  } satisfies ReferencePose,
  DEFAULT_REFERENCE_POSE_JSON_INDENT: 2,
} as const;

export const DEFAULT_REFERENCE_POSE_JSON = JSON.stringify(
  DEBUG_STRETCH_ACCURACY_CONFIG.DEFAULT_REFERENCE_POSE,
  null,
  DEBUG_STRETCH_ACCURACY_CONFIG.DEFAULT_REFERENCE_POSE_JSON_INDENT,
);

export const EXERCISE_TYPE_OPTIONS: ReadonlyArray<{
  value: ExerciseType;
  label: string;
}> = [
  { value: 'DURATION', label: 'DURATION' },
  { value: 'REPS', label: 'REPS' },
];

export const COUNTED_STATUS_LABELS: Record<CountedStatus, string> = {
  INCREMENTED: 'INCREMENTED',
  NOT_INCREMENTED: 'NOT_INCREMENTED',
  NOT_APPLICABLE: 'NOT_APPLICABLE',
};
