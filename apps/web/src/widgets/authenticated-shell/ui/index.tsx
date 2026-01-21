import type { PropsWithChildren } from 'react';

export function AuthenticatedShell({ children }: PropsWithChildren) {
  return <main className="p-6">{children}</main>;
}
