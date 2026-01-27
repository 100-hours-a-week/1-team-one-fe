import type { ReactNode } from 'react';

import { FooterNav } from '@/src/widgets/layout/footer-nav';

import { HeaderConfig, PageHeader } from '../../page-header';

export interface MobileShellProps {
  children: ReactNode;
  showFooter?: boolean;
  showHeader?: boolean;
  headerConfig?: HeaderConfig;
}

export function MobileShell({ children, showFooter = true, headerConfig }: MobileShellProps) {
  const resolvedHeader = headerConfig && (
    <PageHeader title={headerConfig.title} backAction={true} action={headerConfig.action} />
  );

  return (
    <div className="bg-bg flex min-h-dvh justify-center">
      <div className="relative flex h-full w-full max-w-md flex-col">
        {resolvedHeader}

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
