/** 시선이 목표에 도달했다고 판단하는 최소 점수 (0~100) */
export const EYE_MATCH_THRESHOLD = 60;

/**
 * 거리 → 점수 변환 허용치 (정규화 좌표 기준)
 *
 * WebGazer ridge regression의 실측 노이즈가 ±0.2~0.3 (정규화) 수준이므로
 * 0.1은 비현실적으로 엄격하다. 0.25에서 distance 0.12 이하가 threshold 60 통과.
 */
export const GAZE_TOLERANCE = 0.25;

/**
 * 점수 EMA alpha (낮을수록 더 안정적)
 * 0.3: 기본값 (빠른 반응, 급락 가능)
 * 0.15: 점수 급락 억제, 안정적 holdMs 누적
 */
export const SCORE_SMOOTHING_FACTOR = 0.15;

/**
 * 시선 좌표 EMA alpha (낮을수록 더 안정적)
 *
 * WebGazer raw 예측이 프레임 간 ±30% 요동하므로
 * 0.4(민감)→0.15(안정) 로 낮춰 노이즈를 억제한다.
 * α=0.15 시뮬레이션: raw x 207~488 → smoothed 0.75~0.86 (안정적)
 * α=0.08: 더 강한 스무딩, 시선 좌표 급변동 억제
 */
export const GAZE_SMOOTHING_FACTOR = 0.08;

/**
 * 스코어링용 타겟 좌표 클램프 범위
 *
 * 타겟이 뷰포트 극단(0.0/1.0)에 있으면 WebGazer가 정확히 예측할 수 없다.
 * 스코어링 시에만 이 범위로 클램프하여 달성 가능한 목표로 변환한다.
 * (시각적 가이드 dot과 캘리브레이션은 원본 좌표를 그대로 사용)
 */
export const SCORING_TARGET_MIN = 0.15;
export const SCORING_TARGET_MAX = 0.85;

/**
 * 아래 보기 phase 시선 y 보정값 (정규화 좌표 기준)
 *
 * 아래를 볼 때 눈꺼풀이 처지면서 눈 모양이 달라져 WebGazer가 y를 과소예측함.
 * (예: 화면 하단 y=1.0을 보는데 예측값은 y≈0.20)
 *
 * target.y > 0.5 인 phase에서 smoothedGaze.y에 이 값을 더한 뒤 클램프 없이
 * 거리 계산에 사용한다. 실제로 아래를 보지 않으면 보정 후 y가 1.0을 초과하여
 * 목표(0.85)와의 거리가 커지므로 false positive를 방지한다.
 */
export const DOWN_GAZE_Y_CORRECTION = 0.6;

/**
 * 아래 보기 phase 시선 스무딩 alpha
 *
 * 기본 GAZE_SMOOTHING_FACTOR(0.08)는 노이즈 억제에 집중하지만
 * 눈꺼풀 처짐이 있는 아래 보기에서는 유효 신호 자체가 약하므로
 * 더 반응성 있는 스무딩으로 현재 프레임 신호를 빠르게 반영한다.
 */
export const DOWN_GAZE_SMOOTHING_FACTOR = 0.2;
