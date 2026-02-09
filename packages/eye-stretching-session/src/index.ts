// engine
export { createEyeStretchingEngine, EYE_MATCH_THRESHOLD } from './engine/create-eye-engine';

// session
export { createEyeSession } from './session/create-eye-session';
export type {
  CreateEyeSessionOptions,
  EyeSession,
  EyeTracker,
  GazePrediction,
} from './session/create-eye-session';

// utils
export { createGazeSmoother } from './utils';

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
