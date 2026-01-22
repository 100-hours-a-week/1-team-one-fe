import type { ReactElement, ReactNode } from 'react';

import { AuthenticatedShell } from '@/src/widgets/layout/authenticated-shell';
import { MobileShell } from '@/src/widgets/layout/mobile-shell';
import { HeaderConfig } from '@/src/widgets/layout/page-header';
import { PublicShell } from '@/src/widgets/layout/public-shell';

type PublicLayoutOptions = {
  showFooter?: boolean;
  headerConfig?: HeaderConfig;
};

export function createPublicLayout(options: PublicLayoutOptions = {}) {
  const { showFooter = true, headerConfig } = options;

  return function withPublicLayout(page: ReactElement): ReactNode {
    return (
      <MobileShell showFooter={showFooter} headerConfig={headerConfig}>
        <PublicShell>{page}</PublicShell>
      </MobileShell>
    );
  };
}

/** authenticated */
export function withAuthenticatedLayout(
  page: ReactElement,
  headerConfig?: HeaderConfig,
): ReactNode {
  return (
    <MobileShell headerConfig={headerConfig}>
      <AuthenticatedShell>{page}</AuthenticatedShell>
    </MobileShell>
  );
}

/** mobile  */
export function withMobileLayout(page: ReactElement, headerConfig?: HeaderConfig): ReactNode {
  return <MobileShell headerConfig={headerConfig}>{page}</MobileShell>;
}
