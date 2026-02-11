import type { ApiResponse } from '@/src/shared/api';

type TargetKeypoint = Readonly<[number, number, number]>;

export interface ReferenceKeyframeResponse {
  phase: string;
  timestampRatio: number;
  keypoints: ReadonlyArray<TargetKeypoint>;
}

export interface ReferencePoseResponse {
  targetKeypoints: ReadonlyArray<number>;
  keyframes: ReadonlyArray<ReferenceKeyframeResponse>;
  totalDuration: number;
  fpsHint?: number;
}

export interface EyeKeyframeResponse {
  phase: string;
  x: number;
  y: number;
  holdMs: number;
}

export interface ExercisePoseResponse {
  /** 스트레칭 (DURATION / REPS) 용 */
  referencePose?: ReferencePoseResponse;
  /** 눈운동 (EYES) 용 */
  keyFrames?: ReadonlyArray<EyeKeyframeResponse>;
  totalDurationMs?: number;
}

export interface ExerciseResponse {
  exerciseId: number;
  type: string;
  name: string;
  content: string;
  effect: string;
  pose: ExercisePoseResponse;
}

export interface RoutineStepResponse {
  routineStepId: number;
  stepOrder: number;
  targetReps: number | null;
  durationTime: number;
  limitTime: number;
  exercise: ExerciseResponse;
}

export interface ExerciseSessionData {
  routineId: number;
  routineOrder: number;
  createdAt: string;
  routineSteps: ReadonlyArray<RoutineStepResponse>;
}

export type ExerciseSessionResponse = ApiResponse<ExerciseSessionData>;
