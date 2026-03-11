export const LEADERBOARD_MESSAGES = {
  PANEL: {
    TITLE: '게임 리더보드',
    ERROR: '리더보드를 불러오지 못했어요.',
    EMPTY: '표시할 순위 데이터가 없어요.',
    SHARE_BUTTON: '내 점수 자랑하기',
  },
  LIST: {
    FETCHING_MORE: '순위를 더 불러오는 중...',
  },
  PODIUM: {
    TITLE: 'TOP 3',
    EMPTY: '표시할 포디움 정보가 없어요.',
    ERROR: '리더보드를 불러오지 못했어요.',
    AVATAR_ALT_SUFFIX: '프로필 이미지',
    CHAMPION_CROWN_ALT: '1위 왕관 아이콘',
    RANK_SUFFIX: '위',
    LEVEL_PREFIX: 'Lv.',
    EXP_SUFFIX: 'EXP',
    STREAK_SUFFIX: '연속',
    STREAK_UNIT: '일',
  },
  ROW: {
    RANK_SUFFIX: '위',
    MY_BADGE: '나',
    SCORE_SUFFIX: '점',
    PERCENTILE_PREFIX: '상위',
    LEVEL_PREFIX: 'Lv.',
  },
} as const;
