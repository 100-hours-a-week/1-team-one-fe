export const STRETCHING_SESSION_CONFIG = {
  // 미디어파이프 세팅
  MODEL_ASSET_PATH: '/models/pose_landmarker_lite.task',
  WASM_ROOT: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',

  // 캔버스 어떻게 보여주는지 mode (video | keypoints | video-keypoints | silhouette)
  VISUALIZATION_MODE: 'video-keypoints' as const,

  // 키포인트 렌더러 옵션들 (video-keypoints, keypoints 모드에만 사용)
  KEYPOINTS_LINE_COLOR: '#00FF00',
  KEYPOINTS_LINE_WIDTH: 2,
  KEYPOINTS_POINT_COLOR: '#FF0000',
  KEYPOINTS_POINT_RADIUS: 3,
  KEYPOINTS_BACKGROUND_COLOR: '#000000',
  KEYPOINTS_VISIBILITY_THRESHOLD: 0.5,
  KEYPOINTS_SHOW_POINTS: true,

  // 실루엣 모드일 때 세팅값
  SILHOUETTE_FOREGROUND_RGBA: { r: 107, g: 114, b: 128, a: 255 },
  SILHOUETTE_BACKGROUND_RGBA: { r: 219, g: 219, b: 219, a: 1 },
  SILHOUETTE_VISIBILITY_MIN: 0.2,
  SILHOUETTE_SMOOTHING_ALPHA: 0.25,
  SILHOUETTE_HEAD_RADIUS_RATIO: 0.3,
  SILHOUETTE_STROKE_WIDTH_RATIO: 0.5,

  // 타이밍 관련 변수들
  TIMER_TICK_MS: 250,
  TIMER_WARNING_SECONDS: 5,
  STEP_TRANSITION_DELAY_MS: 1500,
  REPS_POPUP_MS: 900,
  TARGET_FPS: 4,
  MILLISECONDS_PER_SECOND: 1000,

  // 정확도 역치
  ACCURACY_SCORE_MAX: 100,
  ACCURACY_THRESHOLD_LOW: 10,
  ACCURACY_THRESHOLD_MID: 60,
  SUCCESS_ACCURACY_THRESHOLD: 60,
  DEFAULT_PROGRESS_RATIO: 0.1,
  DEFAULT_PHASE: 'unknown',
} as const;
