import {
  createAccuracyEngine,
  type AccuracyEngine,
  type AccuracyResult,
  type ExerciseType,
  type PoseFrame,
  type ReferencePose,
  type Landmark2D,
} from '@repo/stretching-accuracy';
import {
  FilesetResolver,
  ImageSegmenter,
  PoseLandmarker,
  type MPMask,
} from '@mediapipe/tasks-vision';

type PoseLandmarkerResultLike = {
  landmarks?: ReadonlyArray<ReadonlyArray<Landmark2D>>;
};

type RgbaColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

type SegmentationColor = string | RgbaColor;

export type SegmentationOptions = {
  canvas: HTMLCanvasElement;
  modelAssetPath: string;
  foregroundColor: SegmentationColor;
  backgroundColor: SegmentationColor;
  foregroundCategory?: number;
  confidenceThreshold?: number;
  minIntervalMs?: number;
};

export type SilhouetteOptions = {
  canvas: HTMLCanvasElement;
  foregroundColor: SegmentationColor;
  backgroundColor: SegmentationColor;
  visibilityMin?: number;
  smoothingAlpha?: number;
  headRadiusRatio?: number;
  strokeWidthRatio?: number;
};

const NO_MASK_WARN_INTERVAL_MS = 2000;

export type CreateSessionOptions = {
  video: HTMLVideoElement;
  modelAssetPath: string;
  wasmRoot: string;
  referencePose: ReferencePose;
  getReferencePose?: () => ReferencePose;
  getProgressRatio: () => number;
  exerciseType: ExerciseType;
  getExerciseType?: () => ExerciseType;
  getPhase: () => string;
  segmentation?: SegmentationOptions;
  silhouette?: SilhouetteOptions;
  onFrame?: (frame: PoseFrame) => void;
  onTick?: (payload: {
    timestampMs: number;
    hasPose: boolean;
    videoWidth: number;
    videoHeight: number;
  }) => void;
  onLog?: (event: { type: string; detail?: Readonly<Record<string, unknown>> }) => void;
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
    getReferencePose,
    getProgressRatio,
    exerciseType,
    getExerciseType,
    getPhase,
    segmentation,
    silhouette,
    onFrame,
    onTick,
    onLog,
    onAccuracy,
    onError,
    accuracyEngine = createAccuracyEngine(),
    videoConstraints,
  } = options;

  const shouldUseSegmentation = Boolean(segmentation && !silhouette);

  let isRunning = false;
  let frameRequestId: number | null = null;
  let mediaStream: MediaStream | null = null;
  let landmarker: (PoseLandmarker & { close?: () => void }) | null = null;
  let segmenter: (ImageSegmenter & { close?: () => void }) | null = null;
  let segmentationContext: CanvasRenderingContext2D | null = null;
  let segmentationColors: { foreground: RgbaColor; background: RgbaColor } | null = null;
  let lastSegmentationAt = 0;
  let lastNoMaskAt = 0;
  let lastFrameLoopAt = 0;
  let hasLoggedFrameCallback = false;
  let hasLoggedFrameCallbackWhileStopped = false;
  let frameStartTimeoutId: number | null = null;
  let silhouetteContext: CanvasRenderingContext2D | null = null;
  let silhouetteColors: { foreground: RgbaColor; background: RgbaColor } | null = null;
  let smoothedLandmarks: ReadonlyArray<Landmark2D> | null = null;

  const emitError = (error: unknown): void => {
    if (!onError) return;
    onError(toError(error));
  };

  const emitLog = (type: string, detail?: Readonly<Record<string, unknown>>): void => {
    if (!onLog) return;
    onLog({ type, detail });
  };

  const resolveCssColor = (value: string): string => {
    if (typeof window === 'undefined') return value;

    const trimmed = value.trim();
    const variableMatch = trimmed.match(/^var\((--[^)]+)\)$/);
    const variableName = variableMatch?.[1] ?? (trimmed.startsWith('--') ? trimmed : null);
    if (!variableName) return trimmed;

    const resolved = getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
    return resolved || trimmed;
  };

  const normalizeAlpha = (value: number): number => {
    if (Number.isNaN(value)) return 255;
    if (value <= 1) return Math.round(value * 255);
    return Math.max(0, Math.min(255, Math.round(value)));
  };

  const normalizeColor = (color: RgbaColor): RgbaColor => {
    return {
      r: Math.max(0, Math.min(255, Math.round(color.r))),
      g: Math.max(0, Math.min(255, Math.round(color.g))),
      b: Math.max(0, Math.min(255, Math.round(color.b))),
      a: normalizeAlpha(color.a),
    };
  };

  const parseColor = (value: string, context: CanvasRenderingContext2D): RgbaColor | null => {
    context.fillStyle = value;
    const normalized = context.fillStyle.toString();

    const rgbMatch = normalized.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)$/);
    if (rgbMatch) {
      const [, r, g, b, a] = rgbMatch;
      return normalizeColor({
        r: Number(r),
        g: Number(g),
        b: Number(b),
        a: a ? Number(a) : 1,
      });
    }

    const hexMatch = normalized.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hexMatch) {
      const hex = hexMatch[1]!;
      const fullHex =
        hex.length === 3
          ? hex
              .split('')
              .map((char) => `${char}${char}`)
              .join('')
          : hex;
      const r = parseInt(fullHex.slice(0, 2), 16);
      const g = parseInt(fullHex.slice(2, 4), 16);
      const b = parseInt(fullHex.slice(4, 6), 16);
      return normalizeColor({ r, g, b, a: 255 });
    }

    return null;
  };

  const toRgbaColor = (
    value: SegmentationColor,
    context: CanvasRenderingContext2D,
  ): RgbaColor | null => {
    if (typeof value !== 'string') {
      return normalizeColor(value);
    }

    const resolved = resolveCssColor(value);
    return parseColor(resolved, context);
  };

  const ensureSegmentationContext = (): void => {
    if (!segmentation) return;
    if (segmentationContext && segmentationColors) return;

    const context = segmentation.canvas.getContext('2d');
    if (!context) throw new Error('Segmentation canvas context not available.');

    const foreground = toRgbaColor(segmentation.foregroundColor, context);
    const background = toRgbaColor(segmentation.backgroundColor, context);

    if (!foreground || !background) {
      throw new Error('Invalid segmentation colors provided.');
    }

    segmentationContext = context;
    segmentationColors = { foreground, background };
  };

  const ensureSilhouetteContext = (): void => {
    if (!silhouette) return;
    if (silhouetteContext && silhouetteColors) return;

    const context = silhouette.canvas.getContext('2d');
    if (!context) throw new Error('Silhouette canvas context not available.');

    const foreground = toRgbaColor(silhouette.foregroundColor, context);
    const background = toRgbaColor(silhouette.backgroundColor, context);

    if (!foreground || !background) {
      throw new Error('Invalid silhouette colors provided.');
    }

    silhouetteContext = context;
    silhouetteColors = { foreground, background };
  };

  const renderCategoryMask = (mask: MPMask): void => {
    if (!segmentation || !segmentationContext || !segmentationColors) return;

    const width = mask.width;
    const height = mask.height;
    if (width === 0 || height === 0) return;

    if (segmentation.canvas.width !== width) {
      segmentation.canvas.width = width;
    }
    if (segmentation.canvas.height !== height) {
      segmentation.canvas.height = height;
    }

    const maskData = mask.getAsUint8Array();
    const imageData = segmentationContext.createImageData(width, height);
    const colors = segmentationColors!;
    const { foreground, background } = colors;
    const foregroundCategory = segmentation.foregroundCategory ?? 1;

    for (let i = 0; i < maskData.length; i += 1) {
      const offset = i * 4;
      const color = maskData[i] === foregroundCategory ? foreground : background;
      imageData.data[offset] = color.r;
      imageData.data[offset + 1] = color.g;
      imageData.data[offset + 2] = color.b;
      imageData.data[offset + 3] = color.a;
    }

    segmentationContext.putImageData(imageData, 0, 0);
  };

  const renderConfidenceMask = (mask: MPMask): void => {
    if (!segmentation || !segmentationContext || !segmentationColors) return;

    const width = mask.width;
    const height = mask.height;
    if (width === 0 || height === 0) return;

    if (segmentation.canvas.width !== width) {
      segmentation.canvas.width = width;
    }
    if (segmentation.canvas.height !== height) {
      segmentation.canvas.height = height;
    }

    const maskData = mask.getAsFloat32Array();
    const imageData = segmentationContext.createImageData(width, height);
    const colors = segmentationColors!;
    const { foreground, background } = colors;
    const threshold = segmentation.confidenceThreshold ?? 0.5;

    for (let i = 0; i < maskData.length; i += 1) {
      const offset = i * 4;
      const maskValue = maskData[i]!;
      const color = maskValue >= threshold ? foreground : background;
      imageData.data[offset] = color.r;
      imageData.data[offset + 1] = color.g;
      imageData.data[offset + 2] = color.b;
      imageData.data[offset + 3] = color.a;
    }

    segmentationContext.putImageData(imageData, 0, 0);
  };

  const getConfidenceMask = (result: { confidenceMasks?: MPMask[] }): MPMask | null => {
    const masks = result.confidenceMasks;
    if (!masks || masks.length === 0) return null;

    const maskIndex = segmentation?.foregroundCategory ?? 0;
    return masks[maskIndex] ?? masks[0] ?? null;
  };

  const warnNoMask = (timestampMs: number): void => {
    if (timestampMs - lastNoMaskAt < NO_MASK_WARN_INTERVAL_MS) return;
    lastNoMaskAt = timestampMs;

    console.warn('Segmentation mask not available for current frame.');
  };

  const getVisibility = (landmark: Landmark2D): number => {
    return landmark.visibility ?? 1;
  };

  const smoothPoseLandmarks = (
    landmarks: ReadonlyArray<Landmark2D>,
    visibilityMin: number,
    smoothingAlpha: number,
  ): ReadonlyArray<Landmark2D> => {
    if (!smoothedLandmarks) {
      smoothedLandmarks = landmarks.map((landmark) => ({ ...landmark }));
      return smoothedLandmarks;
    }

    smoothedLandmarks = smoothedLandmarks.map((previous, index) => {
      const current = landmarks[index];
      if (!current) return previous;
      if (getVisibility(current) < visibilityMin) return previous;

      return {
        x: previous.x + (current.x - previous.x) * smoothingAlpha,
        y: previous.y + (current.y - previous.y) * smoothingAlpha,
        z: previous.z + (current.z - previous.z) * smoothingAlpha,
        visibility: current.visibility,
      };
    });

    return smoothedLandmarks;
  };

  const toCanvasPoint = (
    landmark: Landmark2D | undefined,
    width: number,
    height: number,
  ): { x: number; y: number } | null => {
    if (!landmark) return null;
    if (!Number.isFinite(landmark.x) || !Number.isFinite(landmark.y)) return null;
    const clampedX = Math.max(0, Math.min(1, landmark.x));
    const clampedY = Math.max(0, Math.min(1, landmark.y));
    return {
      x: clampedX * width,
      y: clampedY * height,
    };
  };

  const getShoulderWidth = (
    landmarks: ReadonlyArray<Landmark2D>,
    width: number,
    height: number,
  ): number => {
    const left = toCanvasPoint(landmarks[11], width, height);
    const right = toCanvasPoint(landmarks[12], width, height);
    if (!left || !right) return Math.max(8, width * 0.08);
    const dx = left.x - right.x;
    const dy = left.y - right.y;
    return Math.max(8, Math.sqrt(dx * dx + dy * dy));
  };

  const drawBone = (
    context: CanvasRenderingContext2D,
    landmarks: ReadonlyArray<Landmark2D>,
    startIndex: number,
    endIndex: number,
    lineWidth: number,
    width: number,
    height: number,
  ): void => {
    const start = toCanvasPoint(landmarks[startIndex], width, height);
    if (!start) return;
    const end = toCanvasPoint(landmarks[endIndex], width, height);
    if (!end) return;

    context.lineWidth = lineWidth;
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
  };

  const renderSilhouette = (landmarks: ReadonlyArray<Landmark2D>): void => {
    if (!silhouette || !silhouetteContext || !silhouetteColors) return;

    const width = video.videoWidth;
    const height = video.videoHeight;
    if (width === 0 || height === 0) return;

    if (silhouette.canvas.width !== width) {
      silhouette.canvas.width = width;
    }
    if (silhouette.canvas.height !== height) {
      silhouette.canvas.height = height;
    }

    const visibilityMin = silhouette.visibilityMin ?? 0.5;
    const smoothingAlpha = silhouette.smoothingAlpha ?? 0.15;
    const headRadiusRatio = silhouette.headRadiusRatio ?? 0.42;
    const strokeWidthRatio = silhouette.strokeWidthRatio ?? 0.3;

    const smoothed = smoothPoseLandmarks(landmarks, visibilityMin, smoothingAlpha);
    const { foreground, background } = silhouetteColors;
    const shoulderWidth = getShoulderWidth(smoothed, width, height);
    const strokeWidth = Math.max(4, shoulderWidth * strokeWidthRatio);

    silhouetteContext.save();
    silhouetteContext.imageSmoothingEnabled = true;
    silhouetteContext.setTransform(1, 0, 0, 1, 0, 0);

    //거울모드
    silhouetteContext.translate(width, 0);
    silhouetteContext.scale(-1, 1);

    silhouetteContext.clearRect(0, 0, width, height);
    silhouetteContext.fillStyle = `rgba(${background.r}, ${background.g}, ${background.b}, ${background.a / 255})`;
    silhouetteContext.fillRect(0, 0, width, height);

    silhouetteContext.lineJoin = 'round';
    silhouetteContext.lineCap = 'round';
    silhouetteContext.fillStyle = `rgba(${foreground.r}, ${foreground.g}, ${foreground.b}, ${foreground.a / 255})`;
    silhouetteContext.strokeStyle = silhouetteContext.fillStyle;
    silhouetteContext.lineWidth = strokeWidth;

    const nose = toCanvasPoint(smoothed[0], width, height);
    const leftShoulder = toCanvasPoint(smoothed[11], width, height);
    const rightShoulder = toCanvasPoint(smoothed[12], width, height);
    const headCenter =
      nose ??
      (leftShoulder && rightShoulder
        ? {
            x: (leftShoulder.x + rightShoulder.x) / 2,
            y: (leftShoulder.y + rightShoulder.y) / 2 - shoulderWidth * 0.6,
          }
        : null);

    if (headCenter && leftShoulder && rightShoulder) {
      // 머리 위치 위로 올리기
      const headLift = shoulderWidth * 0.12;
      const liftedHeadCenter = { x: headCenter.x, y: headCenter.y - headLift };

      const headRadius = shoulderWidth * headRadiusRatio;

      // 머리 채우기
      silhouetteContext.beginPath();
      silhouetteContext.arc(liftedHeadCenter.x, liftedHeadCenter.y, headRadius, 0, Math.PI * 2);
      silhouetteContext.fill();

      // 목 그리기
      const shoulderMid = {
        x: (leftShoulder.x + rightShoulder.x) / 2,
        y: (leftShoulder.y + rightShoulder.y) / 2,
      };

      const neckStart = {
        x: liftedHeadCenter.x,
        y: liftedHeadCenter.y + headRadius * 0.75, // 머리 아래쪽
      };

      const neckWidth = Math.max(2, strokeWidth * 0.65);
      silhouetteContext.lineWidth = neckWidth;
      silhouetteContext.beginPath();
      silhouetteContext.moveTo(neckStart.x, neckStart.y);
      silhouetteContext.lineTo(shoulderMid.x, shoulderMid.y);
      silhouetteContext.stroke();
    }

    const limbWidth = Math.max(2, strokeWidth * 0.55);
    const torsoWidth = Math.max(4, strokeWidth * 1.2);
    const spineWidth = Math.max(3, strokeWidth);

    drawBone(silhouetteContext, smoothed, 11, 23, torsoWidth, width, height);
    drawBone(silhouetteContext, smoothed, 12, 24, torsoWidth, width, height);
    drawBone(silhouetteContext, smoothed, 11, 12, torsoWidth, width, height);
    drawBone(silhouetteContext, smoothed, 23, 24, torsoWidth, width, height);

    if (leftShoulder && rightShoulder) {
      const spineStart = {
        x: (leftShoulder.x + rightShoulder.x) / 2,
        y: (leftShoulder.y + rightShoulder.y) / 2,
      };
      const leftHip = toCanvasPoint(smoothed[23], width, height);
      const rightHip = toCanvasPoint(smoothed[24], width, height);
      if (leftHip && rightHip) {
        const spineEnd = {
          x: (leftHip.x + rightHip.x) / 2,
          y: (leftHip.y + rightHip.y) / 2,
        };
        silhouetteContext.lineWidth = spineWidth;
        silhouetteContext.beginPath();
        silhouetteContext.moveTo(spineStart.x, spineStart.y);
        silhouetteContext.lineTo(spineEnd.x, spineEnd.y);
        silhouetteContext.stroke();
      }
    }

    drawBone(silhouetteContext, smoothed, 11, 13, limbWidth, width, height);
    drawBone(silhouetteContext, smoothed, 13, 15, limbWidth, width, height);
    drawBone(silhouetteContext, smoothed, 12, 14, limbWidth, width, height);
    drawBone(silhouetteContext, smoothed, 14, 16, limbWidth, width, height);
    drawBone(silhouetteContext, smoothed, 23, 25, limbWidth, width, height);
    drawBone(silhouetteContext, smoothed, 25, 27, limbWidth, width, height);
    drawBone(silhouetteContext, smoothed, 27, 31, limbWidth, width, height);
    drawBone(silhouetteContext, smoothed, 24, 26, limbWidth, width, height);
    drawBone(silhouetteContext, smoothed, 26, 28, limbWidth, width, height);
    drawBone(silhouetteContext, smoothed, 28, 32, limbWidth, width, height);

    silhouetteContext.restore();
  };

  const renderSilhouetteBackground = (): void => {
    if (!silhouette || !silhouetteContext || !silhouetteColors) return;

    const width = video.videoWidth;
    const height = video.videoHeight;
    if (width === 0 || height === 0) return;

    if (silhouette.canvas.width !== width) {
      silhouette.canvas.width = width;
    }
    if (silhouette.canvas.height !== height) {
      silhouette.canvas.height = height;
    }

    const { background } = silhouetteColors;
    silhouetteContext.save();
    silhouetteContext.clearRect(0, 0, width, height);
    silhouetteContext.fillStyle = `rgba(${background.r}, ${background.g}, ${background.b}, ${background.a / 255})`;
    silhouetteContext.fillRect(0, 0, width, height);
    silhouetteContext.restore();
  };

  /**
   * mediapipe 초기화
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

  const ensureSegmenter = async (): Promise<void> => {
    if (!segmentation) return;
    if (!shouldUseSegmentation) return;
    if (segmenter) return;

    const fileset = await FilesetResolver.forVisionTasks(wasmRoot);
    segmenter = await ImageSegmenter.createFromOptions(fileset, {
      baseOptions: {
        modelAssetPath: segmentation.modelAssetPath,
      },
      runningMode: 'VIDEO',
      outputCategoryMask: true,
      outputConfidenceMasks: true,
    });
  };

  /**
   * 웹캠 연결
   */
  const ensureVideoStream = async (): Promise<void> => {
    if (mediaStream) return;

    emitLog('video_stream_request');
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: videoConstraints ?? true,
      audio: false,
    });

    video.srcObject = mediaStream;
    await video.play(); //재생
    emitLog('video_play_started', {
      readyState: video.readyState,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
    });
  };

  const scheduleNextFrame = (): void => {
    frameRequestId = requestAnimationFrame(processFrame);
  };

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
      if (!landmarker) {
        scheduleNextFrame();
        return;
      }

      const timestampMs = loopNow;
      if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
        if (silhouette) renderSilhouetteBackground();
        onTick?.({
          timestampMs,
          hasPose: false,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
        });
        scheduleNextFrame();
        return;
      }

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

      if (frame) {
        onFrame?.(frame);
        // TODO: 세션 내부에서 정확도 평가 진행(진행률 정책 확정 후 외부 이동 검토 for 관심사 분리)
        const progressRatio = getProgressRatio();
        const phase = getPhase();
        const resolvedReferencePose = getReferencePose ? getReferencePose() : referencePose;
        const resolvedExerciseType = getExerciseType ? getExerciseType() : exerciseType;
        if (!resolvedReferencePose || !resolvedExerciseType) {
          scheduleNextFrame();
          return;
        }
        const accuracy = accuracyEngine.evaluate({
          frame,
          referencePose: resolvedReferencePose,
          progressRatio,
          type: resolvedExerciseType,
          prevPhase: phase,
        });
        onAccuracy?.(accuracy, frame);

        if (silhouette) renderSilhouette(frame.landmarks);
      } else {
        if (silhouette) renderSilhouetteBackground();
      }

      onTick?.({
        timestampMs,
        hasPose: Boolean(frame),
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
      });

      if (segmenter && segmentation && shouldUseSegmentation) {
        const minIntervalMs = segmentation.minIntervalMs ?? 0;
        if (timestampMs - lastSegmentationAt >= minIntervalMs) {
          const result = segmenter.segmentForVideo(video, timestampMs);
          const categoryMask = result.categoryMask;
          if (categoryMask) {
            renderCategoryMask(categoryMask);
          }

          const confidenceMask = categoryMask ? null : getConfidenceMask(result);
          if (confidenceMask) {
            renderConfidenceMask(confidenceMask);
          }

          if (!categoryMask && !confidenceMask) {
            warnNoMask(timestampMs);
          }
          result.close();
          lastSegmentationAt = timestampMs;
        }
      }

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
      await ensureSegmenter();
      if (shouldUseSegmentation) {
        ensureSegmentationContext();
      }
      ensureSilhouetteContext();
      await ensureVideoStream();
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
    void stop();
    landmarker?.close?.();
    landmarker = null;
    segmenter?.close?.();
    segmenter = null;
    smoothedLandmarks = null;
  };

  return { start, stop, destroy };
}
