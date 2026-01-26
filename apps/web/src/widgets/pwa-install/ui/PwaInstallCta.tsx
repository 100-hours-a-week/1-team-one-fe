import { Button } from '@repo/ui/button';
import Link from 'next/link';

import { ROUTES } from '@/src/shared/routes';

import { PWA_INSTALL_MESSAGES } from '../config/messages';
import type { PwaInstallStatus } from '../model/use-pwa-install';

interface PwaInstallCtaProps {
  status: PwaInstallStatus;
  onInstall: () => void | Promise<void>;
}

export function PwaInstallCta({ status, onInstall }: PwaInstallCtaProps) {
  if (status === 'installed') {
    return (
      <section className="flex flex-col gap-3">
        <p className="text-success-600 text-sm font-semibold">
          {PWA_INSTALL_MESSAGES.CTA.INSTALLED}
        </p>
        <Button asChild>
          <Link href={ROUTES.LOGIN}>{PWA_INSTALL_MESSAGES.CTA.LOGIN}</Link>
        </Button>
      </section>
    );
  }

  if (status === 'prompt') {
    return (
      <section className="flex flex-col gap-3">
        <Button onClick={onInstall}>{PWA_INSTALL_MESSAGES.CTA.INSTALL}</Button>
        <Button variant="ghost" asChild>
          <Link href={ROUTES.LOGIN}>{PWA_INSTALL_MESSAGES.CTA.LOGIN}</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <Button variant="ghost" asChild>
        <Link href={ROUTES.LOGIN}>{PWA_INSTALL_MESSAGES.CTA.LOGIN}</Link>
      </Button>
    </section>
  );
}
