import * as Sentry from '@sentry/nextjs';
import { getCommonSentryOptions } from '@tooling/sentry-config';

const env = process.env.NEXT_PUBLIC_ENV; // development | staging | production

Sentry.init({
  ...getCommonSentryOptions(),
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_ENV,
  release: process.env.NEXT_PUBLIC_RELEASE,

  //성능 수집
  tracesSampleRate: env === 'production' ? 0.1 : 1.0,

  integrations: [Sentry.replayIntegration()],

  replaysSessionSampleRate: env === 'production' ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0,

  //민감값 -> prod 에서는 false
  sendDefaultPii: env !== 'production',
});
