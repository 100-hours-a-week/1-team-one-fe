/**
 * 기본 렌더러 인터페이스 (strategy pattern)
 *
 * 핵심 세션 로직을 수정하지 않고 시각화 모드를 교체할 수 있도록
 * 모든 렌더러 구현은 인터페이스를 준수해야 함
 */

import type { Landmark2D } from '@repo/stretching-accuracy';

/**
 * 모든 렌더러가 공유하는 렌더링 컨텍스트
 */
export type RenderContext = {
  canvas: HTMLCanvasElement;
  video: HTMLVideoElement;
};

/**
 * 프레임별 렌더링 옵션
 */
export type RenderOptions = {
  width: number;
  height: number;
  mirrorMode?: boolean;
};

/**
 * 기본 렌더러 인터페이스
 *
 * 라이프사이클
 * 1. init() - 렌더러 생성 시 1회 호출(색상 파싱, 상태 초기화)
 * 2. render() - 프레임마다 호출(캔버스에 그리기)
 * 3. destroy() - 정리 단계에서 호출(리소스 해제)
 */
export interface Renderer {
  /**
   * 렌더러 초기화
   *
   * 설정 단계에서 1회 호출
   * - 색상 파싱 및 캐싱
   * - 내부 상태 설정
   * - MediaPipe 연결 정보 추출
   *
   * @param context - 공유 렌더링 컨텍스트(canvas, video)
   */
  init(context: RenderContext): void;

  /**
   * 단일 프레임을 렌더링
   *
   * 프레임마다 호출 (session frameIntervalMs에 따라 스로틀 가능)
   *
   * @param landmarks - 감지된 포즈 랜드마크(포즈 없으면 null)
   * @param options - 프레임별 렌더링 옵션
   */
  render(landmarks: ReadonlyArray<Landmark2D> | null, options: RenderOptions): void;

  /**
   * 리소스 정리
   * 렌더러가 더 이상 필요하지 않을 때 호출
   * 리소스 해제, 대기 중 작업 취소
   */
  destroy(): void;
}
