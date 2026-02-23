import { z } from 'zod';

import { IMAGE_UPLOAD_VALIDATION } from '@/src/shared/ui/image-upload/config/validation';

import { MOMENTS_POST_FORM_MESSAGES } from '../config/messages';

const momentsPostImageSchema = z.discriminatedUnion('type', [
  z.object({
    id: z.string(),
    type: z.literal('existing'),
    path: z.string().min(1),
  }),
  z.object({
    id: z.string(),
    type: z.literal('new'),
    file: z.instanceof(File),
  }),
]);

export const momentsPostFormSchema = z.object({
  title: z
    .string()
    .min(1, MOMENTS_POST_FORM_MESSAGES.TITLE.REQUIRED)
    .max(50, MOMENTS_POST_FORM_MESSAGES.TITLE.MAX_LENGTH),
  content: z
    .string()
    .min(1, MOMENTS_POST_FORM_MESSAGES.CONTENT.REQUIRED)
    .max(500, MOMENTS_POST_FORM_MESSAGES.CONTENT.MAX_LENGTH),
  tags: z.array(z.string()).max(5, MOMENTS_POST_FORM_MESSAGES.TAGS.MAX_COUNT),
  images: z.array(momentsPostImageSchema).max(IMAGE_UPLOAD_VALIDATION.MAX_IMAGES),
});
