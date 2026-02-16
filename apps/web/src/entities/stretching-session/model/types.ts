import type { ReferencePose } from '@repo/stretching-accuracy';

export interface StretchingSessionExercisePoseType {
  referencePose: ReferencePose;
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
