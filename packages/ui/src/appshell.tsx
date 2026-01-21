import type { ReactNode } from 'react';

export interface AppShellProps {
  children: ReactNode;
  outerClassName?: string;
  innerClassName?: string;
  bottomSlot?: ReactNode;
  bottomOffset?: string;
  mainClassName?: string;
}

export function AppShell({
  children,
  outerClassName = 'bg-bg-muted flex min-h-dvh justify-center',
  innerClassName = 'bg-bg relative flex min-h-dvh w-full max-w-md flex-col',
  bottomSlot,
  bottomOffset,
  mainClassName = 'flex-1 overflow-y-auto',
}: AppShellProps) {
  return (
    <div className={outerClassName}>
      <div className={innerClassName}>
        <main
          className={mainClassName}
          style={{
            paddingBottom: bottomOffset
              ? `calc(${bottomOffset} + env(safe-area-inset-bottom))`
              : undefined,
          }}
        >
          {children}
        </main>
        {bottomSlot}
      </div>
    </div>
  );
}
