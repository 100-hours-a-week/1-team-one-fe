// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

const env = process.env.NEXT_PUBLIC_ENV; // development | staging | production
const isLocal = env === 'local';
const SENTRY_INIT_IDLE_TIMEOUT_MS = 3_000;

type RouterTransitionArgs = readonly [href: string, navigationType: string];
type RouterTransitionHandler = (...args: RouterTransitionArgs) => void;

let isSentryInitScheduled = false;
let routerTransitionHandler: RouterTransitionHandler | null = null;
let sentryClientPromise: Promise<RouterTransitionHandler> | null = null;

const pendingRouterTransitions: RouterTransitionArgs[] = [];

function flushPendingRouterTransitions() {
  if (!routerTransitionHandler) return;
  if (pendingRouterTransitions.length === 0) return;

  for (const args of pendingRouterTransitions) {
    routerTransitionHandler(...args);
  }

  pendingRouterTransitions.length = 0;
}

async function loadSentryClient() {
  if (routerTransitionHandler) return routerTransitionHandler;
  if (sentryClientPromise) return sentryClientPromise;

  sentryClientPromise = import('./src/shared/lib/monitoring/init-sentry-client')
    .then((module) => {
      routerTransitionHandler = module.initSentryClient();
      flushPendingRouterTransitions();
      return routerTransitionHandler;
    })
    .catch((error: unknown) => {
      routerTransitionHandler = () => undefined;
      pendingRouterTransitions.length = 0;

      if (process.env.NODE_ENV !== 'production') {
        console.warn('[sentry] client_init_load_failed', { error });
      }

      return routerTransitionHandler;
    });

  return sentryClientPromise;
}

function scheduleSentryClientInit() {
  if (isLocal) return;
  if (typeof window === 'undefined') return;
  if (isSentryInitScheduled) return;

  isSentryInitScheduled = true;

  const runWhenIdle = () => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(
        () => {
          void loadSentryClient();
        },
        {
          timeout: SENTRY_INIT_IDLE_TIMEOUT_MS,
        },
      );
      return;
    }

    globalThis.setTimeout(() => {
      void loadSentryClient();
    }, 1);
  };

  if (document.readyState === 'complete') {
    runWhenIdle();
    return;
  }

  window.addEventListener('load', runWhenIdle, { once: true });
}

scheduleSentryClientInit();

export function onRouterTransitionStart(href: string, navigationType: string) {
  if (routerTransitionHandler) {
    routerTransitionHandler(href, navigationType);
    return;
  }

  pendingRouterTransitions.push([href, navigationType]);
}
