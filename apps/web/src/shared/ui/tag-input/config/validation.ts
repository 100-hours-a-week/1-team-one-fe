export const TAG_VALIDATION = {
  MAX_LENGTH: 10,
  MAX_TAGS: 5,
} as const;

/**
 * 허용 문자: 영문, 숫자, 한글, _
 */
export const ALLOWED_CHARS = /^[a-zA-Z0-9가-힣ㄱ-ㅣ_]*$/;

/**
 * 태그: 중간에만 언더스코어 허용
 */
export const VALID_TAG = /^[a-zA-Z0-9가-힣]([a-zA-Z0-9가-힣_]{0,8}[a-zA-Z0-9가-힣])?$/;
