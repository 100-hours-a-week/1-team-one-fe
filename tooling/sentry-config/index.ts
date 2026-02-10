import { type BrowserOptions } from '@sentry/nextjs';

export function getCommonSentryOptions(): Partial<BrowserOptions> {
  return {
    //노이즈 컷 (필요한 것만)
    ignoreErrors: ['ResizeObserver loop limit exceeded'],

    //성능 추적
    tracesSampleRate: 0.1,

    beforeSend(event) {
      //노이즈 제거
      const msg = event.exception?.values?.[0]?.value ?? '';
      if (msg.includes('Script error.')) return null;

      return event;
    },
  };
}
