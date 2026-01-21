import type { ReactElement, ReactNode } from 'react';

import { AuthenticatedShell } from '@/src/widgets/authenticated-shell';
import { MobileShell } from '@/src/widgets/mobile-shell';
import { PublicShell } from '@/src/widgets/public-shell';

/**
 * public pages
 */
export function withPublicLayout(page: ReactElement): ReactNode {
  return (
    <MobileShell>
      <PublicShell>{page}</PublicShell>
    </MobileShell>
  );
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
