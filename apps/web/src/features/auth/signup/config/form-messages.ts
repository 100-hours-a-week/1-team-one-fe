export const FORM_MESSAGES = {
  FIELD: {
    PROFILE_IMAGE_LABEL: '프로필 이미지',
    PROFILE_IMAGE_HELPER: 'jpg, jpeg, png, gif, webp, heic, heif (최대 10MB)',
    PROFILE_IMAGE_CLEAR: '이미지 삭제',
    PROFILE_IMAGE_CLEAR_ARIA: '프로필 이미지 삭제',
  },
  ERROR: {
    SIGNUP_FAILED: '회원가입에 실패했습니다. 다시 시도해주세요.',
    EMAIL_DUP_CHECK_REQUIRED: '이메일 중복 확인이 필요합니다.',
    EMAIL_UNAVAILABLE: '이미 사용 중인 이메일입니다.',
    EMAIL_DUP_CHECK_FAILED: '중복 확인에 실패했습니다. 다시 시도해주세요.',
    NICKNAME_DUP_CHECK_REQUIRED: '닉네임 중복 확인이 필요합니다.',
    NICKNAME_UNAVAILABLE: '이미 사용 중인 닉네임입니다.',
    NICKNAME_DUP_CHECK_FAILED: '중복 확인에 실패했습니다. 다시 시도해주세요.',
    PROFILE_IMAGE_UPLOAD_FAILED: '프로필 이미지 업로드에 실패했습니다. 다시 시도해주세요.',
    PROFILE_IMAGE_UPLOAD_FAILED_WITH_STATUS:
      '프로필 이미지 업로드에 실패했습니다. (상태 코드: {status})',
    PROFILE_IMAGE_UPLOAD_STATUS_UNKNOWN: '알 수 없음',
  },
} as const;

export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: '이메일을 입력해 주세요.',
  EMAIL_INVALID: '올바른 이메일 주소 형식을 입력해 주세요. (예: example@example.com)',
  EMAIL_CHARSET: '이메일은 영문/숫자와 @, . 만 사용할 수 있어요.',
  EMAIL_MAX: '이메일은 최대 254자까지 입력할 수 있어요.',

  NICKNAME_REQUIRED: '닉네임을 입력해 주세요.',
  NICKNAME_MAX: '닉네임은 최대 10자까지 작성 가능합니다.',
  NICKNAME_NO_SPACE: '띄어쓰기를 없애주세요.',
  NICKNAME_ONLY_KO_EN: '닉네임에는 영문과 한글만 사용 가능합니다.',

  PASSWORD_REQUIRED: '비밀번호를 입력해주세요.',
  PASSWORD_RULE: '비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 포함해야 합니다.',
  PASSWORD_CONFIRM_REQUIRED: '비밀번호를 한 번 더 입력해 주세요.',
  PASSWORD_MISMATCH: '비밀번호가 일치하지 않습니다.',

  PROFILE_IMAGE_TOO_LARGE: '이미지 크기가 너무 큽니다. ( 최대 10MB )',
  PROFILE_IMAGE_INVALID_EXT: '지원하지 않는 이미지 형식입니다.',
} as const;
