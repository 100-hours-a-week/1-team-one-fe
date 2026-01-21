import type { PropsWithChildren } from 'react';

export function PublicShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-dvh">
      <main className="p-6">{children}</main>
    </div>
  );
}
