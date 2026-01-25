import { createSession, type ExerciseType, type StretchingSession } from '@repo/stretching-session';
import { type RefObject, useCallback, useEffect, useMemo, useRef } from 'react';

import type { ExerciseSessionStep } from '@/src/entities/exercise-session';
import { useExerciseSessionQuery } from '@/src/features/exercise-session';

import { STRETCHING_SESSION_CONFIG } from '../config/constants';

const toExerciseType = (type: string): ExerciseType => {
  if (type === 'REPS') return 'REPS';
  return 'DURATION';
};

export type UseStretchingSessionResult = {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  isLoading: boolean;
  currentStep?: ExerciseSessionStep;
};

export function useStretchingSession(sessionId: string | null): UseStretchingSessionResult {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { data, isLoading } = useExerciseSessionQuery(sessionId ?? '', {
    enabled: Boolean(sessionId),
  });

  // TODO:스텝 전환 로직 확정 후 스텝 선택 방식 교체
  const currentStep = useMemo(() => data?.routineSteps[0], [data]);
  const referencePose = currentStep?.exercise.pose.referencePose;
  const exerciseType = useMemo(() => {
    if (!currentStep) return null;
    return toExerciseType(currentStep.exercise.type);
  }, [currentStep]);

  // TODO:진행률 정책 확정 후 계산 로직 반영
  const getProgressRatio = useCallback(() => {
    return STRETCHING_SESSION_CONFIG.DEFAULT_PROGRESS_RATIO;
  }, []);

  // TODO:phase 정책 확정 후 상태 머신으로 교체
  const getPhase = useCallback(() => {
    return STRETCHING_SESSION_CONFIG.DEFAULT_PHASE;
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;
    if (!referencePose) return;
    if (!canvasRef.current) return;
    if (!exerciseType) return;

    const session: StretchingSession = createSession({
      video: videoRef.current,
      modelAssetPath: STRETCHING_SESSION_CONFIG.MODEL_ASSET_PATH,
      wasmRoot: STRETCHING_SESSION_CONFIG.WASM_ROOT,
      referencePose,
      getProgressRatio,
      exerciseType,
      getPhase,
      silhouette: {
        canvas: canvasRef.current,
        foregroundColor: STRETCHING_SESSION_CONFIG.SILHOUETTE_FOREGROUND_RGBA,
        backgroundColor: STRETCHING_SESSION_CONFIG.SILHOUETTE_BACKGROUND_RGBA,
        visibilityMin: STRETCHING_SESSION_CONFIG.SILHOUETTE_VISIBILITY_MIN,
        smoothingAlpha: STRETCHING_SESSION_CONFIG.SILHOUETTE_SMOOTHING_ALPHA,
        headRadiusRatio: STRETCHING_SESSION_CONFIG.SILHOUETTE_HEAD_RADIUS_RATIO,
        strokeWidthRatio: STRETCHING_SESSION_CONFIG.SILHOUETTE_STROKE_WIDTH_RATIO,
      },
    });

    void session.start();

    return () => {
      session.destroy();
    };
  }, [exerciseType, getPhase, getProgressRatio, referencePose]);

  return {
    videoRef,
    canvasRef,
    isLoading,
    currentStep,
  };
}
