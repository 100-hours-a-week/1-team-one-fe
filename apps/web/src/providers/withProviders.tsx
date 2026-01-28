import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ComponentType } from 'react';

import { shouldThrowQueryError } from '@/src/shared/lib/query/should-throw-query-error';

const queryClient = new QueryClient({
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

const isDev = process.env.NODE_ENV === 'development';

export function withProviders<TProps extends object>(AppComponent: ComponentType<TProps>) {
  return function WithProviders(props: TProps) {
    return (
      <QueryClientProvider client={queryClient}>
        <AppComponent {...props} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    );
  };
}
