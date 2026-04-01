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
  isPageScroll?: boolean;
}

export function MobileShell({
  children,
  showFooter = true,
  headerConfig,
  isPageScroll,
}: MobileShellProps) {
  const [contextAction, setContextAction] = useState<ReactNode | null>(null);

  const shouldPageScroll = isPageScroll;

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
    <div className="bg-bg flex h-dvh flex-col justify-center">
      {resolvedHeader ? <div className="mx-auto w-full max-w-md">{resolvedHeader}</div> : null}

      <HeaderActionContext.Provider value={{ setAction: setContextAction }}>
        <div
          className={`min-h-0 flex-1 ${shouldPageScroll ? 'overflow-y-auto' : 'overflow-hidden'}`}
          style={{
            paddingBottom: showFooter
              ? 'calc(var(--footer-nav-height) + env(safe-area-inset-bottom))'
              : undefined,
          }}
        >
          <div
            className={
              shouldPageScroll
                ? 'mx-auto min-h-full w-full max-w-md'
                : 'mx-auto flex h-full min-h-0 w-full max-w-md flex-col'
            }
          >
            {children}
          </div>
        </div>
      </HeaderActionContext.Provider>

      {showFooter && <FooterNav />}
    </div>
  );
}
