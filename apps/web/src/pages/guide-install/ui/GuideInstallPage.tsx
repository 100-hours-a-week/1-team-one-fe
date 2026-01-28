import dynamic from 'next/dynamic';

import { InstallGuideHero, InstallSteps, usePwaInstall } from '@/src/widgets/pwa-install';

//prerender 오류 해결 위한 동적 임포트
const ComponentWithoutSSR = dynamic(
  () => import('@/src/widgets/pwa-install').then((mod) => mod.PwaInstallCta),
  {
    ssr: false,
  },
);

export function GuideInstallPage() {
  const { status, isIos, handleInstallClick } = usePwaInstall();

  return (
    <div className="flex flex-col gap-6">
      <InstallGuideHero />
      {status === 'guide' ? <InstallSteps isIos={isIos} /> : null}
      <ComponentWithoutSSR status={status} onInstall={handleInstallClick} />
    </div>
  );
}
