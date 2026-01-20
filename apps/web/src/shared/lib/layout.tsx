import type { ReactElement, ReactNode } from 'react';

import { AppShell } from '@/src/widgets/app-shell';
import { MobileShell } from '@/src/widgets/mobile-shell';
import { PublicShell } from '@/src/widgets/public-shell';

/**
 * public pages
 */
export function withPublicLayout(page: ReactElement): ReactNode {
  return <PublicShell>{page}</PublicShell>;
}

/**
 * authenticated
 */
export function withAppLayout(page: ReactElement): ReactNode {
  return <AppShell>{page}</AppShell>;
}

/**
 * mobile footer navigation
 */
export function withMobileLayout(page: ReactElement): ReactNode {
  return <MobileShell>{page}</MobileShell>;
}
