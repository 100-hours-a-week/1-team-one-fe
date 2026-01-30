export const VALIDATION_RULES = {
  EMAIL_MAX_LENGTH: 254,
  NICKNAME_MAX_LENGTH: 10,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 16,
  PROFILE_IMAGE_MAX_BYTES: 10 * 1024 * 1024, // 10MB
  PROFILE_IMAGE_ALLOWED_EXT: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif'] as const,
  PROFILE_IMAGE_ACCEPT: 'image/jpeg,image/png,image/gif,image/webp,image/heic,image/heif',
} as const;
