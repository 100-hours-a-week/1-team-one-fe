// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import { getCommonSentryClientOptions } from '@tooling/sentry-config';

const env = process.env.NEXT_PUBLIC_ENV; // development | staging | production
const isProd = env === 'production';
const isLocal = env === 'local';
const REPLAY_IDLE_TIMEOUT_MS = 10_000;

let isReplayScheduled = false;

function scheduleReplayIntegration() {
  if (isLocal) return;
  if (typeof window === 'undefined') return;
  if (isReplayScheduled) return;

  isReplayScheduled = true;

  const loadReplayIntegration = () => {
    void import('@sentry/nextjs')
      .then((module) => {
        module.addIntegration(module.replayIntegration());
      })
      .catch((error) => {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[sentry] replay_integration_load_failed', { error });
        }
      });
  };

  const runWhenIdle = () => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadReplayIntegration, {
        timeout: REPLAY_IDLE_TIMEOUT_MS,
      });
      return;
    }

    globalThis.setTimeout(loadReplayIntegration, 1);
  };

  if (document.readyState === 'complete') {
    runWhenIdle();
    return;
  }

  window.addEventListener('load', runWhenIdle, { once: true });
}

Sentry.init({
  ...getCommonSentryClientOptions(),
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: env,
  release: process.env.NEXT_PUBLIC_RELEASE,
  enabled: !isLocal,

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
    ];
  },

  replaysSessionSampleRate: env === 'production' ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0,

  //민감값 -> prod 에서는 false
  sendDefaultPii: !isProd,
});

scheduleReplayIntegration();

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
