import { ErrorScreen } from '@/src/shared/ui/error-screen';

export type ErrorPageVariant = 'not-found' | 'server-error' | 'unexpected';

export interface ErrorPageProps {
  variant: ErrorPageVariant;
}

export function ErrorPage({ variant }: ErrorPageProps) {
  return <ErrorScreen variant={variant} />;
}
