import { useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import type { PropsWithChildren } from 'react';
import { useEffect, useMemo, useState } from 'react';

import { useOnboardingStatusQuery } from '@/src/features/onboarding-status';
import { usePushPermissionSheet } from '@/src/features/push-notifications';
import { isApiError } from '@/src/shared/api';
import { HTTP_STATUS } from '@/src/shared/config/http-status';
import { isIosUserAgent, isMobileUserAgent } from '@/src/shared/lib/device/user-agent';
import { usePwaInstallState } from '@/src/shared/lib/pwa/usePwaInstallState';
import { ROUTE_GROUPS, ROUTES } from '@/src/shared/routes';

const PushPermissionBottomSheet = dynamic(
  () =>
    import('@/src/features/push-notifications/ui/PushPermissionBottomSheet').then(
      (mod) => mod.PushPermissionBottomSheet,
    ),
  { ssr: false },
);

const PwaInstallBottomSheet = dynamic(
  () =>
    import('@/src/widgets/pwa-install/ui/PwaInstallBottomSheet').then(
      (mod) => mod.PwaInstallBottomSheet,
    ),
  { ssr: false },
);

const BOTTOM_SHEET_IDLE_TIMEOUT_MS = 1200;

let hasShownPwaInstallSheet = false;

export function AuthenticatedShell({ children }: PropsWithChildren) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isMobile, setIsMobile] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isPwaSheetOpen, setIsPwaSheetOpen] = useState(false);
  const [shouldMountBottomSheets, setShouldMountBottomSheets] = useState(false);
  const pwaState = usePwaInstallState();

  const isAppRoute = useMemo(
    () => (ROUTE_GROUPS.APP as readonly string[]).includes(router.pathname),
    [router.pathname],
  );
  const shouldAutoOpenPushPermissionSheet = shouldMountBottomSheets && isAppRoute && router.isReady;
  const pushPermissionSheet = usePushPermissionSheet({
    autoOpen: shouldAutoOpenPushPermissionSheet,
  });
  const shouldRenderGlobalPushSheet = isAppRoute && router.pathname !== ROUTES.ALARM;

  const { data: onboardingStatus } = useOnboardingStatusQuery({ enabled: isAppRoute });

  useEffect(() => {
    if (!router.isReady || !onboardingStatus || !isAppRoute) {
      return;
    }

    if (onboardingStatus === 'unauthorized') {
      void router.replace(`${ROUTES.LOGIN}?redirectUrl=${encodeURIComponent(router.asPath)}`);
      return;
    }

    if (onboardingStatus === 'incomplete') {
      void router.replace(ROUTES.ONBOARDING_SURVEY);
    }
  }, [isAppRoute, onboardingStatus, router]);

  useEffect(() => {
    if (!isAppRoute) return;

    const redirectToLogin = () => {
      void router.replace(`${ROUTES.LOGIN}?redirectUrl=${encodeURIComponent(router.asPath)}`);
    };

    const unsubQuery = queryClient.getQueryCache().subscribe((event) => {
      if (event.type !== 'updated') return;
      const action = event.action;
      if (action.type !== 'error') return;
      if (isApiError(action.error) && action.error.status === HTTP_STATUS.UNAUTHORIZED) {
        redirectToLogin();
      }
    });

    const unsubMutation = queryClient.getMutationCache().subscribe((event) => {
      if (event.type !== 'updated') return;
      const action = event.action;
      if (!action || action.type !== 'error') return;
      if (isApiError(action.error) && action.error.status === HTTP_STATUS.UNAUTHORIZED) {
        redirectToLogin();
      }
    });

    return () => {
      unsubQuery();
      unsubMutation();
    };
  }, [isAppRoute, queryClient, router]);

  useEffect(() => {
    if (typeof navigator === 'undefined') {
      return;
    }

    const userAgent = navigator.userAgent;
    setIsMobile(isMobileUserAgent(userAgent));
    setIsIos(isIosUserAgent(userAgent));
  }, []);

  useEffect(() => {
    if (!isAppRoute) {
      setShouldMountBottomSheets(false);
      return;
    }

    const mountBottomSheets = () => {
      setShouldMountBottomSheets(true);
    };

    const requestIdleCallbackFn = window.requestIdleCallback;
    if (typeof requestIdleCallbackFn === 'function') {
      const idleCallbackId = requestIdleCallbackFn(mountBottomSheets, {
        timeout: BOTTOM_SHEET_IDLE_TIMEOUT_MS,
      });
      return () => {
        window.cancelIdleCallback?.(idleCallbackId);
      };
    }

    const timerId = window.setTimeout(mountBottomSheets, BOTTOM_SHEET_IDLE_TIMEOUT_MS);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [isAppRoute]);

  const shouldShowPwaSheet =
    shouldMountBottomSheets &&
    isAppRoute &&
    isMobile &&
    pwaState.isReady &&
    !pwaState.isInstalled &&
    onboardingStatus === 'completed';

  useEffect(() => {
    if (!shouldShowPwaSheet || hasShownPwaInstallSheet) {
      return;
    }

    hasShownPwaInstallSheet = true;
    setIsPwaSheetOpen(true);
  }, [shouldShowPwaSheet]);

  return (
    <main className="h-full">
      {children}
      {shouldMountBottomSheets && shouldRenderGlobalPushSheet && (
        <PushPermissionBottomSheet
          open={pushPermissionSheet.open}
          onOpenChange={pushPermissionSheet.setOpen}
          permission={pushPermissionSheet.permission}
          platform={pushPermissionSheet.platform}
          isRequesting={pushPermissionSheet.isRequesting}
          onRequestPermission={pushPermissionSheet.requestPermission}
        />
      )}
      {shouldMountBottomSheets && isAppRoute && isMobile && (
        <PwaInstallBottomSheet
          open={isPwaSheetOpen}
          onOpenChange={setIsPwaSheetOpen}
          isIos={isIos}
          isReady={pwaState.isReady}
          canPromptInstall={pwaState.canPromptInstall}
          onInstall={pwaState.promptInstall}
        />
      )}
    </main>
  );
}
