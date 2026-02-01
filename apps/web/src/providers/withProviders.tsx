import { toast, ToastProvider } from '@repo/ui/toast';
import {
  type Mutation,
  MutationCache,
  type Query,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ComponentType } from 'react';

import { isApiError } from '@/src/shared/api';
import { HTTP_STATUS } from '@/src/shared/config/http-status';
import { TOAST_MESSAGES } from '@/src/shared/config/toast-messages';
import { shouldThrowQueryError } from '@/src/shared/lib/query/should-throw-query-error';

//401은 제외, 404/5xx는 errorBoundary로 위임, 그 외는 토스트로 처리
const shouldShowQueryToast = (error: unknown, query?: Query<unknown, unknown>): boolean => {
  //query meta 를 보고 toast 노출 여부 결정
  const meta = query?.meta as { disableToast?: boolean } | undefined;
  if (meta?.disableToast) return false;

  if (!isApiError(error)) return false;
  if (error.status === HTTP_STATUS.UNAUTHORIZED) return false;
  return !shouldThrowQueryError(error);
};

//토스트 노출 대상만 표시
const handleQueryError = (error: unknown, query?: Query<unknown, unknown>): void => {
  if (!shouldShowQueryToast(error, query)) return;
  const message = isApiError(error) ? error.message : TOAST_MESSAGES.ERROR_FALLBACK;
  toast({ title: message, variant: 'error' });
};

const shouldSkipMutationToast = (
  error: unknown,
  mutation?: Mutation<unknown, unknown, unknown, unknown>,
) => {
  const meta = mutation?.options?.meta as { disableToast?: boolean } | undefined;
  if (!meta?.disableToast) return false;
  if (!isApiError(error)) return true;
  if (error.status === HTTP_STATUS.NOT_FOUND) return false;
  if (error.status >= HTTP_STATUS.SERVER_ERROR_MIN) return false;
  return true;
};

//메타로 토스트 비활성화 가능, 401은 토스트를 생략
const handleMutationError = (
  error: unknown,
  _variables: unknown,
  _context: unknown,
  mutation?: Mutation<unknown, unknown, unknown, unknown>,
): void => {
  if (shouldSkipMutationToast(error, mutation)) return;
  if (!isApiError(error)) {
    toast({ title: TOAST_MESSAGES.ERROR_FALLBACK, variant: 'error' });
    return;
  }
  if (error.status === HTTP_STATUS.UNAUTHORIZED) return;
  const message = isApiError(error) ? error.message : TOAST_MESSAGES.ERROR_FALLBACK;
  toast({ title: message, variant: 'error' });
};

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => handleQueryError(error, query),
  }),
  mutationCache: new MutationCache({
    onError: handleMutationError,
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      throwOnError: shouldThrowQueryError,
      refetchOnReconnect: true,
      staleTime: 30_000,
      gcTime: 10 * 60_000,
    },
    mutations: {
      retry: 1,
    },
  },
});

export function withProviders<TProps extends object>(AppComponent: ComponentType<TProps>) {
  return function WithProviders(props: TProps) {
    return (
      <QueryClientProvider client={queryClient}>
        <AppComponent {...props} />
        <ToastProvider />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    );
  };
}
