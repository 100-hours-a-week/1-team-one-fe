// engine
export { createEyeStretchingEngine } from './engine/create-eye-engine';
export { EYE_MATCH_THRESHOLD } from './constants';

// session
export { createEyeSession } from './session/create-eye-session';
export type {
  CreateEyeSessionOptions,
  EyeSession,
  EyeTracker,
  GazePrediction,
} from './session/create-eye-session';

// trackers
export { createWebGazerTracker } from './trackers/webgazer-tracker';
export type { WebGazerInstance, WebGazerTrackerOptions } from './trackers/webgazer-tracker';

// utils
export { createGazeSmoother, interpolateFollowTarget } from './utils';

// types
export type {
  EyeGazePoint,
  GazeFrame,
  EyeTarget,
  EyeStretchingReference,
  EyePhase,
  EyeEvaluateInput,
  EyeSessionResult,
  EyeStretchingEngine,
} from './types';
