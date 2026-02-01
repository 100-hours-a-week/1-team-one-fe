import { z } from 'zod';

import { LOGIN_FORM_MESSAGES } from '../config/messages';

export const loginSchema = z.object({
  email: z
    .email(LOGIN_FORM_MESSAGES.ERROR.EMAIL_INVALID)
    .min(1, LOGIN_FORM_MESSAGES.ERROR.EMAIL_REQUIRED),
  password: z
    .string()
    .min(1, LOGIN_FORM_MESSAGES.ERROR.PASSWORD_REQUIRED)
    .min(6, LOGIN_FORM_MESSAGES.ERROR.PASSWORD_MIN_LENGTH)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, {
      message: LOGIN_FORM_MESSAGES.ERROR.PASSWORD_RULE,
    }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
