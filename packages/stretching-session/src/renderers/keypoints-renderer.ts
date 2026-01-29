/**
 * 키포인트 렌더러 - 미디어파이프 포즈 스켈레톤 표시
 *
 * 33개의 포즈 랜드마크를 선으로 연결해 렌더링하며, 필요 시 점을 함께 표시
 *
 * 프레임당 약 15회의 캔버스 연산
 */

import { PoseLandmarker } from '@mediapipe/tasks-vision';
import type { Landmark2D } from '@repo/stretching-accuracy';
import { toCanvasPoint } from '../utils/geometry';
import type { Renderer, RenderContext, RenderOptions } from './renderer-base';

export type KeypointsConfig = {
  lineColor?: string;
  lineWidth?: number;
  pointColor?: string;
  pointRadius?: number;
  backgroundColor?: string;
  visibilityThreshold?: number;
  showPoints?: boolean;
  mirrorMode?: boolean;
};

const DEFAULT_CONFIG: Required<KeypointsConfig> = {
  lineColor: '#00FF00',
  lineWidth: 2,
  pointColor: '#FF0000',
  pointRadius: 3,
  backgroundColor: '#000000',
  visibilityThreshold: 0.5,
  showPoints: true,
  mirrorMode: true,
};

export class KeypointsRenderer implements Renderer {
  private context: CanvasRenderingContext2D | null = null;
  private connections: ReadonlyArray<[number, number]> = [];
  private config: Required<KeypointsConfig>;

  constructor(config?: KeypointsConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  init(renderContext: RenderContext): void {
    const ctx = renderContext.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Keypoints renderer: canvas context not available');
    }

    this.context = ctx;

    // 초기화 시 미디어파이프 POSE_CONNECTIONS를 한 번만 추출
    //프레임마다 연결 정보를 조회하지 않도록
    try {
      this.connections = PoseLandmarker.POSE_CONNECTIONS.map((conn) => [conn.start, conn.end]);
    } catch (error) {
      // POSE_CONNECTIONS가 없을 경우 수동 연결로 대체
      console.warn('POSE_CONNECTIONS not available, using manual connections', error);
      this.connections = this.getManualConnections();
    }
  }

  render(landmarks: ReadonlyArray<Landmark2D> | null, options: RenderOptions): void {
    if (!this.context) return;

    const { width, height, mirrorMode = this.config.mirrorMode } = options;

    // 캔버스 크기 일치
    if (this.context.canvas.width !== width) {
      this.context.canvas.width = width;
    }
    if (this.context.canvas.height !== height) {
      this.context.canvas.height = height;
    }

    this.context.save();

    // 배경 초기화
    this.context.fillStyle = this.config.backgroundColor;
    this.context.fillRect(0, 0, width, height);

    // 랜드마크가 없으면 빈 배경만 표시
    if (!landmarks || landmarks.length === 0) {
      this.context.restore();
      return;
    }

    // 미러 모드를 적용
    if (mirrorMode) {
      this.context.translate(width, 0);
      this.context.scale(-1, 1);
    }

    // 연결 선을 그림
    this.drawConnections(landmarks, width, height);

    // 키포인트 그림
    if (this.config.showPoints) {
      this.drawKeypoints(landmarks, width, height);
    }

    this.context.restore();
  }

  private drawConnections(
    landmarks: ReadonlyArray<Landmark2D>,
    width: number,
    height: number,
  ): void {
    if (!this.context) return;

    this.context.strokeStyle = this.config.lineColor;
    this.context.lineWidth = this.config.lineWidth;
    this.context.lineCap = 'round';
    this.context.lineJoin = 'round';

    for (const [startIdx, endIdx] of this.connections) {
      const startLandmark = landmarks[startIdx];
      const endLandmark = landmarks[endIdx];

      // 가시성 충분하지 않으면 패스
      if (
        !startLandmark ||
        !endLandmark ||
        (startLandmark.visibility ?? 1) < this.config.visibilityThreshold ||
        (endLandmark.visibility ?? 1) < this.config.visibilityThreshold
      ) {
        continue;
      }

      const start = toCanvasPoint(startLandmark, width, height);
      const end = toCanvasPoint(endLandmark, width, height);

      if (!start || !end) continue;

      this.context.beginPath();
      this.context.moveTo(start.x, start.y);
      this.context.lineTo(end.x, end.y);
      this.context.stroke();
    }
  }

  private drawKeypoints(landmarks: ReadonlyArray<Landmark2D>, width: number, height: number): void {
    if (!this.context) return;

    this.context.fillStyle = this.config.pointColor;

    for (const landmark of landmarks) {
      // 가시성이 충분하지 않으면 패스
      if ((landmark.visibility ?? 1) < this.config.visibilityThreshold) {
        continue;
      }

      const point = toCanvasPoint(landmark, width, height);
      if (!point) continue;

      this.context.beginPath();
      this.context.arc(point.x, point.y, this.config.pointRadius, 0, Math.PI * 2);
      this.context.fill();
    }
  }

  /**
   * MediaPipe Pose 모델 기준 수동 연결 목록
   * 총 33개 랜드마크를 대상
   */
  private getManualConnections(): ReadonlyArray<[number, number]> {
    return [
      // 얼굴
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 7],
      [0, 4],
      [4, 5],
      [5, 6],
      [6, 8],
      // 몸통
      [9, 10],
      [11, 12],
      [11, 13],
      [13, 15],
      [12, 14],
      [14, 16],
      [11, 23],
      [12, 24],
      [23, 24],
      // 왼팔
      [15, 17],
      [17, 19],
      [19, 21],
      [15, 21],
      // 오른팔
      [16, 18],
      [18, 20],
      [20, 22],
      [16, 22],
      // 왼다리
      [23, 25],
      [25, 27],
      [27, 29],
      [29, 31],
      [27, 31],
      // 오른다리
      [24, 26],
      [26, 28],
      [28, 30],
      [30, 32],
      [28, 32],
    ];
  }

  destroy(): void {
    this.context = null;
  }
}
