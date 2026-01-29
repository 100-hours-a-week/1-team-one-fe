/**
 * 실루엣 렌더러 - 스틱 피겨 실루엣
 *
 * 포즈 랜드마크를 기반으로 단순화된 인체 형상 렌더링
 */

import type { Landmark2D } from '@repo/stretching-accuracy';
import type { RgbaColor, SegmentationColor } from '../utils/color-cache';
import { parseColor } from '../utils/color-cache';
import { drawBone, getShoulderWidth, getVisibility, toCanvasPoint } from '../utils/geometry';
import type { Renderer, RenderContext, RenderOptions } from './renderer-base';

export type SilhouetteConfig = {
  foregroundColor: SegmentationColor;
  backgroundColor: SegmentationColor;
  visibilityMin?: number;
  smoothingAlpha?: number;
  headRadiusRatio?: number;
  strokeWidthRatio?: number;
  mirrorMode?: boolean;
};

const DEFAULT_CONFIG = {
  visibilityMin: 0.5,
  smoothingAlpha: 0.15,
  headRadiusRatio: 0.42,
  strokeWidthRatio: 0.3,
  mirrorMode: true,
};

export class SilhouetteRenderer implements Renderer {
  private context: CanvasRenderingContext2D | null = null;
  private config: Required<SilhouetteConfig>;
  private colors: { foreground: RgbaColor; background: RgbaColor } | null = null;
  private smoothedLandmarks: ReadonlyArray<Landmark2D> | null = null;

  constructor(config: SilhouetteConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  init(renderContext: RenderContext): void {
    const ctx = renderContext.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Silhouette renderer: canvas context not available');
    }

    this.context = ctx;

    // 초기화 시 색상 1회만 파싱합니다
    const foreground = parseColor(this.config.foregroundColor, ctx);
    const background = parseColor(this.config.backgroundColor, ctx);

    if (!foreground || !background) {
      throw new Error('Invalid silhouette colors provided');
    }

    this.colors = { foreground, background };
  }

  render(landmarks: ReadonlyArray<Landmark2D> | null, options: RenderOptions): void {
    if (!this.context || !this.colors) return;

    const { width, height, mirrorMode = this.config.mirrorMode } = options;

    // 캔버스 크기 일치
    if (this.context.canvas.width !== width) {
      this.context.canvas.width = width;
    }
    if (this.context.canvas.height !== height) {
      this.context.canvas.height = height;
    }

    // 랜드마크가 없으면 배경만
    if (!landmarks || landmarks.length === 0) {
      this.renderBackground(width, height);
      return;
    }

    // 실루엣 렌더링
    this.renderSilhouette(landmarks, width, height, mirrorMode);
  }

  private renderBackground(width: number, height: number): void {
    if (!this.context || !this.colors) return;

    const { background } = this.colors;

    this.context.save();
    this.context.clearRect(0, 0, width, height);
    this.context.fillStyle = `rgba(${background.r}, ${background.g}, ${background.b}, ${background.a / 255})`;
    this.context.fillRect(0, 0, width, height);
    this.context.restore();
  }

  private renderSilhouette(
    landmarks: ReadonlyArray<Landmark2D>,
    width: number,
    height: number,
    mirrorMode: boolean,
  ): void {
    if (!this.context || !this.colors) return;

    const smoothed = this.smoothPoseLandmarks(landmarks);
    const { foreground, background } = this.colors;
    const shoulderWidth = getShoulderWidth(smoothed, width, height);
    const strokeWidth = Math.max(4, shoulderWidth * this.config.strokeWidthRatio);

    this.context.save();
    this.context.imageSmoothingEnabled = true;
    this.context.setTransform(1, 0, 0, 1, 0, 0);

    // 미러 모드
    if (mirrorMode) {
      this.context.translate(width, 0);
      this.context.scale(-1, 1);
    }

    // 배경
    this.context.clearRect(0, 0, width, height);
    this.context.fillStyle = `rgba(${background.r}, ${background.g}, ${background.b}, ${background.a / 255})`;
    this.context.fillRect(0, 0, width, height);

    // 스타일
    this.context.lineJoin = 'round';
    this.context.lineCap = 'round';
    this.context.fillStyle = `rgba(${foreground.r}, ${foreground.g}, ${foreground.b}, ${foreground.a / 255})`;
    this.context.strokeStyle = this.context.fillStyle;
    this.context.lineWidth = strokeWidth;

    // 머리
    this.drawHead(smoothed, width, height, shoulderWidth);

    // 몸통 척추
    this.drawTorso(smoothed, width, height, strokeWidth, shoulderWidth);

    // 사지
    this.drawLimbs(smoothed, width, height, strokeWidth);

    this.context.restore();
  }

  private drawHead(
    landmarks: ReadonlyArray<Landmark2D>,
    width: number,
    height: number,
    shoulderWidth: number,
  ): void {
    if (!this.context) return;

    const nose = toCanvasPoint(landmarks[0], width, height);
    const leftShoulder = toCanvasPoint(landmarks[11], width, height);
    const rightShoulder = toCanvasPoint(landmarks[12], width, height);

    const headCenter =
      nose ??
      (leftShoulder && rightShoulder
        ? {
            x: (leftShoulder.x + rightShoulder.x) / 2,
            y: (leftShoulder.y + rightShoulder.y) / 2 - shoulderWidth * 0.6,
          }
        : null);

    if (!headCenter || !leftShoulder || !rightShoulder) return;

    // 머리 위치 상향 보정 (목그리기 위해)
    const headLift = shoulderWidth * 0.12;
    const liftedHeadCenter = { x: headCenter.x, y: headCenter.y - headLift };
    const headRadius = shoulderWidth * this.config.headRadiusRatio;

    // 머리 원
    this.context.beginPath();
    this.context.arc(liftedHeadCenter.x, liftedHeadCenter.y, headRadius, 0, Math.PI * 2);
    this.context.fill();

    // 목
    const shoulderMid = {
      x: (leftShoulder.x + rightShoulder.x) / 2,
      y: (leftShoulder.y + rightShoulder.y) / 2,
    };

    const neckStart = {
      x: liftedHeadCenter.x,
      y: liftedHeadCenter.y + headRadius * 0.75,
    };

    const neckWidth = Math.max(2, this.context.lineWidth * 0.65);
    this.context.lineWidth = neckWidth;
    this.context.beginPath();
    this.context.moveTo(neckStart.x, neckStart.y);
    this.context.lineTo(shoulderMid.x, shoulderMid.y);
    this.context.stroke();
  }

  private drawTorso(
    landmarks: ReadonlyArray<Landmark2D>,
    width: number,
    height: number,
    strokeWidth: number,
    shoulderWidth: number,
  ): void {
    if (!this.context) return;

    const torsoWidth = Math.max(4, strokeWidth * 1.2);
    const spineWidth = Math.max(3, strokeWidth);

    // 몸통 윤곽
    drawBone(this.context, landmarks, 11, 23, torsoWidth, width, height);
    drawBone(this.context, landmarks, 12, 24, torsoWidth, width, height);
    drawBone(this.context, landmarks, 11, 12, torsoWidth, width, height);
    drawBone(this.context, landmarks, 23, 24, torsoWidth, width, height);

    // 척추
    const leftShoulder = toCanvasPoint(landmarks[11], width, height);
    const rightShoulder = toCanvasPoint(landmarks[12], width, height);

    if (leftShoulder && rightShoulder) {
      const spineStart = {
        x: (leftShoulder.x + rightShoulder.x) / 2,
        y: (leftShoulder.y + rightShoulder.y) / 2,
      };

      const leftHip = toCanvasPoint(landmarks[23], width, height);
      const rightHip = toCanvasPoint(landmarks[24], width, height);

      if (leftHip && rightHip) {
        const spineEnd = {
          x: (leftHip.x + rightHip.x) / 2,
          y: (leftHip.y + rightHip.y) / 2,
        };

        this.context.lineWidth = spineWidth;
        this.context.beginPath();
        this.context.moveTo(spineStart.x, spineStart.y);
        this.context.lineTo(spineEnd.x, spineEnd.y);
        this.context.stroke();
      }
    }
  }

  private drawLimbs(
    landmarks: ReadonlyArray<Landmark2D>,
    width: number,
    height: number,
    strokeWidth: number,
  ): void {
    if (!this.context) return;

    const limbWidth = Math.max(2, strokeWidth * 0.55);

    // 팔
    drawBone(this.context, landmarks, 11, 13, limbWidth, width, height);
    drawBone(this.context, landmarks, 13, 15, limbWidth, width, height);
    drawBone(this.context, landmarks, 12, 14, limbWidth, width, height);
    drawBone(this.context, landmarks, 14, 16, limbWidth, width, height);

    // 다리
    drawBone(this.context, landmarks, 23, 25, limbWidth, width, height);
    drawBone(this.context, landmarks, 25, 27, limbWidth, width, height);
    drawBone(this.context, landmarks, 27, 31, limbWidth, width, height);
    drawBone(this.context, landmarks, 24, 26, limbWidth, width, height);
    drawBone(this.context, landmarks, 26, 28, limbWidth, width, height);
    drawBone(this.context, landmarks, 28, 32, limbWidth, width, height);
  }

  private smoothPoseLandmarks(landmarks: ReadonlyArray<Landmark2D>): ReadonlyArray<Landmark2D> {
    if (!this.smoothedLandmarks) {
      this.smoothedLandmarks = landmarks.map((landmark) => ({ ...landmark }));
      return this.smoothedLandmarks;
    }

    const visibilityMin = this.config.visibilityMin;
    const smoothingAlpha = this.config.smoothingAlpha;

    this.smoothedLandmarks = this.smoothedLandmarks.map((previous, index) => {
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

    return this.smoothedLandmarks;
  }

  destroy(): void {
    this.context = null;
    this.colors = null;
    this.smoothedLandmarks = null;
  }
}
