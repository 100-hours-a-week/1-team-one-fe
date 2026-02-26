import type { ApiResponse } from '@/src/shared/api';

type TargetKeypointType = Readonly<[number, number, number]>;

export interface ReferenceKeyframeResponseType {
  phase: string;
  timestampRatio: number;
  keypoints: ReadonlyArray<TargetKeypointType>;
}

export interface ReferencePoseResponseType {
  targetKeypoints: ReadonlyArray<number>;
  keyframes: ReadonlyArray<ReferenceKeyframeResponseType>;
  totalDuration: number;
  fpsHint?: number;
}

export interface EyeKeyframeResponseType {
  phase: string;
  x: number;
  y: number;
  holdMs: number;
}

interface StretchingPoseResponseType {
  referencePose?: ReferencePoseResponseType;
  keyFrames?: ReadonlyArray<EyeKeyframeResponseType>;
  totalDurationMs?: number;
}

interface StretchingExerciseResponseType {
  exerciseId: number;
  type: string;
  name: string;
  content: string;
  effect: string;
  pose: StretchingPoseResponseType;
}

export interface RoutineStepResponseType {
  routineStepId: number;
  stepOrder: number;
  targetReps: number | null;
  durationTime: number;
  limitTime: number;
  exercise: StretchingExerciseResponseType;
}

export interface StretchingSessionDataType {
  routineId: number;
  routineOrder: number;
  createdAt: string;
  routineSteps: ReadonlyArray<RoutineStepResponseType>;
}

export type StretchingSessionResponseDTO = ApiResponse<StretchingSessionDataType>;

// valid stretching sessions
export type ValidStretchingSessionItemType = {
  sessionId: number;
  routineId: number;
  createdAt: string;
};

type ValidStretchingSessionsDataType = {
  sessions: ReadonlyArray<ValidStretchingSessionItemType> | null;
};

export type ValidStretchingSessionsResponseDTO = ApiResponse<ValidStretchingSessionsDataType>;

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
