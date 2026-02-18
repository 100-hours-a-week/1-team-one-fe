export const TAG_VALIDATION = {
  MAX_LENGTH: 10,
  MAX_TAGS: 5,
} as const;

/**
 * 허용 문자: 영문, 숫자, 한글, _
 */
const KOREAN = '\uAC00-\uD7A3\u1100-\u11FF\u3131-\u318E';

export const ALLOWED_CHARS = new RegExp(`^[a-zA-Z0-9_${KOREAN}]*$`);

/**
 * 태그: 중간에만 언더스코어 허용
 */
export const VALID_TAG = /^[a-zA-Z0-9가-힣]([a-zA-Z0-9가-힣_]{0,8}[a-zA-Z0-9가-힣])?$/;
