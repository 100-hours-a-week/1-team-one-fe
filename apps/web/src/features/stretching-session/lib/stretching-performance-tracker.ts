import * as Sentry from '@sentry/nextjs';

import { StretchingPerformanceConfig } from '../config/performance';

//스트레칭 세션 성능 = 세션 시작~카메라/포즈 준비 까지를 스팬으로 측정
type StretchingLogEvent = {
  type: string;
  detail?: Readonly<Record<string, unknown>>;
};

type StretchingTickPayload = {
  timestampMs: number;
  hasPose: boolean;
  videoWidth: number;
  videoHeight: number;
};

type NavigatorConnection = Navigator & {
  connection?: {
    effectiveType?: string;
  };
};

type StretchingPerformanceTracker = {
  setSessionId: (sessionId: string | null) => void;
  onLog: (event: StretchingLogEvent) => void;
  onTick: (payload: StretchingTickPayload) => void;
  onError: (error: Error) => void;
  reset: () => void;
};

type PerformanceMarks = {
  sessionStartAt: number | null;
  landmarkerInitStartAt: number | null;
  rendererInitStartAt: number | null;
  cameraReadyAt: number | null;
  poseReadyAt: number | null;
};

const createMarks = (): PerformanceMarks => ({
  sessionStartAt: null,
  landmarkerInitStartAt: null,
  rendererInitStartAt: null,
  cameraReadyAt: null,
  poseReadyAt: null,
});

const getNow = (): number => performance.now();

export function createStretchingPerformanceTracker(): StretchingPerformanceTracker {
  let marks = createMarks();
  let sessionId: string | null = null;
  let hasRecordedCameraReady = false;
  let hasRecordedPoseReady = false;
  let span: ReturnType<typeof Sentry.startInactiveSpan> | null = null;

  //세션 측정 스팬 생성 기본 속성 설정
  const ensureSpan = (): void => {
    if (span) return;
    span = Sentry.startInactiveSpan({
      name: StretchingPerformanceConfig.SpanNames.SessionInit,
      op: StretchingPerformanceConfig.SpanOps.SessionInit,
    });

    if (sessionId) {
      span.setAttribute(StretchingPerformanceConfig.AttributeNames.SessionId, sessionId);
    }

    if (typeof navigator !== 'undefined') {
      const connection = (navigator as NavigatorConnection).connection;
      const effectiveType = connection?.effectiveType;
      if (effectiveType) {
        span.setAttribute(
          StretchingPerformanceConfig.AttributeNames.NetworkEffectiveType,
          effectiveType,
        );
      }
    }
  };

  //측정값을 스팬 속성으로 기록
  const recordDuration = (key: string, startAt: number | null, endAt: number): void => {
    if (!span) return;
    if (startAt === null) return;
    const durationMs = Math.max(0, endAt - startAt);
    span.setAttribute(key, durationMs);
  };

  const endSpan = (): void => {
    if (!span) return;
    span.end();
    span = null;
  };

  const handleSessionStart = (): void => {
    marks.sessionStartAt = getNow();
    ensureSpan();
  };

  const handleLandmarkerInitStart = (): void => {
    marks.landmarkerInitStartAt = getNow();
  };

  const handleLandmarkerInitSuccess = (): void => {
    const endAt = getNow();
    recordDuration(
      StretchingPerformanceConfig.MeasurementNames.LandmarkerInit,
      marks.landmarkerInitStartAt,
      endAt,
    );
  };

  const handleRendererInitStart = (): void => {
    marks.rendererInitStartAt = getNow();
  };

  const handleRendererInitSuccess = (): void => {
    const endAt = getNow();
    recordDuration(
      StretchingPerformanceConfig.MeasurementNames.RendererInit,
      marks.rendererInitStartAt,
      endAt,
    );
  };

  const handleVideoPlayStarted = (): void => {
    const endAt = getNow();
    recordDuration(
      StretchingPerformanceConfig.MeasurementNames.SessionToVideoPlay,
      marks.sessionStartAt,
      endAt,
    );
  };

  const onLog = (event: StretchingLogEvent): void => {
    const handlers: Record<string, () => void> = {
      session_start: handleSessionStart,
      landmarker_init_start: handleLandmarkerInitStart,
      landmarker_init_success: handleLandmarkerInitSuccess,
      renderer_init_start: handleRendererInitStart,
      renderer_init_success: handleRendererInitSuccess,
      video_play_started: handleVideoPlayStarted,
    };

    const handler = handlers[event.type];
    if (!handler) return;
    handler();
  };

  //최초 카메라 준비,포즈 인식 시점만 기록
  const onTick = (payload: StretchingTickPayload): void => {
    if (!marks.sessionStartAt) return;

    if (!hasRecordedCameraReady && payload.videoWidth > 0 && payload.videoHeight > 0) {
      hasRecordedCameraReady = true;
      marks.cameraReadyAt = payload.timestampMs;
      recordDuration(
        StretchingPerformanceConfig.MeasurementNames.SessionToCameraReady,
        marks.sessionStartAt,
        payload.timestampMs,
      );
    }

    if (hasRecordedPoseReady) return;
    if (!payload.hasPose) return;
    if (!marks.cameraReadyAt) return;

    hasRecordedPoseReady = true;
    marks.poseReadyAt = payload.timestampMs;
    recordDuration(
      StretchingPerformanceConfig.MeasurementNames.SessionToPoseReady,
      marks.sessionStartAt,
      payload.timestampMs,
    );
    recordDuration(
      StretchingPerformanceConfig.MeasurementNames.CameraToPoseReady,
      marks.cameraReadyAt,
      payload.timestampMs,
    );
    endSpan();
  };

  const onError = (error: Error): void => {
    ensureSpan();
    span?.setAttribute(StretchingPerformanceConfig.AttributeNames.SessionError, error.message);
    endSpan();
  };

  const reset = (): void => {
    endSpan();
    marks = createMarks();
    hasRecordedCameraReady = false;
    hasRecordedPoseReady = false;
  };

  const setSessionId = (nextSessionId: string | null): void => {
    sessionId = nextSessionId;
    if (!span) return;
    if (!sessionId) return;
    span.setAttribute(StretchingPerformanceConfig.AttributeNames.SessionId, sessionId);
  };

  return { setSessionId, onLog, onTick, onError, reset };
}
