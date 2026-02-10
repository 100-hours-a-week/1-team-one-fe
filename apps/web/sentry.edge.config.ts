// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const env = process.env.NEXT_PUBLIC_ENV;
const isProd = env === 'production';

//엣지 런타임에 실행되는 코드에서 발생하는 에러를 수집
//cdn 요청 실패 에러 수집 가능 (proxy.ts 는 server.config.ts 에서 수집)
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_ENV,
  release: process.env.NEXT_PUBLIC_RELEASE,

  //Edge/middleware는 호출이 많을 수 있으니
  tracesSampleRate: isProd ? 0.05 : 0.2,

  sendDefaultPii: !isProd ? true : false,
});
