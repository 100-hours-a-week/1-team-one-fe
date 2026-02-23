import type { PropsWithChildren } from 'react';

export function PublicShell({ children }: PropsWithChildren) {
  return <main className="h-full">{children}</main>;
}
