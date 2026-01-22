import type { PropsWithChildren } from 'react';

export function PublicShell({ children }: PropsWithChildren) {
  return <main className="p-6">{children}</main>;
}
