import { ErrorView, type ErrorViewProps } from '@repo/ui/error-view';

import { ERROR_MESSAGES } from '@/src/shared/config/error-messages';

export type ErrorScreenVariant = 'not-found' | 'server-error' | 'unexpected';

export interface ErrorScreenProps {
  variant: ErrorScreenVariant;
  actionHref?: string;
  onAction?: () => void;
}

export function ErrorScreen({ variant, actionHref = '/', onAction }: ErrorScreenProps) {
  const handleBack = () => {
    if (typeof window === 'undefined') return;
    window.history.back();
  };

  const handleRetry = () => {
    if (typeof window === 'undefined') return;
    window.location.reload();
  };

  // variant별 메시지, cta 구성을 분기
  const { config, actions } = (() => {
    if (variant === 'not-found') {
      const config = ERROR_MESSAGES.NOT_FOUND;
      const actions: ErrorViewProps['actions'] = [
        { label: config.ACTIONS.PRIMARY, onClick: onAction ?? handleBack, variant: 'secondary' },
        { label: config.ACTIONS.SECONDARY, href: actionHref, variant: 'primary' },
      ];
      return { config, actions };
    }

    if (variant === 'server-error') {
      const config = ERROR_MESSAGES.SERVER_ERROR;
      const actions: ErrorViewProps['actions'] = [
        { label: config.ACTIONS.PRIMARY, onClick: onAction ?? handleRetry, variant: 'primary' },
        { label: config.ACTIONS.SECONDARY, href: actionHref, variant: 'secondary' },
      ];
      return { config, actions };
    }

    const config = ERROR_MESSAGES.UNEXPECTED;
    const actions: ErrorViewProps['actions'] = [
      { label: config.ACTIONS.PRIMARY, href: actionHref, variant: 'primary' },
    ];
    return { config, actions };
  })();

  return <ErrorView title={config.TITLE} description={config.DESCRIPTION} actions={actions} />;
}
