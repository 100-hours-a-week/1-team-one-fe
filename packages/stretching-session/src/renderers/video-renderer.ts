/**
 * 비디오 렌더러 - 원본 카메라 영상 표시
 *
 * 미러 모드를 선택적으로 적용하여 영상 스트림을 캔버스에 직접 렌더링
 * 프레임당 캔버스 연산 1회만 수행
 */

import type { Landmark2D } from '@repo/stretching-accuracy';
import type { Renderer, RenderContext, RenderOptions } from './renderer-base';

export class VideoRenderer implements Renderer {
  private context: CanvasRenderingContext2D | null = null;
  private video: HTMLVideoElement | null = null;

  init(renderContext: RenderContext): void {
    const ctx = renderContext.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Video renderer: canvas context not available');
    }

    this.context = ctx;
    this.video = renderContext.video;
  }

  render(_landmarks: ReadonlyArray<Landmark2D> | null, options: RenderOptions): void {
    if (!this.context || !this.video) return;

    const { width, height, mirrorMode = true } = options;

    // 캔버스 크기를 비디오 크기 일치
    if (this.context.canvas.width !== width) {
      this.context.canvas.width = width;
    }
    if (this.context.canvas.height !== height) {
      this.context.canvas.height = height;
    }

    this.context.save();

    // 미러 모드
    if (mirrorMode) {
      this.context.translate(width, 0);
      this.context.scale(-1, 1);
    }

    // 비디오 프레임을 캔버스에 그림
    this.context.drawImage(this.video, 0, 0, width, height);

    this.context.restore();
  }

  destroy(): void {
    this.context = null;
    this.video = null;
  }
}
