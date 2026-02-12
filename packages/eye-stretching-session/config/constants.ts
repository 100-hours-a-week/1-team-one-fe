import { EYE_MATCH_THRESHOLD } from '../src/constants';

export const EYE_SESSION_CONFIG = {
  /** score >= threshold 일 때만 holdMs 누적 */
  SUCCESS_SCORE_THRESHOLD: EYE_MATCH_THRESHOLD,

  /**
   * score < threshold 일 때 holdMs 리셋 여부
   *
   * WebGazer 노이즈가 심해서 매 프레임 score가 급변한다.
   * true이면 나쁜 프레임 1개가 수십 초 누적 holdMs를 즉시 0으로 리셋하여
   * hold 단계 완료가 사실상 불가능하다.
   * false이면 좋은 프레임에서만 holdMs가 누적되고 나쁜 프레임은 무시된다.
   */
  RESET_HOLD_ON_FAILURE: false,

  /** step 전환 딜레이 (ms) */
  STEP_TRANSITION_DELAY_MS: 1500,

  /** 타이머 tick 간격 (ms) */
  TIMER_TICK_MS: 250,

  /** 정확도 UI 반영 최소 간격 (ms) — ~8fps */
  ACCURACY_COMMIT_INTERVAL_MS: 120,

  /** 정확도 점수 최댓값 */
  ACCURACY_SCORE_MAX: 100,
} as const;
