export const MOMENTS_POST_FORM_MESSAGES = {
  TITLE: {
    PLACEHOLDER: '제목',
    REQUIRED: '제목을 입력해주세요.',
    MAX_LENGTH: '제목은 최대 50자까지 입력할 수 있어요.',
  },
  CONTENT: {
    PLACEHOLDER: '본문을 입력해주세요',
    REQUIRED: '본문을 입력해주세요.',
    MAX_LENGTH: '본문은 최대 500자까지 입력할 수 있어요.',
  },
  TAGS: {
    MAX_COUNT: '태그는 최대 5개까지 추가할 수 있어요.',
  },
  TOAST: {
    VALIDATION_ERROR: '입력 내용을 확인해주세요.',
  },
} as const;
