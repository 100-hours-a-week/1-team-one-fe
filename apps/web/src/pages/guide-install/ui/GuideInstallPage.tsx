import {
  InstallGuideHero,
  InstallSteps,
  PwaInstallCta,
  usePwaInstall,
} from '@/src/widgets/pwa-install';

export function GuideInstallPage() {
  const { status, isIos, handleInstallClick } = usePwaInstall();

  return (
    <div className="flex flex-col gap-6">
      <InstallGuideHero />
      {status === 'guide' && <InstallSteps isIos={isIos} />}
      <PwaInstallCta status={status} onInstall={handleInstallClick} />
    </div>
  );
}
