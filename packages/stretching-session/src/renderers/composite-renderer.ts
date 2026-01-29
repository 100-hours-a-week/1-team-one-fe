/**
 * 합성 렌더러 -여러 렌더러를 레이어로 결합
 *
 * 여러 시각화 모드를 순차적으로 렌더링
 * ex. VideoRenderer+ KeypointsRenderer
 *
 */

import type { Landmark2D } from '@repo/stretching-accuracy';
import type { Renderer, RenderContext, RenderOptions } from './renderer-base';

export class CompositeRenderer implements Renderer {
  private renderers: Renderer[];

  /**
   * 합성 렌더러 생성
   *
   * @param renderers - 결합할 렌더러 배열 - 순서
   */
  constructor(renderers: Renderer[]) {
    if (renderers.length === 0) {
      throw new Error('CompositeRenderer requires at least one renderer');
    }
    this.renderers = renderers;
  }

  init(context: RenderContext): void {
    // 모든 하위 렌더러 초기화
    for (const renderer of this.renderers) {
      renderer.init(context);
    }
  }

  render(landmarks: ReadonlyArray<Landmark2D> | null, options: RenderOptions): void {
    // 모든 레이어 순서대로 렌더링
    for (const renderer of this.renderers) {
      renderer.render(landmarks, options);
    }
  }

  destroy(): void {
    // 모든 하위 렌더러를 정리
    for (const renderer of this.renderers) {
      renderer.destroy();
    }
    this.renderers = [];
  }
}
