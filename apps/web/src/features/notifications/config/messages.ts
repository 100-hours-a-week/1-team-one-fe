export const NOTIFICATIONS_MESSAGES = {
  HEADER: {
    TITLE: '알림 로그',
    BACK_LABEL: '뒤로가기',
  },
  STATUS: {
    UNREAD: '미확인',
    READ: '읽음',
  },
  LIST: {
    EMPTY: '아직 정보가 없습니다',
    LOADING: '불러오는 중...',
    FETCHING_MORE: '추가 알림 불러오는 중...',
    ERROR: '알림을 불러오지 못했습니다.',
    WARNING: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
  },
  META: {
    DETAILS_EMPTY: '-',
  },
  ACTIONS: {
    SCROLL_TOP: '위로가기',
  },
} as const;
