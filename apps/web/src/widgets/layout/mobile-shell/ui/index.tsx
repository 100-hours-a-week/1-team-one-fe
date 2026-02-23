import dynamic from 'next/dynamic';
import { type ReactNode, useState } from 'react';

import { HeaderActionContext } from '@/src/widgets/layout/header-action-context';
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
  const [contextAction, setContextAction] = useState<ReactNode | null>(null);

  const resolvedHeader =
    headerConfig &&
    (headerConfig.variant === 'main' ? (
      <MainHeader />
    ) : (
      <PageHeader
        title={headerConfig.title}
        backAction={headerConfig.back ?? true}
        action={contextAction ?? headerConfig.action}
      />
    ));

  return (
    <div className="bg-bg flex h-dvh justify-center">
      <div className="relative flex h-full w-full flex-col">
        {resolvedHeader ? <div className="mx-auto w-full max-w-md">{resolvedHeader}</div> : null}

        <HeaderActionContext.Provider value={{ setAction: setContextAction }}>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div
              className="mx-auto h-full w-full max-w-md"
              style={{
                paddingBottom: showFooter ? 'calc(4rem + env(safe-area-inset-bottom))' : undefined,
              }}
            >
              {children}
            </div>
          </div>
        </HeaderActionContext.Provider>

        {showFooter && <FooterNav />}
      </div>
    </div>
  );
}
