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
 * 특정 eye-tracking 라이브러리에 의존하지 않으며,
 * EyeTracker 인터페이스를 구현하는 어댑터를 주입받는다.
 *
 * 참고: stretching-session/create-session.ts 패턴
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
  getPrevTargetIndex: () => number;
  /** 이전 phase 조회 */
  getPrevPhase: () => EyePhase;

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
    getPrevTargetIndex,
    getPrevPhase,
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
  const handleGaze = (prediction: GazePrediction): void => {
    if (!isRunning) return;

    try {
      const timestampMs = performance.now();
      const gaze = {
        x: prediction.x / window.innerWidth,
        y: prediction.y / window.innerHeight,
      };

      const frame: GazeFrame = { timestampMs, gaze };
      const resolvedReference = getReference ? getReference() : reference;

      const result = engine.evaluate({
        frame,
        reference: resolvedReference,
        prevTargetIndex: getPrevTargetIndex(),
        prevPhase: getPrevPhase(),
        holdMs: getHoldMs(),
      });

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
