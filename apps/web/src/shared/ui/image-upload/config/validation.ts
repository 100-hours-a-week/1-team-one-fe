export const IMAGE_UPLOAD_VALIDATION = {
  MAX_IMAGES: 10,
  MAX_SIZE_BYTES: 10 * 1024 * 1024, //10mb
  SLIDE_THRESHOLD: 4,
  ACCEPT: 'image/jpeg,image/png,image/gif,image/webp,image/heic,image/heif',
} as const;
