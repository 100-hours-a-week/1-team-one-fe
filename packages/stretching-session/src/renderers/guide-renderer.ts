import type { Landmark2D, ReferencePose } from '@repo/stretching-accuracy';

import { parseColor } from '../utils/color-cache';
import { GUIDE_CONNECTIONS, GUIDE_LANDMARK_NAMES } from './guide-constants';
import type { Renderer, RenderContext, RenderOptions } from './renderer-base';

export type GuideConfig = {
  enabled?: boolean;
  showLabels?: boolean;
  alignToUser?: boolean;
  lineWidth?: number;
  pointRadius?: number;
  pointOutlineRadius?: number;
  pointOutlineWidth?: number;
  color?: string;
  outlineColor?: string;
  labelColor?: string;
  labelFontSizePx?: number;
  labelOffset?: { x: number; y: number };
  alphaActive?: number;
  alphaIdle?: number;
  mirrorMode?: boolean;
};

const DEFAULT_CONFIG: Required<GuideConfig> = {
  enabled: true,
  showLabels: true,
  alignToUser: true,
  lineWidth: 3,
  pointRadius: 8,
  pointOutlineRadius: 10,
  pointOutlineWidth: 2,
  color: 'var(--color-brand-500)',
  outlineColor: 'var(--color-brand-500)',
  labelColor: 'var(--color-brand-500)',
  labelFontSizePx: 10,
  labelOffset: { x: 12, y: 5 },
  alphaActive: 0.5,
  alphaIdle: 0.7,
  mirrorMode: true,
};

const MIN_SHOULDER_WIDTH = 0.01;

export class GuideRenderer implements Renderer {
  private context: CanvasRenderingContext2D | null = null;
  private overlayCanvas: HTMLCanvasElement | null = null;
  private overlayContext: CanvasRenderingContext2D | null = null;
  private resolvedColors: { guide: string; outline: string; label: string } | null = null;
  private config: Required<GuideConfig>;

  constructor(config?: GuideConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  init(renderContext: RenderContext): void {
    const ctx = renderContext.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Guide renderer: canvas context not available');
    }

    this.context = ctx;
    this.resolvedColors = {
      guide: resolveCssColorValue(this.config.color, ctx),
      outline: resolveCssColorValue(this.config.outlineColor, ctx),
      label: resolveCssColorValue(this.config.labelColor, ctx),
    };
  }

  render(landmarks: ReadonlyArray<Landmark2D> | null, options: RenderOptions): void {
    if (!this.context) return;
    if (!this.config.enabled) return;

    const { width, height, referencePose, progressRatio } = options;
    if (!referencePose) return;

    const overlay = this.ensureOverlayContext(width, height);
    if (!overlay) return;

    const mirrorMode = options.mirrorMode ?? this.config.mirrorMode;
    const hasUserPose = Boolean(landmarks && landmarks.length > 0);
    const alpha = hasUserPose ? this.config.alphaActive : this.config.alphaIdle;

    overlay.save();
    overlay.clearRect(0, 0, width, height);
    overlay.imageSmoothingEnabled = true;
    overlay.setTransform(1, 0, 0, 1, 0, 0);

    if (mirrorMode) {
      overlay.translate(width, 0);
      overlay.scale(-1, 1);
    }

    const ratio = typeof progressRatio === 'number' ? progressRatio : 0;
    const keypoints = interpolateReferenceKeypoints(referencePose, ratio);
    const aligned = this.config.alignToUser
      ? alignReferenceToUser(keypoints, referencePose.targetKeypoints, landmarks ?? [])
      : keypoints;

    const indexToKeypoint = new Map<number, Landmark2D>();
    for (let i = 0; i < referencePose.targetKeypoints.length; i++) {
      const targetIndex = referencePose.targetKeypoints[i];
      const kp = aligned[i];
      if (!kp || targetIndex === undefined) continue;
      indexToKeypoint.set(targetIndex, kp);
    }

    const colors = this.resolvedColors ?? {
      guide: this.config.color,
      outline: this.config.outlineColor,
      label: this.config.labelColor,
    };

    overlay.lineJoin = 'round';
    overlay.lineCap = 'round';
    overlay.strokeStyle = colors.guide;
    overlay.lineWidth = this.config.lineWidth;

    for (const [startIdx, endIdx] of GUIDE_CONNECTIONS) {
      const start = indexToKeypoint.get(startIdx);
      const end = indexToKeypoint.get(endIdx);
      if (!start || !end) continue;

      const startPoint = toCanvasPoint(start, width, height);
      const endPoint = toCanvasPoint(end, width, height);
      if (!startPoint || !endPoint) continue;

      overlay.beginPath();
      overlay.moveTo(startPoint.x, startPoint.y);
      overlay.lineTo(endPoint.x, endPoint.y);
      overlay.stroke();
    }

    overlay.fillStyle = colors.guide;
    for (const [index, kp] of indexToKeypoint.entries()) {
      const point = toCanvasPoint(kp, width, height);
      if (!point) continue;

      overlay.beginPath();
      overlay.arc(point.x, point.y, this.config.pointRadius, 0, Math.PI * 2);
      overlay.fill();

      overlay.beginPath();
      overlay.arc(point.x, point.y, this.config.pointOutlineRadius, 0, Math.PI * 2);
      overlay.strokeStyle = colors.outline;
      overlay.lineWidth = this.config.pointOutlineWidth;
      overlay.stroke();

      if (this.config.showLabels) {
        const label = GUIDE_LANDMARK_NAMES[index as keyof typeof GUIDE_LANDMARK_NAMES];
        if (label) {
          overlay.font = `${this.config.labelFontSizePx}px sans-serif`;
          overlay.fillStyle = colors.label;
          overlay.fillText(
            label,
            point.x + this.config.labelOffset.x,
            point.y + this.config.labelOffset.y,
          );
          overlay.fillStyle = colors.guide;
        }
      }
    }

    overlay.restore();

    this.context.save();
    this.context.globalAlpha = alpha;
    if (this.overlayCanvas) {
      this.context.drawImage(this.overlayCanvas, 0, 0, width, height);
    }
    this.context.restore();
  }

  destroy(): void {
    this.context = null;
    this.overlayContext = null;
    this.overlayCanvas = null;
    this.resolvedColors = null;
  }

  private ensureOverlayContext(width: number, height: number): CanvasRenderingContext2D | null {
    if (!this.overlayCanvas) {
      this.overlayCanvas = document.createElement('canvas');
    }

    if (this.overlayCanvas.width !== width) {
      this.overlayCanvas.width = width;
    }
    if (this.overlayCanvas.height !== height) {
      this.overlayCanvas.height = height;
    }

    if (!this.overlayContext) {
      this.overlayContext = this.overlayCanvas.getContext('2d');
    }

    return this.overlayContext;
  }
}

function resolveCssColorValue(value: string, context: CanvasRenderingContext2D): string {
  const parsed = parseColor(value, context);
  if (!parsed) return value;
  return `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${parsed.a / 255})`;
}

function toCanvasPoint(
  landmark: Landmark2D,
  width: number,
  height: number,
): { x: number; y: number } | null {
  if (!Number.isFinite(landmark.x) || !Number.isFinite(landmark.y)) return null;

  return {
    x: landmark.x * width,
    y: landmark.y * height,
  };
}

function interpolateReferenceKeypoints(
  referencePose: ReferencePose,
  progressRatio: number,
): Landmark2D[] {
  const keyframes = referencePose.keyframes;
  if (keyframes.length === 0) return [];

  const firstKeyframe = keyframes[0]!;
  const lastKeyframe = keyframes[keyframes.length - 1]!;

  if (progressRatio <= firstKeyframe.timestampRatio) {
    return [...firstKeyframe.keypoints];
  }
  if (progressRatio >= lastKeyframe.timestampRatio) {
    return [...lastKeyframe.keypoints];
  }

  let prevFrame = firstKeyframe;
  let nextFrame = lastKeyframe;

  for (let i = 0; i < keyframes.length - 1; i++) {
    const current = keyframes[i]!;
    const next = keyframes[i + 1]!;
    if (current.timestampRatio <= progressRatio && next.timestampRatio >= progressRatio) {
      prevFrame = current;
      nextFrame = next;
      break;
    }
  }

  const denom = nextFrame.timestampRatio - prevFrame.timestampRatio;
  const t = denom > 0 ? (progressRatio - prevFrame.timestampRatio) / denom : 0;

  const interpolated: Landmark2D[] = [];
  for (let i = 0; i < prevFrame.keypoints.length; i++) {
    const prev = prevFrame.keypoints[i];
    const next = nextFrame.keypoints[i];
    if (!prev || !next) continue;

    interpolated.push({
      x: prev.x + (next.x - prev.x) * t,
      y: prev.y + (next.y - prev.y) * t,
      z: prev.z + (next.z - prev.z) * t,
      visibility: 1,
    });
  }

  return interpolated;
}

function alignReferenceToUser(
  keypoints: ReadonlyArray<Landmark2D>,
  targetIndices: ReadonlyArray<number>,
  userLandmarks: ReadonlyArray<Landmark2D>,
): Landmark2D[] {
  const leftIndex = targetIndices.indexOf(11);
  const rightIndex = targetIndices.indexOf(12);
  if (leftIndex < 0 || rightIndex < 0) {
    return [...keypoints];
  }

  const leftRef = keypoints[leftIndex];
  const rightRef = keypoints[rightIndex];
  const leftUser = userLandmarks[11];
  const rightUser = userLandmarks[12];

  if (!leftRef || !rightRef || !leftUser || !rightUser) {
    return [...keypoints];
  }

  const refCenterX = (leftRef.x + rightRef.x) / 2;
  const refCenterY = (leftRef.y + rightRef.y) / 2;
  const refWidth = Math.abs(rightRef.x - leftRef.x);
  const userCenterX = (leftUser.x + rightUser.x) / 2;
  const userCenterY = (leftUser.y + rightUser.y) / 2;
  const userWidth = Math.abs(rightUser.x - leftUser.x);

  const scale = refWidth > MIN_SHOULDER_WIDTH ? userWidth / refWidth : 1;

  return keypoints.map((kp) => ({
    x: (kp.x - refCenterX) * scale + userCenterX,
    y: (kp.y - refCenterY) * scale + userCenterY,
    z: kp.z,
    visibility: kp.visibility,
  }));
}
