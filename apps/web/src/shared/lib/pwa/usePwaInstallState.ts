import { useEffect, useRef, useState } from 'react';

export type PwaInstallState = {
  isInstalled: boolean;
  isReady: boolean; //설치 여부 판단이 끝났는지
  canPromptInstall: boolean; //install prompt를 받을 수 있는지
  promptInstall: () => Promise<void>;
};

type InstallOutcome = 'accepted' | 'dismissed';

type UserChoice = {
  outcome: InstallOutcome;
  platform: string;
};

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<UserChoice>;
}

function detectStandalone(): boolean {
  if (typeof window === 'undefined') return false;

  const isStandaloneDisplayMode =
    window.matchMedia?.('(display-mode: standalone)')?.matches ?? false;

  //ios
  const isIosStandalone = (window.navigator as any).standalone === true;

  return isStandaloneDisplayMode || isIosStandalone;
}

/**
 * pwa 설치 여부 확인
 */
export function usePwaInstallState() {
  const [state, setState] = useState<PwaInstallState>({
    isInstalled: false,
    isReady: false,
    canPromptInstall: false,
    promptInstall: async () => {},
  });
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    let cancelled = false;

    const updateInstalled = () => {
      if (cancelled) return;
      const installed = detectStandalone();
      setState((prev) => ({
        ...prev,
        isInstalled: installed,
        isReady: true,
        canPromptInstall: installed ? false : prev.canPromptInstall,
      }));
    };

    //initial
    updateInstalled();

    //display-mode
    const mql = window.matchMedia?.('(display-mode: standalone)');
    const onChange = () => updateInstalled();
    mql?.addEventListener?.('change', onChange);

    //beforeinstallprompt
    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      if (cancelled) return;
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
      setState((prev) => ({ ...prev, canPromptInstall: true }));
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);

    // 설치 완료 이벤트
    const onAppInstalled = () => {
      if (cancelled) return;
      setState((prev) => ({
        ...prev,
        isInstalled: true,
        isReady: true,
        canPromptInstall: false,
      }));
      deferredPromptRef.current = null;
    };

    window.addEventListener('appinstalled', onAppInstalled);

    //정리
    return () => {
      cancelled = true;
      mql?.removeEventListener?.('change', onChange);
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    const deferredPrompt = deferredPromptRef.current;
    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    deferredPromptRef.current = null;
    setState((prev) => ({
      ...prev,
      isInstalled: choice.outcome === 'accepted' ? true : prev.isInstalled,
      canPromptInstall: false,
    }));
  };

  return {
    ...state,
    promptInstall,
  };
}
