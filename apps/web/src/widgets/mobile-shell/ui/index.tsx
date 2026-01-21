import { AppShell } from '@repo/ui/appshell';
import type { ReactNode } from 'react';

import { FooterNav } from '@/src/widgets/footer-nav';

export interface MobileShellProps {
  children: ReactNode;
  showFooter?: boolean;
}

export function MobileShell({ children, showFooter = true }: MobileShellProps) {
  return (
    <AppShell
      bottomSlot={showFooter ? <FooterNav /> : null}
      bottomOffset={showFooter ? '4rem' : undefined}
    >
      {children}
    </AppShell>
  );
}
