/**
 * WebGazer npm 패키지 최소 타입 선언
 *
 * @repo/eye-stretching-session/hook 에서 `import('webgazer')` dynamic import 시 타입 해석에 사용.
 * 실제 WebGazer API 중 이 프로젝트에서 사용하는 메서드만 선언한다.
 */
declare module 'webgazer' {
  interface WebGazer {
    setGazeListener(listener: (data: { x: number; y: number } | null) => void): WebGazer;
    showPredictionPoints(show: boolean): WebGazer;
    showVideo(show: boolean): WebGazer;
    showFaceOverlay(show: boolean): WebGazer;
    showFaceFeedbackBox(show: boolean): WebGazer;
    recordScreenPosition(x: number, y: number, eventType?: string): WebGazer;
    clearData(): void;
    begin(): void;
    end(): void;
  }

  const webgazer: WebGazer;
  export default webgazer;
}
