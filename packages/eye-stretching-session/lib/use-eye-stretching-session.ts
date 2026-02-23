/// <reference path="./webgazer.d.ts" />
/**
 * @file use-eye-stretching-session.ts
 * @description 눈운동 스트레칭 세션 React hook
 *
 * 역할:
 *   1. WebGazer npm 패키지 dynamic import → createWebGazerTracker 어댑터 생성
 *   2. createEyeSession 호출 (tracker + engine + 콜백 연결)
 *   3. holdMs 누적 / phase / targetIndex 상태 관리
 *   4. UI-ready state 반환
 *
 * holdMs 누적 정책 (stretching-session 패턴 동일):
 *   - score >= threshold → deltaMs 누적
 *   - score < threshold → holdMs 리셋 (설정에 따라)
 *   - 마지막 target holdMs 도달 → engine이 phase='end' 반환 → 세션 완료
 *
 * 참고: features/stretching-session/lib/use-stretching-session.ts
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  createEyeSession,
  createEyeStretchingEngine,
  createWebGazerTracker,
  type EyePhase,
  type EyeSession,
  type EyeSessionResult,
  type EyeStretchingEngine,
  type EyeStretchingReference,
  type GazeFrame,
  type WebGazerInstance,
} from '@repo/eye-stretching-session';

import { EYE_SESSION_CONFIG } from '../config/constants';

// ═══════════════════════════════════════════════════════════════════════════
// 타입
// ═══════════════════════════════════════════════════════════════════════════

export type UseEyeStretchingSessionOptions = {
  /** 제한 시간 (초). 미설정 시 타이머 없음 */
  limitTimeSeconds?: number;
};

export type UseEyeStretchingSessionResult = {
  /** WebGazer 로딩 중 */
  isLoading: boolean;
  /** 시선 추적 활성화됨 */
  isTrackerReady: boolean;
  /** 세션 완료 (end phase 도달 또는 시간 만료) */
  isSessionComplete: boolean;
  /** 현재 phase */
  phase: EyePhase;
  /** 현재 target 인덱스 */
  currentTargetIndex: number;
  /** 정확도 점수 (0~100) */
  score: number;
  /** 현재 target에서의 누적 유지 시간 (초 단위, UI용) */
  holdSeconds: number;
  /** 전체 진행률 (0~1) */
  progressRatio: number;
  /** 남은 제한 시간 (초) */
  timeRemainingSeconds: number;
  /** 시선 x 좌표 (0~1 정규화) */
  gazeX: number;
  /** 시선 y 좌표 (0~1 정규화) */
  gazeY: number;
  /** 가이드 dot x 좌표 (follow 보간 / hold 고정, 0~1 정규화) */
  guideX: number;
  /** 가이드 dot y 좌표 (follow 보간 / hold 고정, 0~1 정규화) */
  guideY: number;
  /** 에러 */
  error: Error | null;
};

// ═══════════════════════════════════════════════════════════════════════════
// useEvent — 콜백 identity 안정화 (재생성 방지)
// ═══════════════════════════════════════════════════════════════════════════

function useEvent<T extends (...args: never[]) => unknown>(handler: T): T {
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(((...args: Parameters<T>) => handlerRef.current(...args)) as T, []);
}

// ═══════════════════════════════════════════════════════════════════════════
// Hook
// ═══════════════════════════════════════════════════════════════════════════

export function useEyeStretchingSession(
  reference: EyeStretchingReference | null,
  options?: UseEyeStretchingSessionOptions,
): UseEyeStretchingSessionResult {
  // ── refs (hot path, 렌더링 없이 매 프레임 갱신) ──────────────────────
  const holdMsRef = useRef(0);
  const prevTargetIndexRef = useRef(0);
  const lastResultAtRef = useRef<number | null>(null);
  const sessionRef = useRef<EyeSession | null>(null);
  const engineRef = useRef<EyeStretchingEngine | null>(null);
  const isSessionCompleteRef = useRef(false);
  const referenceRef = useRef(reference);
  const phaseRef = useRef<EyePhase>('follow1');
  const elapsedHoldSecondsRef = useRef(0);
  const lastTickAtRef = useRef<number | null>(null);

  // UI commit throttle refs
  const lastUiScoreRef = useRef(0);
  const lastUiScoreCommitAtRef = useRef(0);
  const lastUiHoldSecondsRef = useRef(0);

  // ── UI state ─────────────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(true);
  const [isTrackerReady, setIsTrackerReady] = useState(false);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [phase, setPhase] = useState<EyePhase>('follow1');
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [holdSeconds, setHoldSeconds] = useState(0);
  const [progressRatio, setProgressRatio] = useState(0);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(options?.limitTimeSeconds ?? 0);
  const [gazeX, setGazeX] = useState(0);
  const [gazeY, setGazeY] = useState(0);
  const [guideX, setGuideX] = useState(0.5);
  const [guideY, setGuideY] = useState(0.5);
  const [error, setError] = useState<Error | null>(null);

  // ── reference ref 최신화 ─────────────────────────────────────────────
  useEffect(() => {
    referenceRef.current = reference;
  }, [reference]);

  // ── 엔진 결과 핸들러 ─────────────────────────────────────────────────
  const handleResultImpl = useCallback((result: EyeSessionResult, frame: GazeFrame) => {
    if (isSessionCompleteRef.current) return;

    // 1. target 전환 감지 (holdMs 리셋을 위해 갱신 전에 비교)
    const targetAdvanced = result.currentTargetIndex !== prevTargetIndexRef.current;

    // 2. 엔진 output → refs 갱신 (다음 프레임 input용)
    prevTargetIndexRef.current = result.currentTargetIndex;

    // 3. phase / target / progressRatio / gaze / guide → UI
    phaseRef.current = result.phase;
    setPhase(result.phase);
    setCurrentTargetIndex(result.currentTargetIndex);
    setProgressRatio(result.progressRatio);
    setGazeX(frame.gaze.x);
    setGazeY(frame.gaze.y);

    // 엔진이 계산한 보간된 가이드 dot 위치 (follow: cursor trail, hold: 고정)
    const meta = result.meta as { interpolatedTarget?: { x: number; y: number } } | undefined;
    if (meta?.interpolatedTarget) {
      setGuideX(meta.interpolatedTarget.x);
      setGuideY(meta.interpolatedTarget.y);
    }

    // 4. score → UI (throttled)
    const now = performance.now();
    if (
      Math.abs(result.score - lastUiScoreRef.current) >= 1 ||
      now - lastUiScoreCommitAtRef.current >= EYE_SESSION_CONFIG.ACCURACY_COMMIT_INTERVAL_MS
    ) {
      lastUiScoreRef.current = result.score;
      lastUiScoreCommitAtRef.current = now;
      setScore(Math.round(result.score));
    }

    // 5. end phase → 세션 완료
    if (result.phase === 'end' && result.progressRatio >= 1) {
      isSessionCompleteRef.current = true;
      setIsSessionComplete(true);
      return;
    }

    // 6. target 전환 시 holdMs 리셋 (새 target은 0부터 시작)
    if (targetAdvanced) {
      holdMsRef.current = 0;
      lastResultAtRef.current = frame.timestampMs;
      lastUiHoldSecondsRef.current = 0;
      setHoldSeconds(0);
      return;
    }

    // 7. holdMs 누적
    // follow phase: 캘리브레이션이므로 score 무관하게 항상 누적 (auto-advance)
    // hold phase:   score threshold 기반 누적/리셋
    const isFollowPhase = result.phase.startsWith('follow');

    if (!isFollowPhase && result.score < EYE_SESSION_CONFIG.SUCCESS_SCORE_THRESHOLD) {
      // hold phase 실패 시 리셋
      if (EYE_SESSION_CONFIG.RESET_HOLD_ON_FAILURE) {
        holdMsRef.current = 0;
        if (lastUiHoldSecondsRef.current !== 0) {
          lastUiHoldSecondsRef.current = 0;
          setHoldSeconds(0);
        }
      }
      lastResultAtRef.current = frame.timestampMs;
      return;
    }

    // follow: 항상 누적 / hold: score >= threshold 시 누적
    const lastAt = lastResultAtRef.current ?? frame.timestampMs;
    const deltaMs = Math.max(0, frame.timestampMs - lastAt);
    lastResultAtRef.current = frame.timestampMs;

    holdMsRef.current += deltaMs;

    const nextHoldSeconds = Math.floor(holdMsRef.current / 1000);
    if (nextHoldSeconds !== lastUiHoldSecondsRef.current) {
      lastUiHoldSecondsRef.current = nextHoldSeconds;
      setHoldSeconds(nextHoldSeconds);
    }
  }, []);

  const handleResult = useEvent(handleResultImpl);

  // ── 세션 라이프사이클 ────────────────────────────────────────────────
  useEffect(() => {
    if (!reference) return;

    let cancelled = false;

    const init = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 1. WebGazer dynamic import (npm 패키지)
        const webgazerModule = await import('webgazer');
        if (cancelled) return;

        const webgazer = webgazerModule.default as WebGazerInstance;
        const tracker = createWebGazerTracker(webgazer);

        // 2. 엔진 생성
        const engine = createEyeStretchingEngine();
        engineRef.current = engine;

        // 3. 세션 생성
        const session = createEyeSession({
          tracker,
          reference,
          getReference: () => referenceRef.current ?? reference,
          getHoldMs: () => holdMsRef.current,
          getCurrentTargetIndex: () => prevTargetIndexRef.current,
          engine,
          onResult: handleResult,
          onError: (err) => setError(err),
          onLog: ({ type, detail }) => {
            if (process.env.NODE_ENV !== 'production') {
              console.debug(`[eye-session] ${type}`, detail ?? {});
            }
          },
        });

        if (cancelled) {
          session.destroy();
          return;
        }

        sessionRef.current = session;

        // 4. 세션 시작
        await session.start();

        if (cancelled) {
          session.destroy();
          return;
        }

        setIsLoading(false);
        setIsTrackerReady(true);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsLoading(false);
        }
      }
    };

    // 상태 초기화
    holdMsRef.current = 0;
    prevTargetIndexRef.current = 0;
    lastResultAtRef.current = null;
    isSessionCompleteRef.current = false;
    lastUiScoreRef.current = 0;
    lastUiScoreCommitAtRef.current = 0;
    lastUiHoldSecondsRef.current = 0;
    phaseRef.current = 'follow1';
    elapsedHoldSecondsRef.current = 0;
    lastTickAtRef.current = null;

    setPhase('follow1');
    setCurrentTargetIndex(0);
    setScore(0);
    setHoldSeconds(0);
    setProgressRatio(0);
    setIsSessionComplete(false);
    setIsTrackerReady(false);

    void init();

    return () => {
      cancelled = true;
      sessionRef.current?.destroy();
      sessionRef.current = null;
      engineRef.current = null;
      setIsTrackerReady(false);
    };
  }, [reference, handleResult]);

  // ── 세션 완료 시 stop ────────────────────────────────────────────────
  useEffect(() => {
    if (!isSessionComplete) return;
    sessionRef.current?.stop();
  }, [isSessionComplete]);

  // ── 제한 시간 타이머 (캘리브레이션 중에는 정지) ─────────────────────
  useEffect(() => {
    const limitTime = options?.limitTimeSeconds;
    if (!limitTime || !isTrackerReady || isSessionComplete) return;

    lastTickAtRef.current = Date.now();

    const tick = () => {
      const now = Date.now();
      const lastTickAt = lastTickAtRef.current ?? now;
      const deltaSec = (now - lastTickAt) / 1000;
      lastTickAtRef.current = now;

      // follow(캘리브레이션) 중에는 경과 시간을 누적하지 않음
      if (!phaseRef.current.startsWith('follow')) {
        elapsedHoldSecondsRef.current += deltaSec;
      }

      const remaining = Math.max(0, limitTime - elapsedHoldSecondsRef.current);
      setTimeRemainingSeconds(Math.ceil(remaining));

      if (remaining <= 0 && !isSessionCompleteRef.current) {
        isSessionCompleteRef.current = true;
        setIsSessionComplete(true);
      }
    };

    tick();
    const id = window.setInterval(tick, EYE_SESSION_CONFIG.TIMER_TICK_MS);
    return () => window.clearInterval(id);
  }, [isTrackerReady, isSessionComplete, options?.limitTimeSeconds]);

  // ── 반환 ─────────────────────────────────────────────────────────────
  return {
    isLoading,
    isTrackerReady,
    isSessionComplete,
    phase,
    currentTargetIndex,
    score,
    holdSeconds,
    progressRatio,
    timeRemainingSeconds,
    gazeX,
    gazeY,
    guideX,
    guideY,
    error,
  };
}
