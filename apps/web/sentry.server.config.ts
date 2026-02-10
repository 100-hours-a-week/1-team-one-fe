// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const env = process.env.NEXT_PUBLIC_ENV; // development | staging | production
const isProd = env === 'production';

//next.js 서버에서 발생하는 에러를 수집 - api 라우트, ssr, 등 ..
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_ENV,
  release: process.env.NEXT_PUBLIC_RELEASE,

  tracesSampleRate: isProd ? 0.1 : 0.3,

  sendDefaultPii: !isProd ? true : false,
});
