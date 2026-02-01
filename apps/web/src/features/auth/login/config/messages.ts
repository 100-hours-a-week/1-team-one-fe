export const LOGIN_FORM_MESSAGES = {
  FIELD: {
    EMAIL_LABEL: '이메일',
    EMAIL_PLACEHOLDER: '이메일을 입력해주세요',
    PASSWORD_LABEL: '비밀번호',
    PASSWORD_PLACEHOLDER: '비밀번호를 입력해주세요',
  },
  ERROR: {
    EMAIL_REQUIRED: '이메일은 필수입니다.',
    EMAIL_INVALID: '올바른 이메일 형식을 입력해주세요.',
    PASSWORD_REQUIRED: '비밀번호는 필수 값입니다.',
    PASSWORD_MIN_LENGTH: '비밀번호는 최소 6자 이상이어야 합니다.',
    PASSWORD_RULE: '비밀번호는 대문자, 소문자, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.',
    INVALID_CREDENTIALS: '유효하지 않은 이메일 또는 비밀번호입니다.',
    RETRY_LATER: '잠시 후 다시 시도해 주세요.',
  },
  BUTTON: {
    SUBMIT: '로그인 하기',
  },
} as const;
