/**
 * @file webgazer-tracker.ts
 * @description WebGazer용 EyeTracker 어댑터
 *
 * 패키지 자체는 WebGazer에 의존하지 않는다.
 * 소비자(hook)가 npm dynamic import 등으로 로드한 WebGazer 인스턴스를
 * 이 팩토리에 넘기면, EyeTracker 인터페이스에 맞는 객체를 반환한다.
 *
 * @example
 * // apps/web hook 레벨
 * const webgazer = (await import('webgazer')).default;
 * const tracker = createWebGazerTracker(webgazer);
 * const session = createEyeSession({ tracker, ... });
 */

import type { EyeTracker, GazePrediction } from '../session/create-eye-session';

// ═══════════════════════════════════════════════════════════════════════════
// WebGazer 최소 인터페이스 (npm 패키지 또는 전역 객체 모두 호환)
// ═══════════════════════════════════════════════════════════════════════════

export type WebGazerInstance = {
  setGazeListener: (listener: (data: GazePrediction | null) => void) => WebGazerInstance;
  showPredictionPoints: (show: boolean) => WebGazerInstance;
  showVideo: (show: boolean) => WebGazerInstance;
  showFaceOverlay: (show: boolean) => WebGazerInstance;
  showFaceFeedbackBox: (show: boolean) => WebGazerInstance;
  /** ridge regression 모델에 캘리브레이션 데이터 주입 (pixel 좌표) */
  recordScreenPosition: (x: number, y: number, eventType?: string) => WebGazerInstance;
  /** 캘리브레이션 데이터 초기화 */
  clearData: () => void;
  begin: () => void;
  end: () => void;
};

export type WebGazerTrackerOptions = {
  /** 예측 포인트 표시 여부 (기본: false) */
  showPredictionPoints?: boolean;
  /** 비디오 피드 표시 여부 (기본: false) */
  showVideo?: boolean;
  /** 얼굴 오버레이 표시 여부 (기본: false) */
  showFaceOverlay?: boolean;
  /** 얼굴 피드백 박스 표시 여부 (기본: false) */
  showFaceFeedbackBox?: boolean;
};

// ═══════════════════════════════════════════════════════════════════════════
// 팩토리
// ═══════════════════════════════════════════════════════════════════════════

export function createWebGazerTracker(
  webgazer: WebGazerInstance,
  options?: WebGazerTrackerOptions,
): EyeTracker {
  const {
    showPredictionPoints = false,
    showVideo = false,
    showFaceOverlay = false,
    showFaceFeedbackBox = false,
  } = options ?? {};

  return {
    start: () => {
      webgazer
        .showPredictionPoints(showPredictionPoints)
        .showVideo(showVideo)
        .showFaceOverlay(showFaceOverlay)
        .showFaceFeedbackBox(showFaceFeedbackBox);
      webgazer.begin();
    },

    stop: () => {
      webgazer.end();
    },

    onGaze: (callback) => {
      webgazer.setGazeListener((data) => {
        if (data) callback(data);
      });
    },

    calibrate: (pixelX, pixelY) => {
      webgazer.recordScreenPosition(pixelX, pixelY, 'click');
    },
  };
}
