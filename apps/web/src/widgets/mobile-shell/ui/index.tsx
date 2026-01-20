import type { ReactNode } from 'react';

import { FooterNav } from '@/src/widgets/footer-nav';

export interface MobileShellProps {
  children: ReactNode;
  showFooter?: boolean;
}

export function MobileShell({ children, showFooter = true }: MobileShellProps) {
  return (
    <div className="bg-bg-muted flex min-h-dvh justify-center">
      <div className="bg-bg relative flex min-h-dvh w-full max-w-md flex-col">
        <main
          className="flex-1 overflow-y-auto"
          style={{
            paddingBottom: showFooter ? 'calc(4rem + env(safe-area-inset-bottom))' : undefined,
          }}
        >
          {children}
        </main>

        {showFooter && <FooterNav />}
      </div>
    </div>
  );
}
