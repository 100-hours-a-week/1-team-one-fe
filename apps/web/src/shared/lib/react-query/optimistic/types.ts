import type { QueryClient, QueryKey } from '@tanstack/react-query';

export interface SingleOptimisticContext<TData> {
  previousData?: TData;
}

export interface InfiniteOptimisticContext<TData> {
  previousQueries: Array<{
    queryKey: QueryKey;
    data: TData | undefined;
  }>;
}

export type OptimisticUpdater<TData, TVariables> = (
  data: TData | undefined,
  variables: TVariables,
) => TData | undefined;

export interface SingleOptimisticConfig<TData, TVariables, TError = unknown> {
  queryClient: QueryClient;
  queryKey: QueryKey;
  updater: OptimisticUpdater<TData, TVariables>;
  onErrorCallback?: (error: TError, variables: TVariables, context?: unknown) => void;
  onSuccessCallback?: (data: unknown, variables: TVariables, context?: unknown) => void;
  onSettledCallback?: () => void;
  invalidateOnSettled?: boolean;
}

export interface InfiniteOptimisticConfig<TData, TVariables, TError = unknown> {
  queryClient: QueryClient;
  queryKeys: QueryKey[];
  updater: OptimisticUpdater<TData, TVariables>;
  onErrorCallback?: (error: TError, variables: TVariables, context?: unknown) => void;
  onSuccessCallback?: (data: unknown, variables: TVariables, context?: unknown) => void;
  onSettledCallback?: () => void;
  invalidateOnSettled?: boolean;
}

//타임가드용 함수
export function isSingleOptimisticContext<TData>(
  value: unknown,
): value is SingleOptimisticContext<TData> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'previousData' in value &&
    !('previousQueries' in value)
  );
}

export function isInfiniteOptimisticContext<TData>(
  value: unknown,
): value is InfiniteOptimisticContext<TData> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'previousQueries' in value &&
    Array.isArray((value as InfiniteOptimisticContext<TData>).previousQueries)
  );
}
