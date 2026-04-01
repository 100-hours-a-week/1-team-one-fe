export const MOMENTS_CREATE_MESSAGES = {
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
    LABEL: '태그',
    HELPER: '스페이스바를 눌러 태그를 추가하세요. (최대 5개)',
    MAX_COUNT: '태그는 최대 5개까지 추가할 수 있어요.',
  },
  IMAGE: {
    LABEL: '이미지',
  },
  BUTTON: {
    SUBMIT: '저장',
  },
  TOAST: {
    VALIDATION_ERROR: '입력 내용을 확인해주세요.',
    CREATE_SUCCESS: '게시글이 저장되었습니다.',
    CREATE_ERROR: '게시글 저장에 실패했습니다. 다시 시도해주세요.',
    IMAGE_UPLOAD_ERROR: '이미지 업로드에 실패했습니다. 다시 시도해주세요.',
  },
} as const;
