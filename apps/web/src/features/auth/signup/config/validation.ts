export const VALIDATION_RULES = {
  EMAIL_MAX_LENGTH: 254,
  NICKNAME_MAX_LENGTH: 10,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 16,
  PROFILE_IMAGE_MAX_BYTES: 10 * 1024 * 1024, // 10MB
  PROFILE_IMAGE_ALLOWED_EXT: ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'] as const,
} as const;
