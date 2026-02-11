// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import { getCommonSentryClientOptions } from '@tooling/sentry-config';

const env = process.env.NEXT_PUBLIC_ENV; // development | staging | production
const isProd = env === 'production';

Sentry.init({
  ...getCommonSentryClientOptions(),
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: env,
  release: process.env.NEXT_PUBLIC_RELEASE,

  //성능 수집
  tracesSampleRate: env === 'production' ? 0.1 : 1.0,

  integrations: (integrations) => {
    const withoutBrowserTracing = integrations.filter(
      (integration) => integration.name !== 'BrowserTracing',
    );

    return [
      ...withoutBrowserTracing,
      Sentry.browserTracingIntegration({
        enableInp: true,
        enableLongTask: true,
        enableElementTiming: true,
      }),
      // TODO: breadcrumb 자동 수집 + console warn/error만
      // Sentry.captureConsoleIntegration({ levels: ['warn', 'error'] }),
      Sentry.replayIntegration(),
    ];
  },

  replaysSessionSampleRate: env === 'production' ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0,

  //민감값 -> prod 에서는 false
  sendDefaultPii: !isProd,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
