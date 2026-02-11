/** 시선이 목표에 도달했다고 판단하는 최소 점수 (0~100) */
export const EYE_MATCH_THRESHOLD = 60;

/** 거리 → 점수 변환 허용치 (정규화 좌표 기준) */
export const GAZE_TOLERANCE = 0.1;

/** 점수 EMA alpha (낮을수록 더 안정적) */
export const SCORE_SMOOTHING_FACTOR = 0.4;

/** 시선 좌표 EMA alpha (낮을수록 더 안정적) */
export const GAZE_SMOOTHING_FACTOR = 0.4;
