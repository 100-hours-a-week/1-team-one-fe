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
 * 시선 좌표 EMA alpha (높을수록 더 빠르게 반응)
 *
 * α=0.3: 현재 프레임 30% 반영 — 노이즈 억제와 반응성의 균형점
 * α=0.08: 과거 과도한 스무딩 — 시선이 매우 느리게 이동하는 문제 있음
 */
export const GAZE_SMOOTHING_FACTOR = 0.3;

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
 * 선형 점감 방식으로 적용:
 *   보정량 = DOWN_GAZE_Y_CORRECTION × max(0, (0.5 − gaze.y) / 0.5)
 *   gaze.y = 0.0 → 최대 보정 (1.0 배율)
 *   gaze.y = 0.5 → 보정 0 (연속 전환, 순간이동 없음)
 *   gaze.y > 0.5 → 보정 없음 (올바른 반구)
 */
export const DOWN_GAZE_Y_CORRECTION = 0.7;

/**
 * 아래 보기 phase 시선 스무딩 alpha
 *
 * 눈꺼풀 처짐이 있는 아래 보기에서는 유효 신호 자체가 약하므로
 * 기본보다 더 반응성 있는 스무딩으로 현재 프레임 신호를 빠르게 반영한다.
 */
export const DOWN_GAZE_SMOOTHING_FACTOR = 0.4;

/**
 * 위 보기 phase 시선 y 보정값 (정규화 좌표 기준)
 *
 * 위를 볼 때 WebGazer가 y를 과대예측(실제보다 낮은 값)하는 경향이 있음.
 * 선형 점감: gaze.y = 1.0 → 최대 보정, gaze.y = 0.5 → 보정 0 (연속 전환)
 * 아래 보기 보정(0.6)보다 약하게 설정.
 */
export const UP_GAZE_Y_CORRECTION = 0.3;

/**
 * 좌/우 보기 phase 시선 x 보정값 (정규화 좌표 기준)
 *
 * 좌우 극단을 볼 때 WebGazer가 x를 과소예측(중심 쪽으로 당겨지는)하는 경향이 있음.
 * 선형 점감: 반대 극단 → 최대 보정, 중심(0.5) → 보정 0 (연속 전환)
 * 아래 보기 보정(0.6)보다 약하게 설정.
 */
export const SIDE_GAZE_X_CORRECTION = 0.3;
