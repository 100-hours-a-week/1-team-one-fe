import type { PropsWithChildren } from 'react';

export function PublicShell({ children }: PropsWithChildren) {
  return <main className="h-dvh">{children}</main>;
}
