import {
  addIntegration,
  browserTracingIntegration,
  captureRouterTransitionStart,
  init,
  replayIntegration,
} from '@sentry/nextjs';
import { getCommonSentryClientOptions } from '@tooling/sentry-config';

const env = process.env.NEXT_PUBLIC_ENV; // development | staging | production
const isProd = env === 'production';
const isLocal = env === 'local';
const REPLAY_IDLE_TIMEOUT_MS = 10_000;

let isReplayScheduled = false;
let isSentryInitialized = false;

function scheduleReplayIntegration() {
  if (isLocal) return;
  if (typeof window === 'undefined') return;
  if (isReplayScheduled) return;

  isReplayScheduled = true;

  const runWhenIdle = () => {
    const loadReplayIntegration = () => {
      addIntegration(replayIntegration());
    };

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

export function initSentryClient() {
  if (isSentryInitialized) return captureRouterTransitionStart;

  isSentryInitialized = true;

  init({
    ...getCommonSentryClientOptions(),
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: env,
    release: process.env.NEXT_PUBLIC_RELEASE,
    enabled: !isLocal,

    // 성능 수집
    tracesSampleRate: env === 'production' ? 0.1 : 1.0,

    integrations: (integrations) => {
      const withoutBrowserTracing = integrations.filter(
        (integration) => integration.name !== 'BrowserTracing',
      );

      return [
        ...withoutBrowserTracing,
        browserTracingIntegration({
          enableInp: true,
          enableLongTask: true,
          enableElementTiming: true,
        }),
      ];
    },

    replaysSessionSampleRate: env === 'production' ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 1.0,

    // 민감값 -> prod 에서는 false
    sendDefaultPii: !isProd,
  });

  scheduleReplayIntegration();

  return captureRouterTransitionStart;
}
