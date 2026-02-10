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

  integrations: [
    Sentry.breadcrumbsIntegration(),
    // TODO: breadcrumb 자동 수집 + console warn/error만
    // Sentry.captureConsoleIntegration({ levels: ['warn', 'error'] }),
    Sentry.replayIntegration(),
  ],

  replaysSessionSampleRate: env === 'production' ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0,

  //민감값 -> prod 에서는 false
  sendDefaultPii: !isProd,
});
