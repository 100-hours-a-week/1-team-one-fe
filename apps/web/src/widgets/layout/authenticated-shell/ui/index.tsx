import { useRouter } from 'next/router';
import type { PropsWithChildren } from 'react';
import { useEffect, useMemo, useState } from 'react';

import { useOnboardingStatusQuery } from '@/src/features/onboarding-status';
import {
  PushPermissionBottomSheet,
  usePushPermissionSheet,
} from '@/src/features/push-notifications';
import { isIosUserAgent, isMobileUserAgent } from '@/src/shared/lib/device/user-agent';
import { usePwaInstallState } from '@/src/shared/lib/pwa/usePwaInstallState';
import { ROUTE_GROUPS, ROUTES } from '@/src/shared/routes';
import { PwaInstallBottomSheet } from '@/src/widgets/pwa-install';

let hasShownPwaInstallSheet = false;

export function AuthenticatedShell({ children }: PropsWithChildren) {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isPwaSheetOpen, setIsPwaSheetOpen] = useState(false);
  const pwaState = usePwaInstallState();

  const isAppRoute = useMemo(
    () => (ROUTE_GROUPS.APP as readonly string[]).includes(router.pathname),
    [router.pathname],
  );
  const shouldAutoOpenPushPermissionSheet = isAppRoute && router.isReady;
  const pushPermissionSheet = usePushPermissionSheet({
    autoOpen: shouldAutoOpenPushPermissionSheet,
  });
  const shouldRenderGlobalPushSheet = isAppRoute && router.pathname !== ROUTES.ALARM;

  const { data: onboardingStatus } = useOnboardingStatusQuery({ enabled: isAppRoute });

  useEffect(() => {
    // console.log('onboardingStatus in AuthenticatedShell:', onboardingStatus);
    // console.log('isAppRoute in AuthenticatedShell:', isAppRoute);
    // console.log('router.isReady in AuthenticatedShell:', router.isReady);

    if (!router.isReady || !onboardingStatus || !isAppRoute) {
      return;
    }

    if (onboardingStatus === 'unauthorized') {
      void router.replace(ROUTES.LOGIN);
      return;
    }

    if (onboardingStatus === 'incomplete') {
      void router.replace(ROUTES.ONBOARDING_SURVEY);
    }
  }, [isAppRoute, onboardingStatus, router]);

  useEffect(() => {
    if (typeof navigator === 'undefined') {
      return;
    }

    const userAgent = navigator.userAgent;
    setIsMobile(isMobileUserAgent(userAgent));
    setIsIos(isIosUserAgent(userAgent));
  }, []);

  const shouldShowPwaSheet =
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
    <main className="h-dvh">
      {children}
      {shouldRenderGlobalPushSheet && (
        <PushPermissionBottomSheet
          open={pushPermissionSheet.open}
          onOpenChange={pushPermissionSheet.setOpen}
          permission={pushPermissionSheet.permission}
          platform={pushPermissionSheet.platform}
          isRequesting={pushPermissionSheet.isRequesting}
          onRequestPermission={pushPermissionSheet.requestPermission}
        />
      )}
      {isAppRoute && isMobile && (
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
