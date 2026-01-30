export const STRETCHING_SESSION_MESSAGES = {
  OVERLAY: {
    TIME_REMAINING: '남은 시간',
    REPS_COUNT: '카운트',
    SUCCESS_COUNT: '성공 카운트',
    ACCURACY: '정확도',
  },
  RESULT: {
    TITLE: '스트레칭 결과',
    PROCESSING: '결과 처리 중...',
    SESSION_ID: '세션 ID',
    COMPLETED: '완료 여부',
    EARNED_EXP: '획득 경험치',
    EARNED_STATUS_SCORE: '획득 상태 점수',
    CHARACTER: '캐릭터',
    QUESTS: '퀘스트',
    COMPLETED_YES: '완료',
    COMPLETED_NO: '미완료',
    CHARACTER_FIELDS: {
      LEVEL: '레벨',
      EXP: '경험치',
      STREAK: '연속',
      STATUS_SCORE: '상태 점수',
    },
  },
  STATUS: {
    LOADING: '로딩 중...',
    RESULT_PENDING: '판정 중',
    RESULT_SUCCESS: '성공',
    RESULT_FAIL: '실패',
  },
} as const;
