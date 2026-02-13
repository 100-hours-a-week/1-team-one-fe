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

export interface ExercisePoseResponse {
  referencePose: ReferencePoseResponse;
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

export type ExerciseSessionResponseDTO = ApiResponse<ExerciseSessionData>;

// valid exercise sessions
export type ValidExerciseSessionItemType = {
  sessionId: number;
  routineId: number;
  createdAt: string;
};

type ValidExerciseSessionsData = {
  sessions: ReadonlyArray<ValidExerciseSessionItemType> | null;
};

export type ValidExerciseSessionsResponseDTO = ApiResponse<ValidExerciseSessionsData>;

// complete exercise session
export type ExerciseResultStatusType = 'COMPLETED' | 'FAILED';

export type ExercisePoseRecordFrameType = {
  frameId: number;
  time: string;
  keypoints: ReadonlyArray<ReadonlyArray<number>>;
};

export type ExerciseResultItemType = {
  routineStepId: number;
  status: ExerciseResultStatusType;
  accuracy: number;
  startAt: string;
  endAt: string;
  pose_record: ReadonlyArray<ExercisePoseRecordFrameType>;
};

export type CompleteExerciseSessionRequestDTO = {
  startAt: string;
  endAt: string;
  exerciseResult: ReadonlyArray<ExerciseResultItemType>;
};

export type CompleteExerciseSessionResponseDataType = {
  sessionId: number;
  isCompleted: boolean;
  earnedExp: number;
  earnedStatusScore: number;
  character: {
    level: number;
    exp: number;
    streak: number;
    statusScore: number;
  };
  quests: ReadonlyArray<{
    id: number;
    name: string;
    targetCount: number;
    currentCount: number;
  }>;
};

export type CompleteExerciseSessionResponseDTO =
  ApiResponse<CompleteExerciseSessionResponseDataType>;
