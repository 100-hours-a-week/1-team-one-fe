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
  /** 마우스 click/mousemove 기반 암시적 학습 리스너 제거 */
  removeMouseEventListeners: () => WebGazerInstance;
  /** 내부 regression 모델 배열 반환 */
  getRegression: () => WebGazerRegressionModel[];
  /** WebGazer 내부 설정 */
  params: {
    /** localStorage에 이전 세션 학습 데이터 저장/로드 여부 (기본: true) */
    saveDataAcrossSessions: boolean;
    [key: string]: unknown;
  };
  /** 실제로는 Promise를 반환하지만 WebGazer 타입 선언이 void로 되어 있음 */
  begin: () => Promise<WebGazerInstance>;
  end: () => void;
};

/** WebGazer 내부 regression 모델 최소 인터페이스 */
type WebGazerRegressionModel = {
  addData: (eyes: unknown, screenPos: unknown, type: string) => void;
  [key: string]: unknown;
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

  // seed click 재시도 타이머 (gaze 콜백이 최초 발생하면 즉시 해제)
  let seedTimer: ReturnType<typeof setInterval> | null = null;

  return {
    start: async () => {
      // 이전 세션의 마우스 기반 오염 데이터가 localStorage에서 로드되지 않도록 차단
      webgazer.params.saveDataAcrossSessions = false;

      webgazer
        .showPredictionPoints(showPredictionPoints)
        .showVideo(showVideo)
        .showFaceOverlay(showFaceOverlay)
        .showFaceFeedbackBox(showFaceFeedbackBox);

      await webgazer.begin();
      webgazer.removeMouseEventListeners();

      // 'move' 차단 패치 제거됨:
      // 이전에는 마우스 trail 오염 방지를 위해 addData('move')를 차단했으나,
      // 이제 프로그래밍 방식으로 'move' (보간 trail)와 'click' (keyFrame 정확 좌표)을
      // 구분하여 주입한다. removeMouseEventListeners()로 실제 마우스 이벤트는 이미 차단됨.

      // 부트스트랩: 뷰포트 중앙에 seed click 데이터 주입.
      //
      // WebGazer predict()는 eyeFeaturesClicks.length === 0 이면 null을 반환한다.
      // click 데이터가 없으면 → predict null → gaze callback 미호출 →
      // 우리 calibrate 코드 미실행 → 영원히 데이터 없음 (치킨-에그 문제).
      //
      // 문제: begin() resolve 시점에 latestEyeFeatures가 아직 null일 수 있다.
      // WebGazer 내부 recordScreenPosition은 latestEyeFeatures가 null이면
      // 데이터를 기록하지 않고 조용히 무시한다.
      // (getPupilFeatures가 첫 프레임에서 얼굴 인식 실패 시 null 반환)
      //
      // 해결: 200ms 간격으로 seed click을 재시도하고,
      // gaze 콜백이 최초 발생하면 (predict()가 non-null 반환 = seed 성공)
      // 즉시 재시도를 중단한다.
      const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      const centerX = Math.round(vw * 0.5);
      const centerY = Math.round(vh * 0.5);

      webgazer.recordScreenPosition(centerX, centerY, 'click');
      console.debug('[webgazer-tracker] seed: immediate attempt', { centerX, centerY });

      let seedAttempt = 0;
      seedTimer = setInterval(() => {
        seedAttempt += 1;
        webgazer.recordScreenPosition(centerX, centerY, 'click');
        console.debug(`[webgazer-tracker] seed: retry #${seedAttempt}`);
      }, 200);
    },

    stop: () => {
      if (seedTimer) {
        clearInterval(seedTimer);
        seedTimer = null;
      }
      webgazer.end();
    },

    onGaze: (callback) => {
      let gazeCallCount = 0;
      webgazer.setGazeListener((data) => {
        gazeCallCount += 1;
        if (gazeCallCount <= 5 || gazeCallCount % 100 === 0) {
          console.debug(`[webgazer-tracker] gazeListener #${gazeCallCount}`, {
            hasData: !!data,
            data: data ? { x: Math.round(data.x), y: Math.round(data.y) } : null,
            seedTimerActive: !!seedTimer,
          });
        }
        if (!data) return;

        // non-null gaze 데이터 수신 = predict() 성공 = seed 완료
        if (seedTimer) {
          console.debug('[webgazer-tracker] seed SUCCESS — clearing timer');
          clearInterval(seedTimer);
          seedTimer = null;
        }
        callback(data);
      });
    },

    calibrate: (pixelX, pixelY, eventType = 'click') => {
      webgazer.recordScreenPosition(pixelX, pixelY, eventType);
    },
  };
}
