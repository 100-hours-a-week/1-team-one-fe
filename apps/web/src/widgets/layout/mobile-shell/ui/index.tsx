import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

import { MainHeader } from '@/src/widgets/layout/main-header';

import { HeaderConfig, PageHeader } from '../../page-header';

const FooterNav = dynamic(
  () => import('@/src/widgets/layout/footer-nav').then((mod) => mod.FooterNav),
  { ssr: false },
);

export interface MobileShellProps {
  children: ReactNode;
  showFooter?: boolean;
  showHeader?: boolean;
  headerConfig?: HeaderConfig;
}

export function MobileShell({ children, showFooter = true, headerConfig }: MobileShellProps) {
  const resolvedHeader =
    headerConfig &&
    (headerConfig.variant === 'main' ? (
      <MainHeader />
    ) : (
      <PageHeader
        title={headerConfig.title}
        backAction={headerConfig.back ?? true}
        action={headerConfig.action}
      />
    ));

  return (
    <div className="bg-bg flex justify-center">
      <div className="relative flex h-full w-full max-w-md flex-col">
        {resolvedHeader}

        <main
          className="flex-1"
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
