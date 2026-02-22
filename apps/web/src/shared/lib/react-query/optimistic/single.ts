import type { SingleOptimisticConfig } from './types';
import { isSingleOptimisticContext } from './types';

/**
 * 일반 data optimistic update handlers 생성
 * @param config QueryClient, queryKey, updater 함수 등 설정
 * @returns onMutate, onError, onSuccess, onSettled 핸들러
 */
export function createSingleOptimisticHandlers<TData, TVariables, TError = unknown>(
  config: SingleOptimisticConfig<TData, TVariables, TError>,
) {
  const { queryClient, queryKey, updater, onErrorCallback, onSuccessCallback } = config;

  return {
    onMutate: async (variables: TVariables) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<TData>(queryKey);
      queryClient.setQueryData<TData>(queryKey, (old) => updater(old, variables));
      return { previousData };
    },

    onError: (error: TError, variables: TVariables, context: unknown) => {
      if (!isSingleOptimisticContext<TData>(context)) return;
      if (context.previousData !== undefined) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      onErrorCallback?.(error, variables, context);
    },

    onSuccess: (data: unknown, variables: TVariables, context: unknown) => {
      onSuccessCallback?.(data, variables, context);
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  };
}
