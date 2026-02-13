import type { ReferencePose } from '@repo/stretching-accuracy';

export interface ExerciseSessionExercisePoseType {
  referencePose: ReferencePose;
}

export interface ExerciseSessionExerciseType {
  exerciseId: number;
  type: string;
  name: string;
  content: string;
  effect: string;
  pose: ExerciseSessionExercisePoseType;
}

export interface ExerciseSessionStepType {
  routineStepId: number;
  stepOrder: number;
  targetReps: number | null;
  durationTime: number;
  limitTime: number;
  exercise: ExerciseSessionExerciseType;
}

export interface ExerciseSessionType {
  routineId: number;
  routineOrder: number;
  createdAt: string;
  routineSteps: ReadonlyArray<ExerciseSessionStepType>;
}
