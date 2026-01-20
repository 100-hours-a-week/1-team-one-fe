import type { PropsWithChildren } from 'react';

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-dvh">
      <div className="flex-1">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
