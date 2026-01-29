export type Landmark2D = {
  x: number;
  y: number;
  z: number;
  visibility?: number;
};

export type PoseFrame = {
  timestampMs: number;
  landmarks: ReadonlyArray<Landmark2D>;
};
export type ExerciseType = 'DURATION' | 'REPS';

export type CountedStatus = 'INCREMENTED' | 'NOT_INCREMENTED' | 'NOT_APPLICABLE';

//서버에서 받아오는 keyframe 데이터
export type ReferenceKeyframe = {
  phase: string;
  timestampRatio: number;
  keypoints: ReadonlyArray<Landmark2D>;
};

export type ReferencePose = {
  targetKeypoints: ReadonlyArray<number>;
  keyframes: ReadonlyArray<ReferenceKeyframe>;
  totalDuration: number; // REPS면 1회 start -> end, DURATION이면 holding 시간 (초)
  fpsHint?: number;
};

export type AccuracyEvaluateInput = {
  frame: PoseFrame;
  referencePose: ReferencePose;

  type: ExerciseType;

  /**
   * 이전 프레임의 progressRatio (0~1)
   * - 첫 호출: 0
   * - 이후: 이전 AccuracyResult.progressRatio
   */
  progressRatio: number;
  /**
   * 이전 프레임의 phase
   * - 첫 호출: 'undefined'
   * - REPS: 'start' | 'quarter' | 'peak' | 'threeQuarter' | 'down'
   * - DURATION: 'start' | 'hold' | 'end'
   */
  prevPhase: string;
};

export type AccuracyResult = {
  score: number;
  counted: CountedStatus;

  /**
   * 계산된 새 progressRatio (0~1)
   * 다음 프레임 호출 시 input.progressRatio로 전달
   */
  progressRatio: number;
  /**
   * 이번프레임의 phase
   * - REPS: 'start' | 'quarter' | 'peak' | 'threeQuarter' | 'down'
   * - DURATION: 'start' | 'hold' | 'end'
   */
  phase: string;

  meta?: Readonly<Record<string, unknown>>;
};

export type AccuracyEngine = {
  evaluate: (input: AccuracyEvaluateInput) => AccuracyResult;
};
