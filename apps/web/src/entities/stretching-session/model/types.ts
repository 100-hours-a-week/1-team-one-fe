import type { EyeStretchingReference } from '@repo/eye-stretching-session';
import type { ReferencePose } from '@repo/stretching-accuracy';

export interface StretchingSessionExercisePoseType {
  referencePose?: ReferencePose;
  eyeReference?: EyeStretchingReference;
}

export interface StretchingSessionExerciseType {
  exerciseId: number;
  type: string;
  name: string;
  content: string;
  effect: string;
  pose: StretchingSessionExercisePoseType;
}

export interface StretchingSessionStepType {
  routineStepId: number;
  stepOrder: number;
  targetReps: number | null;
  durationTime: number;
  limitTime: number;
  exercise: StretchingSessionExerciseType;
}

export interface StretchingSessionType {
  routineId: number;
  routineOrder: number;
  createdAt: string;
  routineSteps: ReadonlyArray<StretchingSessionStepType>;
}
