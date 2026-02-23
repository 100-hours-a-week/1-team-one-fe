import { create } from 'zustand';

import { LOADING_CONFIG } from '@/src/shared/config/loading';

interface LoadingState {
  /** 로딩 키별 ref-count 맵 */
  loadingKeys: Map<string, number>;
  /** 지연 표시용 타이머 id */
  showTimers: Map<string, NodeJS.Timeout>;
  /** 최소 유지 시간용 타이머 id */
  minDurationTimers: Map<string, NodeJS.Timeout>;
  /** 로딩 ui 노출 여부 */
  isVisible: boolean;
}

interface LoadingStore extends LoadingState {
  _startLoading: (key: string) => void;
  _endLoading: (key: string) => void;
  _setVisible: (visible: boolean) => void;
}

/**
 * 전역 로딩 상태
 * ref-count 기반 로딩 키를 지연/최소 유지 시간과 함께 관리
 */
//TODO: 추후 비동기 작업 상태와 충돌하지 않는지 확인
const useLoadingStore = create<LoadingStore>((set, get) => ({
  loadingKeys: new Map(),
  showTimers: new Map(),
  minDurationTimers: new Map(),
  isVisible: false,

  _startLoading: (key: string) => {
    const state = get();
    const newKeys = new Map(state.loadingKeys);
    const currentCount = newKeys.get(key) ?? 0;
    newKeys.set(key, currentCount + 1);

    //최초 참조일 때만 딜레이 타이머 시작
    if (currentCount === 0) {
      const newShowTimers = new Map(state.showTimers);
      const timerId = setTimeout(() => {
        set({ isVisible: true });
        get().showTimers.delete(key);
      }, LOADING_CONFIG.DEFAULT_DELAY);
      newShowTimers.set(key, timerId);
      set({ showTimers: newShowTimers });
    }

    set({ loadingKeys: newKeys });
  },

  _endLoading: (key: string) => {
    const state = get();
    const newKeys = new Map(state.loadingKeys);
    const currentCount = newKeys.get(key) ?? 0;

    if (currentCount <= 0) {
      return;
    }

    const newCount = currentCount - 1;

    if (newCount === 0) {
      newKeys.delete(key);

      //대기 중인 표시 타이머가 있으면 정리
      const showTimer = state.showTimers.get(key);
      if (showTimer) {
        clearTimeout(showTimer);
        const newShowTimers = new Map(state.showTimers);
        newShowTimers.delete(key);
        set({ showTimers: newShowTimers });
      }

      //표시 중이면 최소 유지 시간 보장
      if (state.isVisible) {
        const newMinTimers = new Map(state.minDurationTimers);
        const timerId = setTimeout(() => {
          //모든 로딩 키가 해제됐는지 확인
          if (get().loadingKeys.size === 0) {
            set({ isVisible: false });
          }
          get().minDurationTimers.delete(key);
        }, LOADING_CONFIG.MIN_DURATION);
        newMinTimers.set(key, timerId);
        set({ minDurationTimers: newMinTimers });
      } else {
        //아직 보이지 않았다면 즉시 숨김 처리 여부 확인
        if (newKeys.size === 0) {
          set({ isVisible: false });
        }
      }
    } else {
      newKeys.set(key, newCount);
    }

    set({ loadingKeys: newKeys });
  },

  _setVisible: (visible: boolean) => {
    set({ isVisible: visible });
  },
}));

/**
 * 전역 로딩 컨트롤러 싱글톤
 * ref-count 및 타이밍 정책으로 로딩 상태를 관리
 */
const _GlobalLoadingController = () => ({
  /**
   * 특정 키의 로딩 시작
   * 여러 번 호출되면 ref-count 증가
   */
  start(key: string): void {
    useLoadingStore.getState()._startLoading(key);
  },

  /**
   * 특정 키의 로딩 종료
   * ref-count 감소, 0이 되면 숨김
   */
  end(key: string): void {
    useLoadingStore.getState()._endLoading(key);
  },

  /**
   * promise 실행 전후로 로딩 상태를 감싸기
   * 시작 종료를 자동 처리
   */
  async withLoading<T>(key: string, promise: Promise<T>): Promise<T> {
    try {
      this.start(key);
      return await promise;
    } finally {
      this.end(key);
    }
  },

  /**
   * 현재 로딩 상태 조회
   */
  _getState(): LoadingState {
    const state = useLoadingStore.getState();
    return {
      loadingKeys: state.loadingKeys,
      showTimers: state.showTimers,
      minDurationTimers: state.minDurationTimers,
      isVisible: state.isVisible,
    };
  },
});

export const GlobalLoadingController = _GlobalLoadingController();
export { useLoadingStore };
