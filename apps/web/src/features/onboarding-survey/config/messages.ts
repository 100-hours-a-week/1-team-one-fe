export const SURVEY_MESSAGES = {
  TITLE: '건강 상태 설문',
  DESCRIPTION: '현재 상태에 가장 가까운 응답을 선택해 주세요.',
  BACK: '이전으로',
  NEXT: '다음으로',
  LOADING: '설문을 불러오는 중입니다.',
  SUBMITTING: `AI가 맞춤 스트레칭을 생성하고 있어요.\n잠시만 기다려주세요!`,
  ERROR: '설문을 불러오지 못했습니다.',
  EMPTY: '표시할 설문이 없습니다.',
  QUESTION_HELPER: '아래 항목 중 하나만 선택해주세요',
  PROGRESS_ARIA_LABEL: '설문 진행도',
  TOAST: {
    SUBMIT_SUCCESS: '요청이 성공했습니다.',
    SERVER_ERROR: '서버 오류가 발생했습니다. 불편을 드려 죄송합니다. 한번만 다시 시도해주세요!',
  },
} as const;
