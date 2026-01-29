export const ERROR_MESSAGES = {
  NOT_FOUND: {
    TITLE: '페이지를 찾을 수 없어요',
    DESCRIPTION: '요청하신 페이지가 이동되었거나 삭제되었을 수 있어요.',
    ACTIONS: {
      PRIMARY: '이전 페이지',
      SECONDARY: '홈으로 이동',
    },
  },
  SERVER_ERROR: {
    TITLE: '일시적인 오류가 발생했어요',
    DESCRIPTION: '잠시 후 다시 시도해 주세요.',
    ACTIONS: {
      PRIMARY: '다시시도',
      SECONDARY: '홈으로 이동',
    },
  },
  UNEXPECTED: {
    TITLE: '문제가 발생했어요',
    DESCRIPTION: '불편을 드려 죄송합니다. 다시 시도해 주세요.',
    ACTIONS: {
      PRIMARY: '홈으로 이동',
    },
  },
} as const;
