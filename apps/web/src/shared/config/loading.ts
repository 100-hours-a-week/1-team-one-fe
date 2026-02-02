/**
 * 전역 로딩 컨트롤러,스켈레톤,바운더리에서 사용
 */
export const LOADING_CONFIG = {
  /** 로딩 UI 표시 전 기본 딜레이->짧은 작업 플리커 방지 */
  DEFAULT_DELAY: 200,
  /** 표시 시작 후 최소 유지 시간(플리커 방지) */
  MIN_DURATION: 200,
  /** 상단 프로그레스 바 px */
  TOP_PROGRESS_HEIGHT: 3,
  Z_INDEX: 9999,
} as const;
