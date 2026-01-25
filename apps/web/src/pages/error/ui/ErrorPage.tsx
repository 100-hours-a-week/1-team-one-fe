import { ErrorView } from '@repo/ui/error-view';

import { ERROR_MESSAGES } from '@/src/shared/config/error-messages';

export type ErrorPageVariant = 'not-found' | 'server-error' | 'unexpected';

const ERROR_VARIANTS = {
  'not-found': ERROR_MESSAGES.NOT_FOUND,
  'server-error': ERROR_MESSAGES.SERVER_ERROR,
  unexpected: ERROR_MESSAGES.UNEXPECTED,
} as const satisfies Record<
  ErrorPageVariant,
  { readonly TITLE: string; readonly DESCRIPTION: string; readonly ACTION_LABEL: string }
>;

export interface ErrorPageProps {
  variant: ErrorPageVariant;
}

export function ErrorPage({ variant }: ErrorPageProps) {
  const config = ERROR_VARIANTS[variant] ?? ERROR_VARIANTS.unexpected;

  return (
    <ErrorView
      title={config.TITLE}
      description={config.DESCRIPTION}
      actionLabel={config.ACTION_LABEL}
      actionHref="/"
    />
  );
}
