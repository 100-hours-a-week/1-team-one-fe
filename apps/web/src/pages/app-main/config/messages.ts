export const APP_MAIN_MESSAGES = {
  CHARACTER_IMAGE_ALT: '캐릭터 상태 이미지',
  STATUS_SCORE: {
    LABEL: '상태 점수',
    BADGE_ARIA_LABEL: '상태 점수 안내',
    GUIDE_TITLE: '상태 점수 기준',
    GUIDE_DESCRIPTION: '점수 구간에 따라 캐릭터 상태가 달라져요!',
    GUIDE_CLOSE: '닫기',
    GUIDE_ITEMS: {
      DYING: { RANGE: '0-19', LABEL: '운동이 시급해요' },
      HUNGRY_WEAK: { RANGE: '20-39', LABEL: '좀만 더 노력해봐요!' },
      NORMAL: { RANGE: '40-59', LABEL: '보통 상태에요' },
      HEALTHY: { RANGE: '60-79', LABEL: '스트레칭을 꾸준히 했어요' },
      SUPER_HEALTHY: { RANGE: '80+', LABEL: '최고 건강한 개발자에요!' },
    },
  },
  CALENDAR: {
    LOADING: '캘린더 로딩 중...',
    ERROR: '캘린더를 불러올 수 없습니다',
  },
  ACTIONS: {
    PLAN: {
      TITLE: '플랜',
      DESCRIPTION: '어떤 스트레칭을 할지 계획해요',
    },
    NOTIFICATIONS: {
      TITLE: '알림 설정',
      DESCRIPTION: '스트레칭을 언제할지 관리해요',
    },
  },
  ACTIVE_SESSION: {
    TITLE: '진행 중인 스트레칭',
    DESCRIPTION: '지금 바로 스트레칭 하고 건강을 챙겨보세요!',
    CTA: '이어하기',
    EMPTY: '진행 중인 스트레칭이 없어요!',
  },
} as const;
