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

export type AccuracyResult = {
  score: number;
  meta?: Readonly<Record<string, unknown>>;
};

export type AccuracyEngine = {
  evaluate: (frame: PoseFrame) => AccuracyResult;
};
