// ═══════════════════════════════════════════════════════════════════════════
// 시선 데이터
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 시선 좌표 (정규화: 0~1)
 *
 * WebGazer는 raw pixel 좌표를 반환하므로,
 * 소비자(session/hook)에서 viewport 크기로 나누어 정규화한 뒤 전달해야 한다.
 *   gazeX = prediction.x / window.innerWidth
 *   gazeY = prediction.y / window.innerHeight
 */
export type EyeGazePoint = {
  x: number;
  y: number;
};

/** 시선 프레임 (1 tick = 1 프레임) */
export type GazeFrame = {
  timestampMs: number;
  gaze: EyeGazePoint;
};

// ═══════════════════════════════════════════════════════════════════════════
// 레퍼런스 (서버에서 받아오는 눈운동 가이드 데이터)
// ═══════════════════════════════════════════════════════════════════════════

/** 가이드 경로 위의 한 목표 지점 */
export type EyeTarget = {
  /** 이 목표에 해당하는 phase
   * follow1 | follow2 | follow3 | hold (end 생략)
   */
  phase: EyePhase;
  /** 목표 위치 (정규화: 0~1) */
  x: number;
  y: number;
  /** 해당 지점에서 시선을 유지해야 하는 시간 (ms) */
  holdMs: number;
};

/** 눈운동 스트레칭 레퍼런스 */
export type EyeStretchingReference = {
  /** 순서대로 따라갈 목표 지점 배열 */
  keyFrames: ReadonlyArray<EyeTarget>;
  /** 전체 운동 시간 (ms) */
  totalDurationMs: number;
};

// ═══════════════════════════════════════════════════════════════════════════
// 엔진 I/O
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 'follow1' ~ 'follow3': calibration 용 시선 위치 (모니터 내) - 3초
 * 'hold': 실제 유지해야 할 시선 위치 (모니터 외) - 10초
 */
export type EyePhase = 'follow1' | 'follow2' | 'follow3' | 'hold' | 'end';

export type EyeEvaluateInput = {
  /** 현재 시선 프레임 */
  frame: GazeFrame;
  /** 눈운동 레퍼런스 데이터 */
  reference: EyeStretchingReference;
  /** 이전 프레임의 목표 인덱스 (첫 호출: 0) */
  prevTargetIndex: number;
  /** 이전 프레임의 phase (첫 호출: 'follow1') */
  prevPhase: EyePhase;
  /** 현재 목표에서 누적된 hold 시간 (ms, 외부 관리) */
  holdMs: number;
};

export type EyeSessionResult = {
  /** 시선-목표 정확도 점수 (0~100) */
  score: number;
  /** 현재 목표 인덱스 */
  currentTargetIndex: number;
  /** 현재 phase */
  phase: EyePhase;
  /** 현재 목표에서의 누적 hold 시간 (ms) */
  holdMs: number;
  /** 전체 진행률 (0~1) */
  progressRatio: number;
  /** 디버깅용 메타 정보 */
  meta?: Readonly<Record<string, unknown>>;
};

// ═══════════════════════════════════════════════════════════════════════════
// 엔진 인터페이스
// ═══════════════════════════════════════════════════════════════════════════

export type EyeStretchingEngine = {
  evaluate: (input: EyeEvaluateInput) => EyeSessionResult;
};
