/**
 * 전역 로딩 노출 상태 조회
 * 로딩 상태에 반응해야 하는 컴포넌트에서 사용
 */
import { useLoadingStore } from './GlobalLoadingController';

export function useGlobalLoadingState(): { isVisible: boolean } {
  const isVisible = useLoadingStore((state) => state.isVisible);
  return { isVisible };
}
