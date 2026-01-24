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
//서버에서 받아오는 keyframe 데이터
export type ReferenceKeyframe = {
  phase: string;
  timestampRatio: number;
  keypoints: ReadonlyArray<Landmark2D>;
};

export type ReferencePose = {
  targetKeypoints: ReadonlyArray<number>;
  keyframes: ReadonlyArray<ReferenceKeyframe>;
  totalDuration: number;
  fpsHint?: number;
};

export type AccuracyEvaluateInput = {
  frame: PoseFrame;
  referencePose: ReferencePose;
  progressRatio: number;
};

export type AccuracyResult = {
  score: number;
  meta?: Readonly<Record<string, unknown>>;
};

export type AccuracyEngine = {
  evaluate: (input: AccuracyEvaluateInput) => AccuracyResult;
};
