import type { InfiniteData } from '@tanstack/react-query';

import type { InfiniteOptimisticConfig } from './types';
import { isInfiniteOptimisticContext } from './types';

/**
 * 무한스크롤용 optimistic update handlers 생성
 * @param config QueryClient, queryKeys, updater 함수 등 설정
 * @returns onMutate, onError, onSuccess, onSettled 핸들러
 */
export function createInfiniteOptimisticHandlers<TPageData, TVariables, TError = unknown>(
  config: InfiniteOptimisticConfig<InfiniteData<TPageData>, TVariables, TError>,
) {
  const { queryClient, queryKeys, updater, onErrorCallback, onSuccessCallback } = config;

  return {
    onMutate: async (variables: TVariables) => {
      //모든 쿼리 cancel
      await Promise.all(queryKeys.map((key) => queryClient.cancelQueries({ queryKey: key })));

      //이전 데이터 스냅샷 저장
      const previousQueries = queryKeys.map((queryKey) => ({
        queryKey,
        data: queryClient.getQueryData<InfiniteData<TPageData>>(queryKey),
      }));

      //setQuery로 optimistic update 적용
      queryKeys.forEach((queryKey) => {
        queryClient.setQueryData<InfiniteData<TPageData>>(queryKey, (old) =>
          updater(old, variables),
        );
      });

      return { previousQueries };
    },

    onError: (error: TError, variables: TVariables, context: unknown) => {
      if (!isInfiniteOptimisticContext<InfiniteData<TPageData>>(context)) return;

      //에러 시 이전 상태로 롤백
      context.previousQueries.forEach(({ queryKey, data }) => {
        if (data !== undefined) {
          queryClient.setQueryData(queryKey, data);
        }
      });

      onErrorCallback?.(error, variables, context);
    },

    onSuccess: (data: unknown, variables: TVariables, context: unknown) => {
      onSuccessCallback?.(data, variables, context);
    },

    onSettled: () => {
      // 모든 쿼리 무효화
      void Promise.all(queryKeys.map((key) => queryClient.invalidateQueries({ queryKey: key })));
    },
  };
}

/**
 * 무한스크롤 데이터 내부의 특정 아이템을 업데이트하는 updater 생성
 * @param getItems 페이지에서 아이템 배열 추출
 * @param getItemId 아이템의 고유 id 추출
 * @param updateItem 아이템 업데이트 함수
 * @returns InfiniteData updater 함수
 */
export function createInfiniteItemUpdater<TPageData extends object, TItem, TKey>(
  getItems: (page: TPageData) => TItem[],
  getItemId: (item: TItem) => TKey,
  updateItem: (item: TItem) => TItem,
) {
  return (
    data: InfiniteData<TPageData> | undefined,
    targetId: TKey,
  ): InfiniteData<TPageData> | undefined => {
    if (!data) return data;

    return {
      ...data,
      pages: data.pages.map((page) => {
        const items = getItems(page);
        const updatedItems = items.map((item) =>
          getItemId(item) === targetId ? updateItem(item) : item,
        );
        //페이지 객체를 복사하고 아이템 배열만 업데이트
        const itemsKey = Object.keys(page).find((key) =>
          Array.isArray((page as Record<string, unknown>)[key]),
        );
        if (!itemsKey) return page;
        return { ...page, [itemsKey]: updatedItems } as TPageData;
      }),
    };
  };
}
