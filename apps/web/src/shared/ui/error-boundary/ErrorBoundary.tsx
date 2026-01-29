import { useQueryClient } from '@tanstack/react-query';
import type { ErrorInfo, ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

import { isApiError } from '@/src/shared/api';
import { HTTP_STATUS } from '@/src/shared/config/http-status';
import { ErrorScreen, type ErrorScreenVariant } from '@/src/shared/ui/error-screen';

type ErrorBoundaryFallbackProps = {
  error: Error;
  resetErrorBoundary: () => void;
  variant: ErrorScreenVariant;
};

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  variant?: ErrorScreenVariant;
  onError?: (error: Error, info: ErrorInfo) => void;
}

const resolveVariant = (error: Error, fallbackVariant: ErrorScreenVariant): ErrorScreenVariant => {
  if (!isApiError(error)) return fallbackVariant;

  if (error.status === HTTP_STATUS.NOT_FOUND) {
    return 'not-found';
  }

  if (error.status >= HTTP_STATUS.SERVER_ERROR_MIN) {
    return 'server-error';
  }

  return fallbackVariant;
};

function ErrorBoundaryFallback({ error, resetErrorBoundary, variant }: ErrorBoundaryFallbackProps) {
  const queryClient = useQueryClient();
  const resolvedVariant = resolveVariant(error, variant);

  const handleRetry = () => {
    void queryClient.refetchQueries({ type: 'all', stale: true });
    resetErrorBoundary();
  };

  return (
    <ErrorScreen
      variant={resolvedVariant}
      onAction={resolvedVariant === 'server-error' ? handleRetry : undefined}
    />
  );
}

export function ErrorBoundary({
  children,
  fallback,
  variant = 'unexpected',
  onError,
}: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      onError={onError}
      fallbackRender={({ error, resetErrorBoundary }) =>
        fallback ?? (
          <ErrorBoundaryFallback
            error={error}
            resetErrorBoundary={resetErrorBoundary}
            variant={variant}
          />
        )
      }
    >
      {children}
    </ReactErrorBoundary>
  );
}
