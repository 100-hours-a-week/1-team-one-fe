/**
 * @file create-eye-engine.ts
 * @description Eye-tracking 기반 눈운동 스트레칭 평가 엔진
 *
 * Phase 흐름:
 *   follow1 → follow2 → follow3 → hold → end
 *
 *   - follow1~3: calibration (모니터 내 점 응시, 각 3초)
 *   - hold: 실제 눈운동 (모니터 외부 시선 유지, 10초)
 *
 * 프레임 단위 평가:
 * 1. 시선 좌표 스무딩 (EMA)
 * 2. 현재 목표 지점과의 거리 → score (0~100)
 * 3. score >= threshold 일 때 외부에서 holdMs 누적
 * 4. holdMs >= target.holdMs → 다음 phase로 이동
 * 5. 마지막 target의 holdMs 도달 → end, progressRatio = 1.0
 *
 * 패턴: stretching-accuracy의 DURATION 흐름과 동일
 *   - holdMs는 외부(hook)에서 관리
 *   - 엔진은 score + phase 전환만 판정
 */

import type { EyeStretchingEngine, EyeEvaluateInput, EyeSessionResult } from '../types';
import { createGazeSmoother } from '../utils/gaze-smoothing';

/** 시선이 목표에 도달했다고 판단하는 최소 점수 (0~100) */
export const EYE_MATCH_THRESHOLD = 60;

/** 거리 → 점수 변환 허용치 (정규화 좌표 기준) */
const GAZE_TOLERANCE = 0.1;

/** 점수 EMA alpha (낮을수록 더 안정적) */
const SCORE_SMOOTHING_FACTOR = 0.4;

/**
 * 눈운동 스트레칭 평가 엔진 생성
 *
 * @returns EyeStretchingEngine - evaluate 메서드를 포함한 엔진 객체
 */
export function createEyeStretchingEngine(): EyeStretchingEngine {
  // 시선 좌표 스무딩
  const gazeSmoother = createGazeSmoother(0.4);

  // 점수 스무딩 상태
  let smoothedScore: number | null = null;

  /**
   * 점수에 EMA 적용하여 안정화
   * (stretching-accuracy의 smoothScore와 동일)
   */
  const smoothScore = (rawScore: number): number => {
    if (smoothedScore === null) {
      smoothedScore = rawScore;
    } else {
      smoothedScore =
        SCORE_SMOOTHING_FACTOR * rawScore + (1 - SCORE_SMOOTHING_FACTOR) * smoothedScore;
    }
    return smoothedScore;
  };

  /**
   * 시선-목표 거리 기반 정확도 점수 계산
   *
   * score = exp(-distance / tolerance) * 100
   *   - distance 0   → 100점
   *   - distance 0.05 → ~60점 (threshold 근처)
   *   - distance 0.1  → ~37점
   */
  const calculateGazeScore = (
    gazeX: number,
    gazeY: number,
    targetX: number,
    targetY: number,
  ): number => {
    const dx = gazeX - targetX;
    const dy = gazeY - targetY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return Math.exp(-distance / GAZE_TOLERANCE) * 100;
  };

  /**
   * 프레임 단위 평가
   *
   * @param input - EyeEvaluateInput
   *   - frame: 현재 시선 프레임 (timestampMs, gaze: { x, y, confidence })
   *   - reference: 눈운동 레퍼런스 (targets 배열 + totalDurationMs)
   *   - prevTargetIndex: 이전 프레임의 목표 인덱스 (첫 호출: 0)
   *   - prevPhase: 이전 프레임의 phase (첫 호출: 'follow1')
   *   - holdMs: 현재 목표에서 누적된 hold 시간 (외부 관리)
   *
   * @returns EyeSessionResult
   *   - score: 정확도 점수 (0~100)
   *   - currentTargetIndex: 현재 목표 인덱스
   *   - phase: 현재 phase
   *   - holdMs: 입력받은 holdMs 그대로 반환 (외부 관리이므로)
   *   - progressRatio: 전체 진행률 (0~1)
   */
  const evaluate = (input: EyeEvaluateInput): EyeSessionResult => {
    const { frame, reference, prevTargetIndex, holdMs } = input;
    const targets = reference.keyFrames;

    // ─────────────────────────────────────────────────────────────────
    // 1. 시선 좌표 스무딩
    // ─────────────────────────────────────────────────────────────────
    const smoothedGaze = gazeSmoother.smooth(frame.gaze);

    // ─────────────────────────────────────────────────────────────────
    // 2. 현재 target 결정 (prevTargetIndex 기반)
    // ─────────────────────────────────────────────────────────────────
    const currentIdx = Math.min(prevTargetIndex, targets.length - 1);
    const currentTarget = targets[currentIdx]!;

    // ─────────────────────────────────────────────────────────────────
    // 3. 시선-목표 거리 → score 계산
    // ─────────────────────────────────────────────────────────────────
    const rawScore = calculateGazeScore(
      smoothedGaze.x,
      smoothedGaze.y,
      currentTarget.x,
      currentTarget.y,
    );
    const finalScore = smoothScore(rawScore);

    // ─────────────────────────────────────────────────────────────────
    // 4. Phase 전환 판정
    //    holdMs >= currentTarget.holdMs → 다음 target으로 이동
    //    마지막 target 완료 시 → 'end' phase, progressRatio = 1.0
    // ─────────────────────────────────────────────────────────────────
    let newTargetIndex = currentIdx;
    let phase = currentTarget.phase;

    if (holdMs >= currentTarget.holdMs) {
      const nextIdx = currentIdx + 1;
      if (nextIdx < targets.length) {
        // 다음 target으로 advance
        newTargetIndex = nextIdx;
        phase = targets[nextIdx]!.phase;
      } else {
        // 마지막 target 완료 → 세션 종료
        phase = 'end';
      }
    }

    // ─────────────────────────────────────────────────────────────────
    // 5. progressRatio 계산
    //    완료된 target들의 holdMs 합 + 현재 target의 holdMs 진행분
    //    ÷ totalDurationMs
    // ─────────────────────────────────────────────────────────────────
    const completedMs = targets.slice(0, currentIdx).reduce((sum, t) => sum + t.holdMs, 0);
    const clampedHoldMs = Math.min(holdMs, currentTarget.holdMs);
    const progressRatio =
      reference.totalDurationMs > 0
        ? Math.min((completedMs + clampedHoldMs) / reference.totalDurationMs, 1.0)
        : 0;

    // ─────────────────────────────────────────────────────────────────
    // 6. 결과 반환
    // ─────────────────────────────────────────────────────────────────
    return {
      score: Math.round(finalScore),
      currentTargetIndex: newTargetIndex,
      phase,
      holdMs,
      progressRatio,
      meta: {
        smoothedGaze,
        distance: Math.sqrt(
          (smoothedGaze.x - currentTarget.x) ** 2 + (smoothedGaze.y - currentTarget.y) ** 2,
        ),
      },
    };
  };

  return { evaluate };
}
