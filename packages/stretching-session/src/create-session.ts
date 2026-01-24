import {
  createAccuracyEngine,
  type AccuracyEngine,
  type AccuracyResult,
  type PoseFrame,
  type ReferencePose,
  type Landmark2D,
} from '@repo/stretching-accuracy';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';

type PoseLandmarkerResultLike = {
  landmarks?: ReadonlyArray<ReadonlyArray<Landmark2D>>;
};

export type CreateSessionOptions = {
  video: HTMLVideoElement;
  modelAssetPath: string;
  wasmRoot: string;
  referencePose: ReferencePose;
  getProgressRatio: () => number;
  onFrame?: (frame: PoseFrame) => void;
  onAccuracy?: (result: AccuracyResult, frame: PoseFrame) => void;
  onError?: (error: Error) => void;
  accuracyEngine?: AccuracyEngine;
  videoConstraints?: MediaTrackConstraints;
};

export type StretchingSession = {
  start: () => Promise<void>; // 세션 시작
  stop: () => Promise<void>; //루프 중지
  destroy: () => void; //stop + landmarker.close()
};

/**
 * mediapipe 열과를 pose frame 형태로 변환
 */
const toPoseFrame = (result: PoseLandmarkerResultLike, timestampMs: number): PoseFrame | null => {
  const landmarks = result.landmarks?.[0];
  if (!landmarks || landmarks.length === 0) return null;

  const normalized = landmarks.map((landmark) => {
    return {
      x: landmark.x,
      y: landmark.y,
      z: landmark.z,
      visibility: landmark.visibility,
    };
  });

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
    modelAssetPath,
    wasmRoot,
    referencePose,
    getProgressRatio,
    onFrame,
    onAccuracy,
    onError,
    accuracyEngine = createAccuracyEngine(),
    videoConstraints,
  } = options;

  let isRunning = false;
  let frameRequestId: number | null = null;
  let mediaStream: MediaStream | null = null;
  let landmarker: (PoseLandmarker & { close?: () => void }) | null = null;

  const emitError = (error: unknown): void => {
    if (!onError) return;
    onError(toError(error));
  };

  /**
   * mediapipe 초기화
   */
  const ensureLandmarker = async (): Promise<void> => {
    if (landmarker) return;

    const fileset = await FilesetResolver.forVisionTasks(wasmRoot);
    landmarker = await PoseLandmarker.createFromOptions(fileset, {
      baseOptions: {
        modelAssetPath,
      },
      runningMode: 'VIDEO',
    });
  };

  /**
   * 웹캠 연결
   */
  const ensureVideoStream = async (): Promise<void> => {
    if (mediaStream) return;

    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: videoConstraints ?? true,
      audio: false,
    });

    video.srcObject = mediaStream;
    await video.play(); //재생
  };

  const scheduleNextFrame = (): void => {
    frameRequestId = requestAnimationFrame(processFrame);
  };

  const processFrame = (): void => {
    if (!isRunning) return;
    if (!landmarker) return scheduleNextFrame();

    const timestampMs = performance.now();
    const result = landmarker.detectForVideo(video, timestampMs) as PoseLandmarkerResultLike;
    const frame = toPoseFrame(result, timestampMs);

    if (frame) {
      onFrame?.(frame);

      // TODO: 세션 내부에서 정확도 평가 진행(진행률 정책 확정 후 외부 이동 검토 for 관심사 분리)
      const progressRatio = getProgressRatio();
      const accuracy = accuracyEngine.evaluate({ frame, referencePose, progressRatio });
      onAccuracy?.(accuracy, frame);
    }

    scheduleNextFrame();
  };

  const start = async (): Promise<void> => {
    if (isRunning) return;
    isRunning = true;

    try {
      await ensureLandmarker();
      await ensureVideoStream();
      scheduleNextFrame();
    } catch (error) {
      isRunning = false;
      emitError(error);
    }
  };

  const stop = async (): Promise<void> => {
    if (!isRunning) return;
    isRunning = false;

    if (frameRequestId !== null) {
      cancelAnimationFrame(frameRequestId);
      frameRequestId = null;
    }

    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      mediaStream = null;
    }
  };

  const destroy = (): void => {
    void stop();
    landmarker?.close?.();
    landmarker = null;
  };

  return { start, stop, destroy };
}
