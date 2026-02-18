import { z } from 'zod';

import { MOMENTS_CREATE_MESSAGES } from '../config/messages';

export const momentsCreateSchema = z.object({
  title: z
    .string()
    .min(1, MOMENTS_CREATE_MESSAGES.TITLE.REQUIRED)
    .max(50, MOMENTS_CREATE_MESSAGES.TITLE.MAX_LENGTH),
  content: z
    .string()
    .min(1, MOMENTS_CREATE_MESSAGES.CONTENT.REQUIRED)
    .max(500, MOMENTS_CREATE_MESSAGES.CONTENT.MAX_LENGTH),
  tags: z.array(z.string()).max(5, MOMENTS_CREATE_MESSAGES.TAGS.MAX_COUNT),
  images: z.array(z.instanceof(File)).max(10),
});

export type MomentsCreateFormValues = z.infer<typeof momentsCreateSchema>;
