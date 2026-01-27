export const FORM_MESSAGES = {
  ERROR: {
    INTERVAL_MIN: '알림 간격은 최소 10분입니다.',
    INTERVAL_MAX: '알림 간격은 최대 600분입니다.',
    ACTIVE_TIME_INVALID: '종료 시간은 시작 시간보다 늦어야 합니다.',
    FOCUS_TIME_INVALID: '집중 종료 시간은 집중 시작 시간보다 늦어야 합니다.',
    FOCUS_OUT_OF_RANGE: '집중 시간은 활동 시간 범위 내에 있어야 합니다.',
    FOCUS_BOTH_REQUIRED: '집중 시작 시간과 종료 시간을 모두 입력해주세요.',
    WEEKDAYS_REQUIRED: '최소 1개 이상의 요일을 선택해주세요.',
    TIME_FORMAT: '올바른 시간 형식이 아닙니다. (HH:mm)',
    DATE_TIME_FORMAT: '올바른 날짜/시간 형식이 아닙니다. (YYYY-MM-DDTHH:mm)',
    SUBMIT_FAILED: '알림 설정 저장에 실패했습니다. 다시 시도해주세요.',
  },
} as const;
