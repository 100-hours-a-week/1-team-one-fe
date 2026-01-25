export const STRETCHING_SESSION_CONFIG = {
  MODEL_ASSET_PATH: '/models/pose_landmarker_lite.task',
  WASM_ROOT: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
  SILHOUETTE_FOREGROUND_RGBA: { r: 107, g: 114, b: 128, a: 255 },
  SILHOUETTE_BACKGROUND_RGBA: { r: 255, g: 255, b: 255, a: 255 },
  SILHOUETTE_VISIBILITY_MIN: 0.2,
  SILHOUETTE_SMOOTHING_ALPHA: 0.25,
  SILHOUETTE_HEAD_RADIUS_RATIO: 0.3,
  SILHOUETTE_STROKE_WIDTH_RATIO: 0.5,
  DEFAULT_PROGRESS_RATIO: 0.1,
  DEFAULT_PHASE: 'unknown',
} as const;
