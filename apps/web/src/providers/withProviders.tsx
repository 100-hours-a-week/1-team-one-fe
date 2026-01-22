import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ComponentType } from 'react';

const queryClient = new QueryClient();

export function withProviders<TProps extends object>(AppComponent: ComponentType<TProps>) {
  return function WithProviders(props: TProps) {
    return (
      <QueryClientProvider client={queryClient}>
        <AppComponent {...props} />
      </QueryClientProvider>
    );
  };
}
