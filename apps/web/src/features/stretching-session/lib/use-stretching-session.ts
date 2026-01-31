import {
  type AccuracyEngine,
  type AccuracyEvaluateInput,
  type AccuracyResult,
  type CountedStatus,
  type ExerciseType,
  type PoseFrame,
} from '@repo/stretching-accuracy';
import { createSession, type StretchingSession } from '@repo/stretching-session';
import { type RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { ExerciseSessionStep } from '@/src/entities/exercise-session';
import {
  type CompleteExerciseSessionResponseData,
  useCompleteExerciseSessionMutation,
  useExerciseSessionQuery,
} from '@/src/features/exercise-session';
import { formatDateTime } from '@/src/shared/lib/date/format-date-time';

import { STRETCHING_SESSION_CONFIG } from '../config/constants';

const toExerciseType = (type: string): ExerciseType => {
  if (type === 'REPS') return 'REPS';
  return 'DURATION';
};

//TODO: 로직 리팩토링 필요

export type UseStretchingSessionResult = {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  isLoading: boolean;
  totalSteps: number;
  currentStepIndex: number;
  currentStep?: ExerciseSessionStep;
  timeRemainingSeconds: number;
  accuracyPercent: number;
  accuracyTone: 'danger' | 'warn' | 'brand';
  timerTone: 'danger' | 'default';
  repsCount: number;
  repsPopupValue: number | null;
  holdSeconds: number;
  stepResults: ReadonlyArray<StretchingStepResult>;
  stepOutcome: StretchingStepResult['status'] | null;
  isCanvasReady: boolean;
  isSessionComplete: boolean;
  isRoutineSuccess: boolean;
  completionResult: CompleteExerciseSessionResponseData | null;
  isCompleting: boolean;
};

export type StretchingSessionDebugOptions = {
  accuracyEngine?: AccuracyEngine;
  onAccuracyDebug?: (payload: { input: AccuracyEvaluateInput; result: AccuracyResult }) => void;
};

export type UseStretchingSessionOptions = {
  debug?: StretchingSessionDebugOptions;
  targetFps?: number;
};

type StretchingStepResult = {
  routineStepId: number;
  stepOrder: number;
  status: 'success' | 'fail';
  accuracy: number;
  startAt: string;
  endAt: string;
};

const clamp = (value: number, min: number, max: number): number => {
  if (!Number.isFinite(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

const normalizeAccuracyPercent = (score: number): number => {
  if (!Number.isFinite(score)) return 0;
  const percent = score <= 1 ? score * 100 : score;
  return clamp(percent, 0, STRETCHING_SESSION_CONFIG.ACCURACY_SCORE_MAX);
};

const getAccuracyTone = (percent: number): 'danger' | 'warn' | 'brand' => {
  if (percent <= STRETCHING_SESSION_CONFIG.ACCURACY_THRESHOLD_LOW) return 'danger';
  if (percent <= STRETCHING_SESSION_CONFIG.ACCURACY_THRESHOLD_MID) return 'warn';
  return 'brand';
};

const getTimerTone = (remainingSeconds: number): 'danger' | 'default' => {
  if (remainingSeconds <= STRETCHING_SESSION_CONFIG.TIMER_WARNING_SECONDS) return 'danger';
  return 'default';
};

const shouldIncrementReps = (status: CountedStatus): boolean => status === 'INCREMENTED';

/**
 * createSession effect 의존성에서 handler 때문에 재생성되는 문제를 방지
 */
function useEvent<T extends (...args: any[]) => any>(handler: T): T {
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  return useCallback(((...args: any[]) => handlerRef.current(...args)) as T, []);
}

export function useStretchingSession(
  sessionId: string | null,
  options?: UseStretchingSessionOptions,
): UseStretchingSessionResult {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sessionRef = useRef<StretchingSession | null>(null);

  const stepStartAtRef = useRef<number | null>(null);
  const holdMsRef = useRef(0); ///hold 시간 누적용
  const lastAccuracyAtRef = useRef<number | null>(null);

  const transitionLockRef = useRef(false);
  const transitionTimeoutRef = useRef<number | null>(null);
  const repsPopupTimeoutRef = useRef<number | null>(null);
  const isCanvasReadyRef = useRef(false);
  const hasLoggedMissingDataRef = useRef(false);
  const hasSubmittedResultRef = useRef(false);

  const currentStepRef = useRef<ExerciseSessionStep | null>(null);
  const referencePoseRef = useRef(currentStepRef.current?.exercise.pose.referencePose ?? null);
  const exerciseTypeRef = useRef<ExerciseType | null>(null);
  const sessionStartedAtRef = useRef<Date | null>(null);
  const sessionEndedAtRef = useRef<Date | null>(null);
  const stepStartedAtRef = useRef<Date | null>(null);

  const totalStepsRef = useRef(0);
  const isSessionCompleteRef = useRef(false);

  //ui state
  //현재 스텝
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  //남은 제한 시간
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(0);
  //정확도 퍼센트(0~100)
  const [accuracyPercent, setAccuracyPercent] = useState(0);
  //반복 횟수(REPS일때)
  const [repsCount, setRepsCount] = useState(0);
  //REPS 팝업 표시용 값
  const [repsPopupValue, setRepsPopupValue] = useState<number | null>(null);
  //유지 시간(초)
  const [holdSeconds, setHoldSeconds] = useState(0);
  //각 스텝의 성공/실패 결과 배열
  const [stepResults, setStepResults] = useState<ReadonlyArray<StretchingStepResult>>([]);
  // 세션 완료 여부
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  // 현재 스텝의 성공/실패 결과
  const [stepOutcome, setStepOutcome] = useState<StretchingStepResult['status'] | null>(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  // 세션 완료 응답 데이터
  const [completionResult, setCompletionResult] =
    useState<CompleteExerciseSessionResponseData | null>(null);

  //마지막 ui 반영 값 refs
  const lastUiAccuracyPercentRef = useRef(0);
  const lastUiHoldSecondsRef = useRef(0);
  const lastUiTimerSecondsRef = useRef<number | null>(null);
  const lastUiAccuracyCommitAtRef = useRef<number>(0);
  const canStopRef = useRef(false);

  const { data, isLoading } = useExerciseSessionQuery(sessionId ?? '', {
    enabled: Boolean(sessionId),
  });
  const { mutate: completeSession, isPending: isCompleting } = useCompleteExerciseSessionMutation({
    sessionId: sessionId ?? '',
    onSuccess: (payload) => {
      setCompletionResult(payload);
    },
  });

  const steps = data?.routineSteps ?? [];
  const totalSteps = steps.length;
  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    totalStepsRef.current = totalSteps;
  }, [totalSteps]);

  const exerciseType = useMemo(() => {
    if (!currentStep) return null;
    return toExerciseType(currentStep.exercise.type);
  }, [currentStep]);

  const initialReferencePose = useMemo(() => steps[0]?.exercise.pose.referencePose, [steps]);
  const initialExerciseType = useMemo(() => {
    if (!steps[0]) return 'DURATION';
    return toExerciseType(steps[0].exercise.type);
  }, [steps]);

  // const isInitialDataReady = Boolean(initialReferencePose && initialExerciseType && totalSteps > 0);
  const isInitialDataReady = true;

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    if (isInitialDataReady) {
      hasLoggedMissingDataRef.current = false;
      return;
    }
    if (hasLoggedMissingDataRef.current) return;

    console.debug('[stretching-session] waiting_for_initial_data', {
      hasReferencePose: Boolean(initialReferencePose),
      hasExerciseType: Boolean(initialExerciseType),
      totalSteps,
    });
    hasLoggedMissingDataRef.current = true;
  }, [initialReferencePose, initialExerciseType, isInitialDataReady, totalSteps]);

  // TODO 정책 확정 전: identity 고정 함수로 둠
  const getProgressRatio = useCallback(() => STRETCHING_SESSION_CONFIG.DEFAULT_PROGRESS_RATIO, []);
  const getPhase = useCallback(() => STRETCHING_SESSION_CONFIG.DEFAULT_PHASE, []);

  const completeStepImpl = useCallback((status: StretchingStepResult['status']) => {
    const step = currentStepRef.current;
    if (!step) return;
    if (transitionLockRef.current) return;
    if (isSessionCompleteRef.current) return;

    transitionLockRef.current = true;
    setStepOutcome(status);
    const stepStartAt = stepStartedAtRef.current ?? new Date();
    const stepEndAt = new Date();
    const accuracy = normalizeAccuracyPercent(lastUiAccuracyPercentRef.current);

    setStepResults((prev) => {
      const nextItem: StretchingStepResult = {
        routineStepId: step.routineStepId,
        stepOrder: step.stepOrder,
        status,
        accuracy: Math.round(accuracy),
        startAt: formatDateTime(stepStartAt),
        endAt: formatDateTime(stepEndAt),
      };
      const existingIndex = prev.findIndex((result) => result.routineStepId === step.routineStepId);
      if (existingIndex < 0) {
        return [...prev, nextItem];
      }
      const next = [...prev];
      next[existingIndex] = nextItem;
      return next;
    });

    if (transitionTimeoutRef.current) window.clearTimeout(transitionTimeoutRef.current);

    transitionTimeoutRef.current = window.setTimeout(() => {
      setStepOutcome(null);

      setCurrentStepIndex((prev) => {
        const nextIndex = prev + 1;
        const total = totalStepsRef.current;

        if (nextIndex >= total) {
          sessionEndedAtRef.current = stepEndAt;
          setIsSessionComplete(true);
          return prev; // 마지막 step 유지
        }
        return nextIndex;
      });

      transitionLockRef.current = false;
    }, STRETCHING_SESSION_CONFIG.STEP_TRANSITION_DELAY_MS);
  }, []);

  const completeStep = useEvent(completeStepImpl);

  const handleAccuracyImpl = useCallback(
    (result: AccuracyResult, frame: PoseFrame) => {
      if (isSessionCompleteRef.current) return;
      if (!isCanvasReadyRef.current) return;

      const step = currentStepRef.current;
      const type = exerciseTypeRef.current;
      if (!step || !type) return;

      const percent = normalizeAccuracyPercent(result.score);

      // 1% 이상 변했거나 마지막 반영 후 일정 시간 경과 시에만 set
      const now = performance.now();
      const prevUiPercent = lastUiAccuracyPercentRef.current;
      const shouldCommitAccuracy =
        Math.abs(percent - prevUiPercent) >= 1 || now - lastUiAccuracyCommitAtRef.current >= 120; // ~8fps로만 UI 반영

      if (shouldCommitAccuracy) {
        lastUiAccuracyPercentRef.current = percent;
        lastUiAccuracyCommitAtRef.current = now;
        setAccuracyPercent(percent);
      }

      if (type === 'REPS') {
        if (!shouldIncrementReps(result.counted)) return;

        setRepsCount((prev) => {
          const next = prev + 1;

          setRepsPopupValue(next);
          if (repsPopupTimeoutRef.current) window.clearTimeout(repsPopupTimeoutRef.current);
          repsPopupTimeoutRef.current = window.setTimeout(() => {
            setRepsPopupValue(null);
          }, STRETCHING_SESSION_CONFIG.REPS_POPUP_MS);

          const target = step.targetReps ?? 0;
          if (target > 0 && next >= target) {
            completeStep('success');
          }
          return next;
        });
        return;
      }

      //DURATION 로직
      if (percent < STRETCHING_SESSION_CONFIG.SUCCESS_ACCURACY_THRESHOLD) {
        holdMsRef.current = 0;

        //초 단위가 바뀔 때만 set
        if (lastUiHoldSecondsRef.current !== 0) {
          lastUiHoldSecondsRef.current = 0;
          setHoldSeconds(0);
        }

        lastAccuracyAtRef.current = frame.timestampMs;
        return;
      }

      const lastAt = lastAccuracyAtRef.current ?? frame.timestampMs;
      const deltaMs = Math.max(0, frame.timestampMs - lastAt);
      lastAccuracyAtRef.current = frame.timestampMs;

      holdMsRef.current += deltaMs;

      const nextHoldSeconds = Math.floor(holdMsRef.current / 1000);
      if (nextHoldSeconds !== lastUiHoldSecondsRef.current) {
        lastUiHoldSecondsRef.current = nextHoldSeconds;
        setHoldSeconds(nextHoldSeconds);
      }

      const requiredHoldMs = (step.durationTime ?? 0) * 1000;
      if (requiredHoldMs > 0 && holdMsRef.current >= requiredHoldMs) {
        completeStep('success');
      }
    },
    [completeStep],
  );

  const handleAccuracy = useEvent(handleAccuracyImpl);

  //세션/steps 바뀔 때 초기화
  useEffect(() => {
    setCurrentStepIndex(0);
    setStepResults([]);
    setIsSessionComplete(false);
    setIsCanvasReady(false);
    isCanvasReadyRef.current = false;
    canStopRef.current = false;

    hasSubmittedResultRef.current = false;
    sessionStartedAtRef.current = null;
    sessionEndedAtRef.current = null;
    stepStartedAtRef.current = null;
    setCompletionResult(null);

    //ui cache refs도 초기화
    lastUiAccuracyPercentRef.current = 0;
    lastUiHoldSecondsRef.current = 0;
    lastUiTimerSecondsRef.current = null;
    lastUiAccuracyCommitAtRef.current = 0;
  }, [sessionId, steps.length]);

  //step/exerciseType refs 최신화
  useEffect(() => {
    currentStepRef.current = currentStep ?? null;
    referencePoseRef.current = currentStep?.exercise.pose.referencePose ?? null;
    exerciseTypeRef.current = exerciseType;
  }, [currentStep, exerciseType]);

  //step 진입 시 초기 상태 세팅
  useEffect(() => {
    if (!currentStep) return;

    stepStartAtRef.current = null;
    stepStartedAtRef.current = null;
    lastAccuracyAtRef.current = null;
    holdMsRef.current = 0;

    lastUiHoldSecondsRef.current = 0;
    lastUiAccuracyPercentRef.current = 0;
    lastUiTimerSecondsRef.current = null;
    lastUiAccuracyCommitAtRef.current = 0;

    setHoldSeconds(0);
    setRepsCount(0);
    setAccuracyPercent(0);
    setTimeRemainingSeconds(currentStep.limitTime ?? 0);
    setStepOutcome(null);
    setRepsPopupValue(null);

    if (transitionTimeoutRef.current) window.clearTimeout(transitionTimeoutRef.current);
  }, [currentStep?.routineStepId]);

  //타이머
  useEffect(() => {
    if (!currentStep) return;
    if (!isCanvasReady) return;
    if (stepOutcome) return;

    if (!stepStartAtRef.current) {
      stepStartAtRef.current = Date.now();
      stepStartedAtRef.current = new Date();
      if (!sessionStartedAtRef.current) {
        sessionStartedAtRef.current = stepStartedAtRef.current;
      }
    }

    const limitTime = currentStep.limitTime ?? 0;

    const tick = () => {
      const startedAt = stepStartAtRef.current;
      if (!startedAt) return;

      const elapsedSeconds = (Date.now() - startedAt) / 1000;
      const remaining = Math.max(0, limitTime - elapsedSeconds);
      const remainingInt = Math.ceil(remaining);

      if (lastUiTimerSecondsRef.current !== remainingInt) {
        lastUiTimerSecondsRef.current = remainingInt;
        // setTimeRemainingSeconds(remainingInt);
      }
    };

    tick();
    const intervalId = window.setInterval(tick, STRETCHING_SESSION_CONFIG.TIMER_TICK_MS);
    return () => window.clearInterval(intervalId);
  }, [currentStep?.routineStepId, isCanvasReady, stepOutcome]);

  //시간 만료 처리
  useEffect(() => {
    if (!currentStep) return;
    if (stepOutcome) return;
    if (isSessionComplete) return;
    if (timeRemainingSeconds > 0) return;

    completeStep('fail');
  }, [completeStep, currentStep, isSessionComplete, stepOutcome, timeRemainingSeconds]);

  //createSession- 콜백 identity로 인한 재생성 방지
  useEffect(() => {
    if (!videoRef.current) return;
    if (!canvasRef.current) return;
    if (!isInitialDataReady) return;

    isCanvasReadyRef.current = false;
    setIsCanvasReady(false);

    const targetFps = options?.targetFps ?? STRETCHING_SESSION_CONFIG.TARGET_FPS;
    const frameIntervalMs =
      targetFps > 0 ? Math.round(STRETCHING_SESSION_CONFIG.MILLISECONDS_PER_SECOND / targetFps) : 0;

    const session: StretchingSession = createSession({
      video: videoRef.current,
      canvas: canvasRef.current,
      modelAssetPath: STRETCHING_SESSION_CONFIG.MODEL_ASSET_PATH,
      wasmRoot: STRETCHING_SESSION_CONFIG.WASM_ROOT,
      frameIntervalMs,

      referencePose: initialReferencePose!,
      getReferencePose: () => referencePoseRef.current ?? initialReferencePose!,

      getProgressRatio,
      exerciseType: initialExerciseType,
      getExerciseType: () => exerciseTypeRef.current ?? initialExerciseType,

      getPhase,
      accuracyEngine: options?.debug?.accuracyEngine,
      onAccuracyDebug: options?.debug?.onAccuracyDebug,
      onTick: ({ videoWidth, videoHeight }: { videoWidth: number; videoHeight: number }) => {
        if (isCanvasReadyRef.current) return;
        if (videoWidth === 0 || videoHeight === 0) return;
        isCanvasReadyRef.current = true;
        if (!sessionStartedAtRef.current) {
          sessionStartedAtRef.current = new Date();
        }
        canStopRef.current = true;
        setIsCanvasReady(true);
      },
      onLog: ({ type, detail }) => {
        if (process.env.NODE_ENV === 'production') return;
        const payload = detail ?? {};

        console.debug(`[stretching-session] ${type}`, payload);
      },
      onAccuracy: handleAccuracy,

      visualization: {
        mode: STRETCHING_SESSION_CONFIG.VISUALIZATION_MODE,
        silhouette: {
          foregroundColor: STRETCHING_SESSION_CONFIG.SILHOUETTE_FOREGROUND_RGBA,
          backgroundColor: STRETCHING_SESSION_CONFIG.SILHOUETTE_BACKGROUND_RGBA,
          visibilityMin: STRETCHING_SESSION_CONFIG.SILHOUETTE_VISIBILITY_MIN,
          smoothingAlpha: STRETCHING_SESSION_CONFIG.SILHOUETTE_SMOOTHING_ALPHA,
          headRadiusRatio: STRETCHING_SESSION_CONFIG.SILHOUETTE_HEAD_RADIUS_RATIO,
          strokeWidthRatio: STRETCHING_SESSION_CONFIG.SILHOUETTE_STROKE_WIDTH_RATIO,
        },
      },
    });

    sessionRef.current = session;
    void session.start().then(() => {});

    return () => {
      session.destroy();
      sessionRef.current = null;
      isCanvasReadyRef.current = false;
      setIsCanvasReady(false);
      canStopRef.current = false;
    };
  }, [
    getPhase,
    getProgressRatio,
    handleAccuracy,
    isInitialDataReady,
    options?.debug?.accuracyEngine,
    options?.debug?.onAccuracyDebug,
    options?.targetFps,
  ]);

  //complete 시 stop
  useEffect(() => {
    if (!isSessionComplete) return;
    if (totalSteps === 0) return;
    if (stepResults.length === 0) return;
    if (!canStopRef.current) return;
    const session = sessionRef.current;
    if (!session) return;
    void session.stop();
  }, [isCanvasReady, isSessionComplete, stepResults.length, totalSteps]);

  //세션 종료 여부
  useEffect(() => {
    if (!isSessionComplete) return;
    if (!sessionId) return;
    if (hasSubmittedResultRef.current) return;
    if (totalStepsRef.current === 0) return;
    if (stepResults.length < totalStepsRef.current) return;

    const startedAt = sessionStartedAtRef.current ?? new Date();
    const endedAt = sessionEndedAtRef.current ?? new Date();

    hasSubmittedResultRef.current = true;

    completeSession({
      startAt: formatDateTime(startedAt),
      endAt: formatDateTime(endedAt),
      exerciseResult: stepResults.map((result) => ({
        routineStepId: result.routineStepId,
        status: result.status === 'success' ? 'COMPLETED' : 'FAILED',
        accuracy: result.accuracy,
        startAt: result.startAt,
        endAt: result.endAt,
        pose_record: [],
      })),
    });
  }, [completeSession, isSessionComplete, sessionId, stepResults]);

  //ref 최신화
  useEffect(() => {
    isSessionCompleteRef.current = isSessionComplete;
  }, [isSessionComplete]);

  //cleanup
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) window.clearTimeout(transitionTimeoutRef.current);
      if (repsPopupTimeoutRef.current) window.clearTimeout(repsPopupTimeoutRef.current);
    };
  }, []);

  const accuracyTone = useMemo(() => getAccuracyTone(accuracyPercent), [accuracyPercent]);
  const timerTone = useMemo(() => getTimerTone(timeRemainingSeconds), [timeRemainingSeconds]);

  const isRoutineSuccess = useMemo(
    () => stepResults.some((result) => result.status === 'success'),
    [stepResults],
  );

  //디버깅용 콘솔
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    console.log('[stretching-session] state', {
      sessionId,
      currentStepIndex,
      currentStep,
      totalSteps,
      timeRemainingSeconds,
      accuracyPercent,
      accuracyTone,
      timerTone,
      repsCount,
      repsPopupValue,
      holdSeconds,
      stepResults,
      stepOutcome,
      isCanvasReady,
      isSessionComplete,
      isRoutineSuccess,
    });
  }, [
    accuracyPercent,
    accuracyTone,
    currentStep,
    currentStepIndex,
    holdSeconds,
    isCanvasReady,
    isRoutineSuccess,
    isSessionComplete,
    repsCount,
    repsPopupValue,
    sessionId,
    stepOutcome,
    stepResults,
    timeRemainingSeconds,
    timerTone,
    totalSteps,
  ]);

  return {
    videoRef,
    canvasRef,
    isLoading,
    totalSteps,
    currentStepIndex,
    currentStep,
    timeRemainingSeconds,
    accuracyPercent,
    accuracyTone,
    timerTone,
    repsCount,
    repsPopupValue,
    holdSeconds,
    stepResults,
    stepOutcome,
    isCanvasReady,
    isSessionComplete,
    isRoutineSuccess,
    completionResult,
    isCompleting,
  };
}
