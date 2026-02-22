export const MOMENTS_EDIT_MESSAGES = {
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
    SUBMIT: '수정',
  },
  TOAST: {
    VALIDATION_ERROR: '입력 내용을 확인해주세요.',
    UPDATE_SUCCESS: '게시글이 수정되었습니다.',
    UPDATE_ERROR: '게시글 수정에 실패했습니다. 다시 시도해주세요.',
    IMAGE_UPLOAD_ERROR: '이미지 업로드에 실패했습니다. 다시 시도해주세요.',
  },
  ERROR: {
    INVALID_POST_ID: '잘못된 게시글 ID입니다.',
    ACCESS_DENIED: '게시글 수정 권한이 없습니다.',
  },
} as const;
