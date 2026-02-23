import type { BrowserOptions } from '@sentry/nextjs';
import {
  IGNORE_ERROR_MESSAGES,
  IGNORE_SCRIPT_ERROR_SUBSTRINGS,
  maskUrlQuery,
} from './sentry.shared';

export function getCommonSentryClientOptions(): Partial<BrowserOptions> {
  return {
    ignoreErrors: IGNORE_ERROR_MESSAGES,

    beforeSend(event) {
      const msg = event.exception?.values?.[0]?.value ?? '';
      if (IGNORE_SCRIPT_ERROR_SUBSTRINGS.some((s) => msg.includes(s))) return null;
      return event;
    },

    //breadcrumb 전역 정리, 마스킹
    beforeBreadcrumb(breadcrumb) {
      //네트워크 breadcrumb 정리
      if (breadcrumb.category === 'fetch' || breadcrumb.category === 'xhr') {
        const url = (breadcrumb.data as any)?.url as string | undefined;
        if (url) {
          //sentry 자체 요청 제거
          if (url.includes('sentry') || url.includes('/envelope')) return null;
          (breadcrumb.data as any).url = maskUrlQuery(url);
        }
      }

      //TODO: console 노이즈컷 여부 결정 필요
      //   //console 노이즈 컷
      //   if (breadcrumb.category === 'console') {
      //     const msg = String(breadcrumb.message ?? '');
      //     if (msg.includes('[HMR]') || msg.includes('webpack')) return null;
      //   }

      return breadcrumb;
    },
  };
}
