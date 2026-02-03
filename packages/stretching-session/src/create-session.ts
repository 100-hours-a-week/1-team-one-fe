import {
  createAccuracyEngine,
  type AccuracyEngine,
  type AccuracyEvaluateInput,
  type AccuracyResult,
  type ExerciseType,
  type PoseFrame,
  type ReferencePose,
  type Landmark2D,
} from '@repo/stretching-accuracy';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import { createRenderer, type RendererConfig, type Renderer } from './renderers';
import { mirrorPoseFrame } from './utils/mirror-pose';

type PoseLandmarkerResultLike = {
  landmarks?: ReadonlyArray<ReadonlyArray<Landmark2D>>;
};

export type CreateSessionOptions = {
  video: HTMLVideoElement;
  canvas: HTMLCanvasElement;
  modelAssetPath: string;
  wasmRoot: string;
  referencePose: ReferencePose;
  getReferencePose?: () => ReferencePose;
  getProgressRatio: () => number;
  getRenderProgressRatio?: () => number;
  exerciseType: ExerciseType;
  getExerciseType?: () => ExerciseType;
  getPhase: () => string;
  getAccuracyEngine?: () => AccuracyEngine;
  mirrorInput?: boolean;
  visualization: RendererConfig;
  onFrame?: (frame: PoseFrame) => void;
  onTick?: (payload: {
    timestampMs: number;
    hasPose: boolean;
    videoWidth: number;
    videoHeight: number;
  }) => void;
  onLog?: (event: { type: string; detail?: Readonly<Record<string, unknown>> }) => void;
  onAccuracyDebug?: (payload: { input: AccuracyEvaluateInput; result: AccuracyResult }) => void;
  onAccuracy?: (result: AccuracyResult, frame: PoseFrame) => void;
  onError?: (error: Error) => void;
  accuracyEngine?: AccuracyEngine;
  videoConstraints?: MediaTrackConstraints;
  frameIntervalMs?: number;
};

export type StretchingSession = {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  destroy: () => void;
};

/**
 * MediaPipe 결과를 PoseFrame으로 변환
 */
const toPoseFrame = (result: PoseLandmarkerResultLike, timestampMs: number): PoseFrame | null => {
  const landmarks = result.landmarks?.[0];
  if (!landmarks || landmarks.length === 0) return null;

  const normalized = landmarks.map((landmark) => ({
    x: landmark.x,
    y: landmark.y,
    z: landmark.z,
    visibility: landmark.visibility,
  }));

  return {
    timestampMs,
    landmarks: normalized,
  };
};

const toError = (error: unknown): Error => {
  if (error instanceof Error) return error;
  return new Error(String(error));
};

export function createSession(options: CreateSessionOptions): StretchingSession {
  const {
    video,
    canvas,
    modelAssetPath,
    wasmRoot,
    referencePose,
    getReferencePose,
    getProgressRatio,
    getRenderProgressRatio,
    exerciseType,
    getExerciseType,
    getPhase,
    visualization,
    onFrame,
    onTick,
    onLog,
    onAccuracyDebug,
    onAccuracy,
    onError,
    accuracyEngine = createAccuracyEngine(),
    getAccuracyEngine,
    mirrorInput = false,
    videoConstraints,
    frameIntervalMs = 0,
  } = options;

  const resolveAccuracyEngine = getAccuracyEngine ?? (() => accuracyEngine);

  // 세션 상태
  let isRunning = false;
  let frameRequestId: number | null = null;
  let mediaStream: MediaStream | null = null;
  let landmarker: (PoseLandmarker & { close?: () => void }) | null = null;
  let renderer: Renderer | null = null;
  let lastFrameLoopAt = 0;
  let lastProcessedFrameAt = 0;
  let isCancelled = false;
  let hasLoggedFrameCallback = false;
  let hasLoggedFrameCallbackWhileStopped = false;
  let frameStartTimeoutId: number | null = null;

  const emitError = (error: unknown): void => {
    if (!onError) return;
    onError(toError(error));
  };

  const emitLog = (type: string, detail?: Readonly<Record<string, unknown>>): void => {
    if (!onLog) return;
    onLog({ type, detail });
  };

  /**
   * mediapipe poselandmarker를 초기화
   */
  const ensureLandmarker = async (): Promise<void> => {
    if (landmarker) return;

    emitLog('landmarker_init_start');
    const fileset = await FilesetResolver.forVisionTasks(wasmRoot);
    landmarker = await PoseLandmarker.createFromOptions(fileset, {
      baseOptions: {
        modelAssetPath,
      },
      runningMode: 'VIDEO',
    });
    emitLog('landmarker_init_success');
  };

  /**
   * 렌더러 초기화
   */
  const ensureRenderer = (): void => {
    if (renderer) return;

    emitLog('renderer_init_start', { mode: visualization.mode });
    renderer = createRenderer(visualization);
    renderer.init({ canvas, video });
    emitLog('renderer_init_success', { mode: visualization.mode });
  };

  /**
   * 웹캠 접근 요청하고 비디오 재생 시작
   */
  const ensureVideoStream = async (): Promise<void> => {
    if (mediaStream) return;
    if (isCancelled) return;

    emitLog('video_stream_request');
    const nextStream = await navigator.mediaDevices.getUserMedia({
      video: videoConstraints ?? true,
      audio: false,
    });

    if (isCancelled) {
      nextStream.getTracks().forEach((track) => track.stop());
      return;
    }

    mediaStream = nextStream;
    video.srcObject = mediaStream;
    try {
      await video.play();
    } catch (error) {
      if (isCancelled) return;
      throw error;
    }

    emitLog('video_play_started', {
      readyState: video.readyState,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
    });
  };

  const scheduleNextFrame = (): void => {
    frameRequestId = requestAnimationFrame(processFrame);
  };

  /**
   * 프레임 처리 메인 루프
   */
  const processFrame = (): void => {
    if (!isRunning) {
      if (!hasLoggedFrameCallbackWhileStopped) {
        hasLoggedFrameCallbackWhileStopped = true;
        emitLog('frame_loop_callback_while_stopped');
      }
      return;
    }

    if (!hasLoggedFrameCallback) {
      hasLoggedFrameCallback = true;
      emitLog('frame_loop_callback');
    }

    const loopNow = performance.now();
    lastFrameLoopAt = loopNow;

    try {
      if (!landmarker || !renderer) {
        scheduleNextFrame();
        return;
      }

      const timestampMs = loopNow;

      //비디오 준비 상태 확인
      if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
        renderer.render(null, { width: video.videoWidth, height: video.videoHeight });
        onTick?.({
          timestampMs,
          hasPose: false,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
        });
        scheduleNextFrame();
        return;
      }

      //프레임 처리를 스로틀링
      if (frameIntervalMs > 0 && loopNow - lastProcessedFrameAt < frameIntervalMs) {
        onTick?.({
          timestampMs,
          hasPose: false,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
        });
        scheduleNextFrame();
        return;
      }

      lastProcessedFrameAt = loopNow;

      // 포즈 감지
      let frame: PoseFrame | null = null;
      try {
        const result = landmarker.detectForVideo(video, timestampMs) as PoseLandmarkerResultLike;
        frame = toPoseFrame(result, timestampMs);
      } catch (error) {
        onTick?.({
          timestampMs,
          hasPose: false,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
        });
        scheduleNextFrame();
        return;
      }

      const progressRatio = getProgressRatio();
      const renderProgressRatio = getRenderProgressRatio ? getRenderProgressRatio() : progressRatio;
      const resolvedReferencePose = getReferencePose ? getReferencePose() : referencePose;

      // 렌더러에 위임하여 프레임을 렌더링
      renderer.render(frame?.landmarks ?? null, {
        width: video.videoWidth,
        height: video.videoHeight,
        referencePose: resolvedReferencePose,
        progressRatio: renderProgressRatio,
      });

      // 포즈가 감지된 경우 정확도를 처리
      if (frame) {
        onFrame?.(frame);
        const phase = getPhase();
        const resolvedExerciseType = getExerciseType ? getExerciseType() : exerciseType;
        const accuracyFrame = mirrorInput ? mirrorPoseFrame(frame) : frame;

        if (resolvedReferencePose && resolvedExerciseType) {
          const accuracyInput: AccuracyEvaluateInput = {
            frame: accuracyFrame,
            referencePose: resolvedReferencePose,
            progressRatio,
            type: resolvedExerciseType,
            prevPhase: phase,
          };

          const nextAccuracyEngine = resolveAccuracyEngine();
          const accuracy = nextAccuracyEngine.evaluate(accuracyInput);
          onAccuracyDebug?.({ input: accuracyInput, result: accuracy });
          onAccuracy?.(accuracy, accuracyFrame);
        }
      }

      onTick?.({
        timestampMs,
        hasPose: Boolean(frame),
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
      });

      scheduleNextFrame();
    } catch (error) {
      scheduleNextFrame();
    }
  };

  const start = async (): Promise<void> => {
    if (isRunning) return;
    isRunning = true;

    try {
      emitLog('session_start');
      await ensureLandmarker();
      if (isCancelled) return;

      ensureRenderer();
      if (isCancelled) return;

      await ensureVideoStream();
      if (isCancelled) return;

      scheduleNextFrame();
      emitLog('frame_loop_start_requested');

      if (frameStartTimeoutId) {
        window.clearTimeout(frameStartTimeoutId);
      }

      frameStartTimeoutId = window.setTimeout(() => {
        if (!isRunning) return;
        if (lastFrameLoopAt > 0) return;
        emitLog('frame_loop_stalled');
      }, 2000);
    } catch (error) {
      isRunning = false;
      emitLog('session_start_error', { message: toError(error).message });
      emitError(error);
    }
  };

  const stop = async (): Promise<void> => {
    if (!isRunning) return;
    isRunning = false;
    emitLog('session_stop');

    if (frameRequestId !== null) {
      cancelAnimationFrame(frameRequestId);
      frameRequestId = null;
    }

    if (frameStartTimeoutId) {
      window.clearTimeout(frameStartTimeoutId);
      frameStartTimeoutId = null;
    }

    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      mediaStream = null;
    }
  };

  const destroy = (): void => {
    isCancelled = true;
    void stop();
    landmarker?.close?.();
    landmarker = null;
    renderer?.destroy();
    renderer = null;
  };

  return { start, stop, destroy };
}
