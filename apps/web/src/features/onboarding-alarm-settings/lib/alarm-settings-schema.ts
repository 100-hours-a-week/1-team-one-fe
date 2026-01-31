import { z } from 'zod';

import type { AlarmSettingsFormValues } from '@/src/entities/alarm-settings';
import { WEEKDAY_VALUES } from '@/src/entities/alarm-settings';

import { FORM_MESSAGES, INTERVAL_CONFIG } from '../config';

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours ?? 0) * 60 + (minutes ?? 0);
}

export const alarmSettingsSchema: z.ZodType<AlarmSettingsFormValues> = z
  .object({
    intervalMinutes: z
      .number()
      .min(INTERVAL_CONFIG.MIN_MINUTES, FORM_MESSAGES.ERROR.INTERVAL_MIN)
      .max(INTERVAL_CONFIG.MAX_MINUTES, FORM_MESSAGES.ERROR.INTERVAL_MAX),

    activeStart: z.string().regex(/^\d{2}:\d{2}$/, FORM_MESSAGES.ERROR.TIME_FORMAT),

    activeEnd: z.string().regex(/^\d{2}:\d{2}$/, FORM_MESSAGES.ERROR.TIME_FORMAT),

    focusStart: z.string().regex(/^\d{2}:\d{2}$/, FORM_MESSAGES.ERROR.TIME_FORMAT),

    focusEnd: z.string().regex(/^\d{2}:\d{2}$/, FORM_MESSAGES.ERROR.TIME_FORMAT),

    weekdays: z.array(z.enum(WEEKDAY_VALUES)).min(1, FORM_MESSAGES.ERROR.WEEKDAYS_REQUIRED),
  })
  .superRefine((data, ctx) => {
    const activeStartMinutes = timeToMinutes(data.activeStart);
    const activeEndMinutes = timeToMinutes(data.activeEnd);

    if (activeStartMinutes >= activeEndMinutes) {
      ctx.addIssue({
        code: 'custom',
        path: ['activeEnd'],
        message: FORM_MESSAGES.ERROR.ACTIVE_TIME_INVALID,
      });
    }

    const focusStartMinutes = timeToMinutes(data.focusStart);
    const focusEndMinutes = timeToMinutes(data.focusEnd);

    if (focusStartMinutes >= focusEndMinutes) {
      ctx.addIssue({
        code: 'custom',
        path: ['focusEnd'],
        message: FORM_MESSAGES.ERROR.FOCUS_TIME_INVALID,
      });
    }

    if (focusStartMinutes < activeStartMinutes || focusEndMinutes > activeEndMinutes) {
      ctx.addIssue({
        code: 'custom',
        path: ['focusStart'],
        message: FORM_MESSAGES.ERROR.FOCUS_OUT_OF_RANGE,
      });
    }
  });

export type AlarmSettingsValues = AlarmSettingsFormValues;
