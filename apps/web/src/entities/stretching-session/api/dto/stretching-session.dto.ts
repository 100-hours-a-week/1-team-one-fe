import type { ApiResponse } from '@/src/shared/api';

type TargetKeypoint = Readonly<[number, number, number]>;

interface ReferenceKeyframeResponse {
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

interface StretchingPoseResponse {
  referencePose: ReferencePoseResponse;
}

interface StretchingExerciseResponse {
  exerciseId: number;
  type: string;
  name: string;
  content: string;
  effect: string;
  pose: StretchingPoseResponse;
}

export interface RoutineStepResponse {
  routineStepId: number;
  stepOrder: number;
  targetReps: number | null;
  durationTime: number;
  limitTime: number;
  exercise: StretchingExerciseResponse;
}

export interface StretchingSessionData {
  routineId: number;
  routineOrder: number;
  createdAt: string;
  routineSteps: ReadonlyArray<RoutineStepResponse>;
}

export type StretchingSessionResponseDTO = ApiResponse<StretchingSessionData>;

// valid stretching sessions
export type ValidStretchingSessionItemType = {
  sessionId: number;
  routineId: number;
  createdAt: string;
};

type ValidStretchingSessionsData = {
  sessions: ReadonlyArray<ValidStretchingSessionItemType> | null;
};

export type ValidStretchingSessionsResponseDTO = ApiResponse<ValidStretchingSessionsData>;

// complete stretching session
export type StretchingResultStatusType = 'COMPLETED' | 'FAILED';

export type StretchingPoseRecordFrameType = {
  frameId: number;
  time: string;
  keypoints: ReadonlyArray<ReadonlyArray<number>>;
};

export type StretchingResultItemType = {
  routineStepId: number;
  status: StretchingResultStatusType;
  accuracy: number;
  startAt: string;
  endAt: string;
  pose_record: ReadonlyArray<StretchingPoseRecordFrameType>;
};

export type CompleteStretchingSessionRequestDTO = {
  startAt: string;
  endAt: string;
  exerciseResult: ReadonlyArray<StretchingResultItemType>;
};

//TODO: dto 만 export 하게 수정을 고려해보기

export type CompleteStretchingSessionResponseDataType = {
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

export type CompleteStretchingSessionResponseDTO =
  ApiResponse<CompleteStretchingSessionResponseDataType>;
