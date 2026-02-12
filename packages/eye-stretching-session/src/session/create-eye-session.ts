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
import { interpolateFollowTarget } from '../utils/interpolate-target';

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
  /**
   * 캘리브레이션 데이터 주입 (pixel 좌표)
   * @param eventType 'click' = keyFrame 정확 좌표 (고가중), 'move' = 보간 trail (저가중)
   */
  calibrate?: (pixelX: number, pixelY: number, eventType?: 'click' | 'move') => void;
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

  /**
   * 모바일 브라우저 뷰포트 안정화:
   * 주소창 표시/숨김으로 clientWidth/innerHeight가 ±10% 변동하면
   * 캘리브레이션 pixel↔정규화 매핑이 프레임마다 달라져 학습 데이터 오염.
   * → 세션 시작 시 1회 캡처하여 전체 세션에서 고정 사용.
   */
  let fixedVw = 0;
  let fixedVh = 0;

  /**
   * WebGazer ridge regression 데이터 구조:
   *   - 'click' DataWindow(50): 주요 학습 데이터 (영구, 최근 50개)
   *   - 'move'  DataWindow(10): 최근 컨텍스트 (~1초)
   *   - predict() = ridge(50 clicks + 10 moves)
   *
   * Vanilla WebGazer 패턴 재현:
   *   'click' (400ms 간격): 보간 trail + keyFrame → click DataWindow(50) 채움
   *   'move'  (100ms 간격): 보간 trail → move DataWindow(10) 채움 (최근 1초 컨텍스트)
   */
  const CALIBRATE_CLICK_INTERVAL_MS = 400;
  const CALIBRATE_MOVE_INTERVAL_MS = 100;
  let lastClickCalibrateAt = 0;
  let lastMoveCalibrateAt = 0;

  /** 타겟 advance 감지용 — 각 keyFrame 정확 좌표에서 클릭 기록 */
  let prevResultTargetIndex = 0;

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

      // 첫 프레임에서 뷰포트 크기 고정 (모바일 주소창 변동 방지)
      if (fixedVw === 0) {
        fixedVw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        fixedVh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        emitLog('viewport_locked', { vw: fixedVw, vh: fixedVh });
      }
      const vw = fixedVw;
      const vh = fixedVh;

      const gaze = {
        x: Math.max(0, Math.min(1, prediction.x / vw)),
        y: Math.max(0, Math.min(1, prediction.y / vh)),
      };

      // 30프레임마다 1회 로깅 (콘솔 과부하 방지)
      if (gazeLogCounter % 30 === 0) {
        emitLog('gaze_frame', {
          raw: { x: prediction.x, y: prediction.y },
          viewport: { w: vw, h: vh },
          normalized: { x: gaze.x, y: gaze.y },
        });
      }
      gazeLogCounter += 1;

      const frame: GazeFrame = { timestampMs, gaze };
      const resolvedReference = getReference ? getReference() : reference;

      const currentTargetIndex = getCurrentTargetIndex();
      const holdMs = getHoldMs();

      // ── 캘리브레이션 데이터 주입 (follow phase에서만) ──────────────
      // follow phase: 가이드 dot을 따라가므로 시선 위치를 알 수 있다 → 학습 데이터 주입
      // hold phase: 시선 정확도를 측정하는 구간 → 캘리브레이션 하면 모델 오염
      const currentTarget = resolvedReference.keyFrames[currentTargetIndex];
      const isFollowPhase = currentTarget?.phase.startsWith('follow');

      if (isFollowPhase && currentTarget && tracker.calibrate) {
        const interpolated = interpolateFollowTarget(
          resolvedReference.keyFrames,
          currentTargetIndex,
          holdMs,
        );
        const pixelX = interpolated.x * vw;
        const pixelY = interpolated.y * vh;

        // 'click' (400ms): click DataWindow(50) — 주요 학습 데이터
        if (timestampMs - lastClickCalibrateAt >= CALIBRATE_CLICK_INTERVAL_MS) {
          lastClickCalibrateAt = timestampMs;
          tracker.calibrate(pixelX, pixelY, 'click');
        }

        // 'move' (100ms): move DataWindow(10) — 최근 ~1초 컨텍스트
        if (timestampMs - lastMoveCalibrateAt >= CALIBRATE_MOVE_INTERVAL_MS) {
          lastMoveCalibrateAt = timestampMs;
          tracker.calibrate(pixelX, pixelY, 'move');
        }
      }

      const result = engine.evaluate({
        frame,
        reference: resolvedReference,
        currentTargetIndex,
        holdMs,
      });

      // ── keyFrame 정확 좌표 클릭 (target advance 감지, follow→* 전환만) ──
      // follow phase가 완료되었을 때만 해당 keyFrame 정확 좌표에 클릭 기록.
      // hold phase 완료 시에는 기록하지 않는다 (측정 구간이므로).
      if (result.currentTargetIndex !== prevResultTargetIndex && tracker.calibrate) {
        const completedTarget = resolvedReference.keyFrames[prevResultTargetIndex];
        const wasFollowPhase = completedTarget?.phase.startsWith('follow');

        if (completedTarget && wasFollowPhase) {
          tracker.calibrate(completedTarget.x * vw, completedTarget.y * vh, 'click');
          emitLog('calibrate_keyframe', {
            type: 'complete',
            targetIndex: prevResultTargetIndex,
            phase: completedTarget.phase,
            x: completedTarget.x,
            y: completedTarget.y,
          });
        }

        // 스로틀 리셋 → 새 follow 타겟의 연속 캘리브레이션이 즉시 시작
        lastClickCalibrateAt = 0;
        lastMoveCalibrateAt = 0;
        prevResultTargetIndex = result.currentTargetIndex;
      }

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
