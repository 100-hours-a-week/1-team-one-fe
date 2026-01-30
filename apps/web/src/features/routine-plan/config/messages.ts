export const ROUTINE_PLAN_MESSAGES = {
  LOADING: {
    INITIAL: '루틴을 불러오는 중...',
    GENERATING: '개인 맞춤 루틴을 생성하고 있어요',
    GENERATING_DETAIL: '잠시만 기다려 주세요. 곧 완료됩니다.',
  },
  ERROR: {
    FETCH_FAILED: '루틴을 불러올 수 없습니다',
    RETRY: '다시 시도',
  },
  EMPTY: {
    NO_EXERCISES: '아직 생성된 루틴이 없습니다',
    ACTION: '설문 작성하기',
  },
  SURVEY_EDIT: {
    BUTTON: '설문 다시 작성',
  },
  EXERCISE: {
    REASON_LABEL: '추천 이유',
  },
} as const;
