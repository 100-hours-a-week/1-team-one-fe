import type { ReferencePose } from '@repo/stretching-session';

export interface ExerciseSessionExercisePose {
  referencePose: ReferencePose;
}

export interface ExerciseSessionExercise {
  exerciseId: number;
  type: string;
  name: string;
  content: string;
  effect: string;
  pose: ExerciseSessionExercisePose;
}

export interface ExerciseSessionStep {
  routineStepId: number;
  stepOrder: number;
  targetReps: number | null;
  durationTime: number;
  limitTime: number;
  exercise: ExerciseSessionExercise;
}

export interface ExerciseSession {
  routineId: number;
  routineOrder: number;
  createdAt: string;
  routineSteps: ReadonlyArray<ExerciseSessionStep>;
}
