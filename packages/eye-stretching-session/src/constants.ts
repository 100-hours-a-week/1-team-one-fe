/** 시선이 목표에 도달했다고 판단하는 최소 점수 (0~100) */
export const EYE_MATCH_THRESHOLD = 60;

/**
 * 거리 → 점수 변환 허용치 (정규화 좌표 기준)
 *
 * WebGazer ridge regression의 실측 노이즈가 ±0.2~0.3 (정규화) 수준이므로
 * 0.1은 비현실적으로 엄격하다. 0.25에서 distance 0.12 이하가 threshold 60 통과.
 */
export const GAZE_TOLERANCE = 0.25;

/** 점수 EMA alpha (낮을수록 더 안정적) */
export const SCORE_SMOOTHING_FACTOR = 0.3;

/**
 * 시선 좌표 EMA alpha (낮을수록 더 안정적)
 *
 * WebGazer raw 예측이 프레임 간 ±30% 요동하므로
 * 0.4(민감)→0.15(안정) 로 낮춰 노이즈를 억제한다.
 * α=0.15 시뮬레이션: raw x 207~488 → smoothed 0.75~0.86 (안정적)
 */
export const GAZE_SMOOTHING_FACTOR = 0.15;

/**
 * 스코어링용 타겟 좌표 클램프 범위
 *
 * 타겟이 뷰포트 극단(0.0/1.0)에 있으면 WebGazer가 정확히 예측할 수 없다.
 * 스코어링 시에만 이 범위로 클램프하여 달성 가능한 목표로 변환한다.
 * (시각적 가이드 dot과 캘리브레이션은 원본 좌표를 그대로 사용)
 */
export const SCORING_TARGET_MIN = 0.15;
export const SCORING_TARGET_MAX = 0.85;
