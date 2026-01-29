import type { AccuracyResult, ExerciseType } from '@repo/stretching-accuracy';
import { createSession, type StretchingSession } from '@repo/stretching-session';
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { Chip } from '@repo/ui/chip';
import { Input } from '@repo/ui/input';
import { useEffect, useMemo, useRef, useState } from 'react';

import { STRETCHING_SESSION_CONFIG } from '@/src/features/stretching-session/config/constants';
import { formatDateTime } from '@/src/shared/lib/date/format-date-time';

import {
  COUNTED_STATUS_LABELS,
  DEBUG_STRETCH_ACCURACY_CONFIG,
  DEFAULT_REFERENCE_POSE_JSON,
  EXERCISE_TYPE_OPTIONS,
} from '../config/constants';
import { DEBUG_STRETCH_ACCURACY_MESSAGES } from '../config/messages';
import { parseReferencePoseJson } from '../lib/parse-reference-pose';

type DebugMetrics = {
  accuracyPercent: number;
  countedLabel: string;
  phase: string;
  progressRatio: number;
  hasPose: boolean;
  measuredFps: number;
  lastUpdateAt: string | null;
};

const formatPercent = (value: number): number => {
  if (!Number.isFinite(value)) return 0;
  if (value <= 1) return value * 100;
  return value;
};

const clamp = (value: number, min: number, max: number): number => {
  if (!Number.isFinite(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

const normalizeAccuracyPercent = (value: number): number => {
  const percent = formatPercent(value);
  return clamp(percent, 0, STRETCHING_SESSION_CONFIG.ACCURACY_SCORE_MAX);
};

export function DebugStretchAccuracyPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sessionRef = useRef<StretchingSession | null>(null);
  const progressRatioRef = useRef(STRETCHING_SESSION_CONFIG.DEFAULT_PROGRESS_RATIO);
  const phaseRef = useRef(STRETCHING_SESSION_CONFIG.DEFAULT_PHASE);
  const fpsMeterRef = useRef({ lastMeasureAt: 0, frameCount: 0 });

  const [referencePoseText, setReferencePoseText] = useState(DEFAULT_REFERENCE_POSE_JSON);
  const [exerciseType, setExerciseType] = useState<ExerciseType>('DURATION');
  const [targetFps, setTargetFps] = useState(String(DEBUG_STRETCH_ACCURACY_CONFIG.DEFAULT_FPS));
  const [isRunning, setIsRunning] = useState(false);
  const [referencePoseError, setReferencePoseError] = useState<string | null>(null);
  const [fpsError, setFpsError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<DebugMetrics>({
    accuracyPercent: 0,
    countedLabel: COUNTED_STATUS_LABELS.NOT_APPLICABLE,
    phase: STRETCHING_SESSION_CONFIG.DEFAULT_PHASE,
    progressRatio: STRETCHING_SESSION_CONFIG.DEFAULT_PROGRESS_RATIO,
    hasPose: false,
    measuredFps: 0,
    lastUpdateAt: null,
  });

  const targetFpsNumber = useMemo(() => Number(targetFps), [targetFps]);

  const resetMetrics = () => {
    progressRatioRef.current = STRETCHING_SESSION_CONFIG.DEFAULT_PROGRESS_RATIO;
    phaseRef.current = STRETCHING_SESSION_CONFIG.DEFAULT_PHASE;
    fpsMeterRef.current = { lastMeasureAt: 0, frameCount: 0 };
    setMetrics((prev) => ({
      ...prev,
      accuracyPercent: 0,
      countedLabel: COUNTED_STATUS_LABELS.NOT_APPLICABLE,
      phase: STRETCHING_SESSION_CONFIG.DEFAULT_PHASE,
      progressRatio: STRETCHING_SESSION_CONFIG.DEFAULT_PROGRESS_RATIO,
      hasPose: false,
      measuredFps: 0,
      lastUpdateAt: null,
    }));
  };

  const handleStart = () => {
    const parsedPose = parseReferencePoseJson(referencePoseText);
    if (!parsedPose.ok) {
      setReferencePoseError(
        parsedPose.error === 'INVALID_JSON'
          ? DEBUG_STRETCH_ACCURACY_MESSAGES.FORM.ERROR_INVALID_JSON
          : DEBUG_STRETCH_ACCURACY_MESSAGES.FORM.ERROR_INVALID_REFERENCE_POSE,
      );
      return;
    }

    if (!Number.isFinite(targetFpsNumber)) {
      setFpsError(DEBUG_STRETCH_ACCURACY_MESSAGES.FORM.ERROR_INVALID_FPS);
      return;
    }

    if (targetFpsNumber < DEBUG_STRETCH_ACCURACY_CONFIG.FPS_MIN) {
      setFpsError(DEBUG_STRETCH_ACCURACY_MESSAGES.FORM.ERROR_INVALID_FPS);
      return;
    }

    if (targetFpsNumber > DEBUG_STRETCH_ACCURACY_CONFIG.FPS_MAX) {
      setFpsError(DEBUG_STRETCH_ACCURACY_MESSAGES.FORM.ERROR_INVALID_FPS);
      return;
    }

    setReferencePoseError(null);
    setFpsError(null);
    resetMetrics();
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setReferencePoseText(DEFAULT_REFERENCE_POSE_JSON);
    setReferencePoseError(null);
    setFpsError(null);
    resetMetrics();
  };

  useEffect(() => {
    if (!isRunning) return;
    if (!videoRef.current || !canvasRef.current) return;

    const parsedPose = parseReferencePoseJson(referencePoseText);
    if (!parsedPose.ok) {
      setReferencePoseError(
        parsedPose.error === 'INVALID_JSON'
          ? DEBUG_STRETCH_ACCURACY_MESSAGES.FORM.ERROR_INVALID_JSON
          : DEBUG_STRETCH_ACCURACY_MESSAGES.FORM.ERROR_INVALID_REFERENCE_POSE,
      );
      setIsRunning(false);
      return;
    }

    const frameIntervalMs =
      targetFpsNumber > 0
        ? Math.round(STRETCHING_SESSION_CONFIG.MILLISECONDS_PER_SECOND / targetFpsNumber)
        : 0;

    const session = createSession({
      video: videoRef.current,
      canvas: canvasRef.current,
      modelAssetPath: STRETCHING_SESSION_CONFIG.MODEL_ASSET_PATH,
      wasmRoot: STRETCHING_SESSION_CONFIG.WASM_ROOT,
      frameIntervalMs,
      referencePose: parsedPose.value,
      getReferencePose: () => parsedPose.value,
      exerciseType,
      getExerciseType: () => exerciseType,
      getProgressRatio: () => progressRatioRef.current,
      getPhase: () => phaseRef.current,
      visualization: {
        mode: STRETCHING_SESSION_CONFIG.VISUALIZATION_MODE,
        keypoints: {
          lineColor: STRETCHING_SESSION_CONFIG.KEYPOINTS_LINE_COLOR,
          lineWidth: STRETCHING_SESSION_CONFIG.KEYPOINTS_LINE_WIDTH,
          pointColor: STRETCHING_SESSION_CONFIG.KEYPOINTS_POINT_COLOR,
          pointRadius: STRETCHING_SESSION_CONFIG.KEYPOINTS_POINT_RADIUS,
          backgroundColor: STRETCHING_SESSION_CONFIG.KEYPOINTS_BACKGROUND_COLOR,
          visibilityThreshold: STRETCHING_SESSION_CONFIG.KEYPOINTS_VISIBILITY_THRESHOLD,
          showPoints: STRETCHING_SESSION_CONFIG.KEYPOINTS_SHOW_POINTS,
        },
      },
      onAccuracy: (result: AccuracyResult) => {
        progressRatioRef.current = result.progressRatio;
        phaseRef.current = result.phase;

        setMetrics((prev) => ({
          ...prev,
          accuracyPercent: normalizeAccuracyPercent(result.score),
          countedLabel: COUNTED_STATUS_LABELS[result.counted],
          phase: result.phase,
          progressRatio: result.progressRatio,
          lastUpdateAt: formatDateTime(new Date()),
        }));
      },
      onTick: ({ hasPose }) => {
        const now = performance.now();
        const meter = fpsMeterRef.current;
        const lastMeasureAt = meter.lastMeasureAt || now;
        const elapsed = now - lastMeasureAt;

        meter.frameCount += 1;

        if (elapsed >= STRETCHING_SESSION_CONFIG.MILLISECONDS_PER_SECOND) {
          const fps = Math.round((meter.frameCount / elapsed) * 1000);
          fpsMeterRef.current = { lastMeasureAt: now, frameCount: 0 };

          setMetrics((prev) => ({
            ...prev,
            measuredFps: fps,
            hasPose,
          }));
          return;
        }

        setMetrics((prev) => ({
          ...prev,
          hasPose,
        }));
      },
      onError: (error) => {
        setReferencePoseError(error.message);
        setIsRunning(false);
      },
    });

    sessionRef.current = session;
    void session.start();

    return () => {
      session.destroy();
      sessionRef.current = null;
    };
  }, [exerciseType, isRunning, referencePoseText, targetFpsNumber]);

  return (
    <div className="bg-bg min-h-screen px-6 py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-text text-2xl font-semibold">
              {DEBUG_STRETCH_ACCURACY_MESSAGES.TITLE}
            </h1>
            <p className="text-text-muted text-sm">{DEBUG_STRETCH_ACCURACY_MESSAGES.DESCRIPTION}</p>
          </div>
          <Chip
            label={
              isRunning
                ? DEBUG_STRETCH_ACCURACY_MESSAGES.STATUS.RUNNING
                : DEBUG_STRETCH_ACCURACY_MESSAGES.STATUS.IDLE
            }
            size="sm"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <Card padding="lg" variant="elevated" className="flex flex-col gap-4">
            <div className="text-text text-sm font-semibold">
              {DEBUG_STRETCH_ACCURACY_MESSAGES.FORM.SECTION_TITLE}
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-text-muted text-xs">
                {DEBUG_STRETCH_ACCURACY_MESSAGES.FORM.REFERENCE_POSE_LABEL}
              </span>
              <textarea
                className="border-border bg-surface text-text focus-visible:ring-focus-ring min-h-60 w-full resize-y rounded-lg border px-3 py-2 text-xs focus-visible:ring-2 focus-visible:outline-none"
                value={referencePoseText}
                onChange={(event) => {
                  setReferencePoseText(event.target.value);
                }}
              />
              {referencePoseError && (
                <span className="text-error-600 text-xs">{referencePoseError}</span>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <span className="text-text-muted text-xs">
                  {DEBUG_STRETCH_ACCURACY_MESSAGES.FORM.EXERCISE_TYPE_LABEL}
                </span>
                <select
                  className="border-border bg-surface text-text focus-visible:ring-focus-ring h-10 rounded-lg border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
                  value={exerciseType}
                  onChange={(event) => {
                    setExerciseType(event.target.value as ExerciseType);
                  }}
                >
                  {EXERCISE_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <Input.Root error={Boolean(fpsError)}>
                <Input.Label>{DEBUG_STRETCH_ACCURACY_MESSAGES.FORM.FPS_LABEL}</Input.Label>
                <Input.Control>
                  <Input.Field
                    value={targetFps}
                    type="number"
                    min={DEBUG_STRETCH_ACCURACY_CONFIG.FPS_MIN}
                    max={DEBUG_STRETCH_ACCURACY_CONFIG.FPS_MAX}
                    onChange={(event) => {
                      setTargetFps(event.target.value);
                    }}
                  />
                </Input.Control>
                <Input.HelperText type={fpsError ? 'error' : 'default'}>
                  {fpsError ?? DEBUG_STRETCH_ACCURACY_MESSAGES.FORM.FPS_HELPER}
                </Input.HelperText>
              </Input.Root>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="primary" onClick={handleStart} disabled={isRunning}>
                {DEBUG_STRETCH_ACCURACY_MESSAGES.FORM.START}
              </Button>
              <Button variant="secondary" onClick={handleStop} disabled={!isRunning}>
                {DEBUG_STRETCH_ACCURACY_MESSAGES.FORM.STOP}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                {DEBUG_STRETCH_ACCURACY_MESSAGES.FORM.RESET}
              </Button>
            </div>
          </Card>

          <div className="flex flex-col gap-6">
            <Card padding="lg" variant="elevated" className="flex flex-col gap-4">
              <div className="text-text text-sm font-semibold">
                {DEBUG_STRETCH_ACCURACY_MESSAGES.METRICS.SECTION_TITLE}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-text-muted">
                  {DEBUG_STRETCH_ACCURACY_MESSAGES.METRICS.ACCURACY}
                </div>
                <div className="text-text font-semibold">
                  {Math.round(metrics.accuracyPercent)}%
                </div>

                <div className="text-text-muted">
                  {DEBUG_STRETCH_ACCURACY_MESSAGES.METRICS.COUNTED}
                </div>
                <div className="text-text font-semibold">{metrics.countedLabel}</div>

                <div className="text-text-muted">
                  {DEBUG_STRETCH_ACCURACY_MESSAGES.METRICS.PHASE}
                </div>
                <div className="text-text font-semibold">{metrics.phase}</div>

                <div className="text-text-muted">
                  {DEBUG_STRETCH_ACCURACY_MESSAGES.METRICS.PROGRESS_RATIO}
                </div>
                <div className="text-text font-semibold">{metrics.progressRatio.toFixed(3)}</div>

                <div className="text-text-muted">
                  {DEBUG_STRETCH_ACCURACY_MESSAGES.METRICS.HAS_POSE}
                </div>
                <div className="text-text font-semibold">
                  {metrics.hasPose
                    ? DEBUG_STRETCH_ACCURACY_MESSAGES.METRICS.HAS_POSE_ON
                    : DEBUG_STRETCH_ACCURACY_MESSAGES.METRICS.HAS_POSE_OFF}
                </div>

                <div className="text-text-muted">{DEBUG_STRETCH_ACCURACY_MESSAGES.METRICS.FPS}</div>
                <div className="text-text font-semibold">{metrics.measuredFps}</div>

                <div className="text-text-muted">
                  {DEBUG_STRETCH_ACCURACY_MESSAGES.METRICS.LAST_UPDATE}
                </div>
                <div className="text-text font-semibold">
                  {metrics.lastUpdateAt ??
                    DEBUG_STRETCH_ACCURACY_MESSAGES.METRICS.LAST_UPDATE_EMPTY}
                </div>
              </div>
            </Card>

            <Card padding="lg" variant="elevated" className="flex flex-col gap-3">
              <div className="text-text text-sm font-semibold">
                {DEBUG_STRETCH_ACCURACY_MESSAGES.PREVIEW.SECTION_TITLE}
              </div>
              <div className="border-border bg-surface relative aspect-video w-full overflow-hidden rounded-xl border">
                <video
                  ref={videoRef}
                  className="absolute inset-0 h-full w-full opacity-0"
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
                {!isRunning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-text-muted text-xs">
                      {DEBUG_STRETCH_ACCURACY_MESSAGES.PREVIEW.VIDEO_LOADING}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
