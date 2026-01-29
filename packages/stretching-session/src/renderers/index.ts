/**
 * 렌더러 팩토리 for 시각화 패턴
 *
 * 렌더러 생성 로직을 관리
 * - 'video': 카메라 영상만 표시
 * - 'keypoints': mediapipe 스켈레톤만 표시
 * - 'video-keypoints': 카메라 +스켈레톤 오버레이
 * - 'silhouette': 실루엣
 *
 */

import { CompositeRenderer } from './composite-renderer';
import { KeypointsRenderer, type KeypointsConfig } from './keypoints-renderer';
import type { Renderer } from './renderer-base';
import { SilhouetteRenderer, type SilhouetteConfig } from './silhouette-renderer';
import { VideoRenderer } from './video-renderer';

export type VisualizationMode = 'video' | 'keypoints' | 'video-keypoints' | 'silhouette';

export type RendererConfig =
  | {
      mode: 'video';
    }
  | {
      mode: 'keypoints';
      keypoints?: KeypointsConfig;
    }
  | {
      mode: 'video-keypoints';
      keypoints?: KeypointsConfig;
    }
  | {
      mode: 'silhouette';
      silhouette: SilhouetteConfig;
    };

type RendererFactory = (config: RendererConfig) => Renderer;

/**
 * 모드별 렌더러 팩토리
 */
const RENDERER_FACTORY: Record<VisualizationMode, RendererFactory> = {
  video: () => new VideoRenderer(),

  keypoints: (config) => {
    const keypointsConfig = config.mode === 'keypoints' ? config.keypoints : undefined;
    return new KeypointsRenderer(keypointsConfig);
  },

  'video-keypoints': (config) => {
    const keypointsConfig = config.mode === 'video-keypoints' ? config.keypoints : undefined;
    return new CompositeRenderer([new VideoRenderer(), new KeypointsRenderer(keypointsConfig)]);
  },

  silhouette: (config) => {
    if (config.mode !== 'silhouette') {
      throw new Error('Invalid silhouette config');
    }
    return new SilhouetteRenderer(config.silhouette);
  },
};

/**
 * 알 수 없는 모드를 위한 폴백 렌더러입니다.
 *
 * TODO: Snetry 로 로깅 전송
 */
class FallbackRenderer implements Renderer {
  private mode: string;

  constructor(mode: string) {
    this.mode = mode;
  }

  init(): void {
    console.error(`[FallbackRenderer] Unknown visualization mode: ${this.mode}`);
    // TODO: sentry에 태그와 함께 보고
  }

  render(): void {
    // 별도 동작 없이 빈 캔버스만 표시합니다.
  }

  destroy(): void {
    // 별도 처리를 하지 않습니다.
  }
}

/**
 * 구성에 따라 렌더러를 생성
 *
 * @param config - 모드 및 모드별 옵션을 포함한 렌더러 구성
 * @returns 렌더러 인스턴스
 */
export function createRenderer(config: RendererConfig): Renderer {
  const factory = RENDERER_FACTORY[config.mode];

  if (!factory) {
    console.warn(`Unknown renderer mode: ${config.mode}, using fallback`);
    return new FallbackRenderer(config.mode);
  }

  return factory(config);
}

export type { Renderer, RenderContext, RenderOptions } from './renderer-base';
export type { KeypointsConfig } from './keypoints-renderer';
export type { SilhouetteConfig } from './silhouette-renderer';
export { VideoRenderer } from './video-renderer';
export { KeypointsRenderer } from './keypoints-renderer';
export { SilhouetteRenderer } from './silhouette-renderer';
export { CompositeRenderer } from './composite-renderer';
