import { EYE_MATCH_THRESHOLD } from '../src/constants';

export const EYE_SESSION_CONFIG = {
  /** score >= threshold 일 때만 holdMs 누적 */
  SUCCESS_SCORE_THRESHOLD: EYE_MATCH_THRESHOLD,

  /** score < threshold 일 때 holdMs 리셋 여부 */
  RESET_HOLD_ON_FAILURE: true,

  /** step 전환 딜레이 (ms) */
  STEP_TRANSITION_DELAY_MS: 1500,

  /** 타이머 tick 간격 (ms) */
  TIMER_TICK_MS: 250,

  /** 정확도 UI 반영 최소 간격 (ms) — ~8fps */
  ACCURACY_COMMIT_INTERVAL_MS: 120,

  /** 정확도 점수 최댓값 */
  ACCURACY_SCORE_MAX: 100,
} as const;
