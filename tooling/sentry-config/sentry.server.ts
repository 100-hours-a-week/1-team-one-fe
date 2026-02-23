import type { NodeOptions } from '@sentry/nextjs';
import { IGNORE_ERROR_MESSAGES, IGNORE_SCRIPT_ERROR_SUBSTRINGS } from './sentry.shared';

export function getCommonSentryServerOptions(): Partial<NodeOptions> {
  return {
    ignoreErrors: IGNORE_ERROR_MESSAGES,

    beforeSend(event) {
      const msg = event.exception?.values?.[0]?.value ?? '';
      if (IGNORE_SCRIPT_ERROR_SUBSTRINGS.some((s) => msg.includes(s))) return null;
      return event;
    },
  };
}
