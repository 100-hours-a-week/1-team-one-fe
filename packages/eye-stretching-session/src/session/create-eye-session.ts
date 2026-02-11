/**
 * @file create-eye-session.ts
 * @description 시선 추적 세션 래퍼
 *
 * 역할:
 *   1. 외부에서 주입받은 EyeTracker 인스턴스로 시선 데이터 수신
 *   2. gaze prediction → GazeFrame 변환 (raw pixel → 정규화 0~1)
 *   3. engine.evaluate() 호출 → onResult 콜백 전달
 *   4. start / stop / destroy 라이프사이클
 *
 * holdMs 누적, phase 전환 상태 관리는 소비자(hook) 책임.
 * 세션은 매 프레임 콜백으로 state getter를 호출하여 최신 값을 엔진에 전달한다.
 *
 * phase 규칙:
 * 본 세션 래퍼는 phase를 계산하거나 저장하지 않는다.
 * - 기본 phase는 항상 targets[n].phase 를 따른다.
 * - 'end' phase는 target에 속하지 않는 terminal state이며,
 * - engine.evaluate() 내부 조건(holdMs, progressRatio)에 의해 동적으로 반환된다.
 *
 * EyeTracker 규칙:
 * - 특정 eye-tracking 라이브러리에 의존하지 않는다.
 * - EyeTracker 인터페이스를 구현하는 어댑터를 주입받는다.
 *
 * 참고: stretching-session/create-session.ts 패턴
 * 차이점:
 * - Finite State Machine이 아니라 Target Progress Engine 구조 사용
 * - phase는 상태가 아니라 targetIndex + holdMs 조건으로 매 프레임 재계산되는 파생 값
 * - 내부 로직에 prevPhase가 사용되지 않는다.
 */

import type {
  EyeStretchingEngine,
  EyeStretchingReference,
  EyeSessionResult,
  EyePhase,
  GazeFrame,
} from '../types';
import { createEyeStretchingEngine } from '../engine/create-eye-engine';

// ═══════════════════════════════════════════════════════════════════════════
// Eye Tracker 인터페이스 (라이브러리 무관)
// ═══════════════════════════════════════════════════════════════════════════

/** 시선 추적 라이브러리가 반환하는 raw 좌표 (pixel 단위) */
export type GazePrediction = { x: number; y: number };

/**
 * 시선 추적 라이브러리 어댑터 인터페이스
 *
 * 소비자(hook)에서 구체적인 라이브러리(WebGazer 등)를
 * 이 인터페이스에 맞춰 래핑한 뒤 주입한다.
 *
 * @example
 * // WebGazer 어댑터 예시 (hook 레벨에서 구현)
 * const tracker: EyeTracker = {
 *   start: () => { webgazer.begin(); },
 *   stop: () => { webgazer.end(); },
 *   onGaze: (cb) => { webgazer.setGazeListener((d) => d && cb(d)); },
 * };
 */
export type EyeTracker = {
  /** 시선 추적 시작 (카메라 활성화 등) */
  start: () => void | Promise<void>;
  /** 시선 추적 중지 */
  stop: () => void;
  /** 시선 데이터 수신 콜백 등록 */
  onGaze: (callback: (prediction: GazePrediction) => void) => void;
  /** 캘리브레이션 데이터 주입 (pixel 좌표) — follow phase에서 호출 */
  calibrate?: (pixelX: number, pixelY: number) => void;
};

// ═══════════════════════════════════════════════════════════════════════════
// 세션 옵션 / 반환 타입
// ═══════════════════════════════════════════════════════════════════════════

export type CreateEyeSessionOptions = {
  /** 시선 추적 어댑터 (필수) */
  tracker: EyeTracker;

  /** 눈운동 레퍼런스 (초기값) */
  reference: EyeStretchingReference;
  /** 동적 레퍼런스 조회 (step 변경 시) */
  getReference?: () => EyeStretchingReference;

  /** 외부 관리 holdMs 조회 */
  getHoldMs: () => number;
  /** 이전 target index 조회 */
  getCurrentTargetIndex: () => number;

  /** 평가 엔진 (미제공 시 자동 생성) */
  engine?: EyeStretchingEngine;

  /** 프레임별 평가 결과 콜백 */
  onResult?: (result: EyeSessionResult, frame: GazeFrame) => void;
  /** 에러 콜백 */
  onError?: (error: Error) => void;
  /** 로그 콜백 */
  onLog?: (event: { type: string; detail?: Readonly<Record<string, unknown>> }) => void;
};

export type EyeSession = {
  start: () => Promise<void>;
  stop: () => void;
  destroy: () => void;
};

// ═══════════════════════════════════════════════════════════════════════════
// 팩토리
// ═══════════════════════════════════════════════════════════════════════════

export function createEyeSession(options: CreateEyeSessionOptions): EyeSession {
  const {
    tracker,
    reference,
    getReference,
    getHoldMs,
    getCurrentTargetIndex,
    engine = createEyeStretchingEngine(),
    onResult,
    onError,
    onLog,
  } = options;

  let isRunning = false;

  const emitLog = (type: string, detail?: Readonly<Record<string, unknown>>): void => {
    onLog?.({ type, detail });
  };

  const emitError = (error: unknown): void => {
    onError?.(error instanceof Error ? error : new Error(String(error)));
  };

  /**
   * 시선 데이터 수신 콜백
   *
   * 1. raw pixel → 정규화 좌표 변환
   * 2. GazeFrame 생성 (timestampMs = performance.now())
   * 3. engine.evaluate() → onResult
   */
  let gazeLogCounter = 0;

  const handleGaze = (prediction: GazePrediction): void => {
    if (!isRunning) return;

    try {
      const timestampMs = performance.now();
      const gaze = {
        x: prediction.x / window.innerWidth,
        y: prediction.y / window.innerHeight,
      };

      // 30프레임마다 1회 로깅 (콘솔 과부하 방지)
      if (gazeLogCounter % 30 === 0) {
        emitLog('gaze_frame', {
          raw: { x: prediction.x, y: prediction.y },
          viewport: { w: window.innerWidth, h: window.innerHeight },
          normalized: { x: gaze.x, y: gaze.y },
        });
      }
      gazeLogCounter += 1;

      const frame: GazeFrame = { timestampMs, gaze };
      const resolvedReference = getReference ? getReference() : reference;

      const currentTargetIndex = getCurrentTargetIndex();
      const holdMs = getHoldMs();

      // follow phase → WebGazer ridge regression 캘리브레이션 데이터 주입 (매 프레임)
      const currentTarget = resolvedReference.keyFrames[currentTargetIndex];
      if (currentTarget && currentTarget.phase.startsWith('follow') && tracker.calibrate) {
        const pixelX = currentTarget.x * window.innerWidth;
        const pixelY = currentTarget.y * window.innerHeight;
        tracker.calibrate(pixelX, pixelY);
      }

      const result = engine.evaluate({
        frame,
        reference: resolvedReference,
        currentTargetIndex,
        holdMs,
      });

      // 30프레임마다 1회 로깅
      if ((gazeLogCounter - 1) % 30 === 0) {
        emitLog('evaluate_result', {
          score: result.score,
          phase: result.phase,
          targetIndex: result.currentTargetIndex,
          holdMs: result.holdMs,
          progressRatio: result.progressRatio,
        });
      }

      onResult?.(result, frame);
    } catch (error) {
      emitError(error);
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // 라이프사이클
  // ─────────────────────────────────────────────────────────────────

  const start = async (): Promise<void> => {
    if (isRunning) return;

    try {
      emitLog('eye_session_start');
      tracker.onGaze(handleGaze);
      await tracker.start();
      isRunning = true;
      emitLog('eye_session_started');
    } catch (error) {
      emitLog('eye_session_start_error', { message: String(error) });
      emitError(error);
    }
  };

  const stop = (): void => {
    if (!isRunning) return;
    isRunning = false;
    emitLog('eye_session_stop');

    try {
      tracker.stop();
    } catch {
      // tracker가 이미 해제된 경우 무시
    }
  };

  const destroy = (): void => {
    stop();
  };

  return { start, stop, destroy };
}
