export const STRETCHING_SESSION_CONFIG = {
  // TODO모델/wasm 경로 확정 후 반영
  MODEL_ASSET_PATH: '/models/pose_landmarker_lite.task',
  // TODO: CDN 버전 고정 필요
  WASM_ROOT: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
  DEFAULT_PROGRESS_RATIO: 0,
  DEFAULT_PHASE: 'unknown',
} as const;
