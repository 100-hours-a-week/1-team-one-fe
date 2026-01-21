import type { ReactElement, ReactNode } from 'react';

import { AuthenticatedShell } from '@/src/widgets/authenticated-shell';
import { MobileShell } from '@/src/widgets/mobile-shell';
import { PublicShell } from '@/src/widgets/public-shell';

type PublicLayoutOptions = {
  showFooter?: boolean;
};

export function createPublicLayout(options: PublicLayoutOptions = {}) {
  const { showFooter = true } = options;

  return function withPublicLayout(page: ReactElement): ReactNode {
    return (
      <MobileShell showFooter={showFooter}>
        <PublicShell>{page}</PublicShell>
      </MobileShell>
    );
  };
}

/**
 * authenticated
 */
export function withAuthenticatedLayout(page: ReactElement): ReactNode {
  return (
    <MobileShell>
      <AuthenticatedShell>{page}</AuthenticatedShell>
    </MobileShell>
  );
}

/**
 * mobile footer navigation
 */
export function withMobileLayout(page: ReactElement): ReactNode {
  return <MobileShell>{page}</MobileShell>;
}
