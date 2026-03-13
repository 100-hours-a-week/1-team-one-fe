export const STATS_REACTION_SPEED_MESSAGES = {
  HEADER: {
    TITLE: '반응 속도 챌린지',
    DESCRIPTION: '알람 후 얼마나 빨리 시작했나요?',
  },
  FILTER: {
    WEEKLY: '이번주',
    MONTHLY: '이번달',
    TOTAL: '전체',
  },
  LABELS: {
    AVERAGE_SPEED: '평균 반응 시간',
    RANK: '전체 사용자 중 순위',
    SLOW: '느림',
    NORMAL: '보통',
    FAST: '빠름',
  },
  BADGE: {
    PREFIX: '상위',
    FAST: '빠른 반응 속도!',
    NORMAL: '안정적인 반응 속도!',
    SLOW: '반응 속도를 더 높여봐요!',
    EMPTY_TITLE: '데이터 수집 중',
    EMPTY_SUBTITLE: '챌린지를 시작해 보세요',
  },
  UNITS: {
    MINUTE: '분',
    PERCENT: '%',
  },
  PLACEHOLDER: {
    EMPTY_VALUE: '-',
  },
  STATE: {
    UNEXPECTED_ERROR: '반응 속도 정보를 불러오지 못했어요.',
  },
} as const;
