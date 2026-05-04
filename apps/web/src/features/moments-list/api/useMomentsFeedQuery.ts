import { type InfiniteData, useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';

import {
  type PostListMetaDataType,
  postListMetaPageQueryOptions,
  type PostListPageQueryParams,
  type PostListResponseDataType,
} from '@/src/entities/post';

import type { MomentsListQueryParams } from '../model/types';
import { usePostsInfiniteQuery } from './usePostsInfiniteQuery';

interface MomentsFeedQueryOptions {
  isLoggedIn?: boolean;
  initialPageData?: PostListResponseDataType;
  initialListParams?: MomentsListQueryParams;
}

function areMomentsListParamsEqual(
  currentParams: MomentsListQueryParams,
  initialParams?: MomentsListQueryParams,
) {
  if (!initialParams) return false;
  if (currentParams.limit !== initialParams.limit) return false;
  if (currentParams.authorId !== initialParams.authorId) return false;

  const currentTags = currentParams.tags ?? [];
  const initialTags = initialParams.tags ?? [];

  if (currentTags.length !== initialTags.length) return false;

  return currentTags.every((tag, index) => tag === initialTags[index]);
}

function buildInitialInfiniteData(
  initialPageData?: PostListResponseDataType,
): InfiniteData<PostListResponseDataType, string | null> | undefined {
  if (!initialPageData) return undefined;

  return {
    pages: [initialPageData],
    pageParams: [null],
  };
}

function buildMetaPageParams(
  data: InfiniteData<PostListResponseDataType, unknown> | undefined,
  params: MomentsListQueryParams,
): PostListPageQueryParams[] {
  if (!data) return [];

  return data.pages.map((_page, index) => ({
    limit: params.limit,
    authorId: params.authorId,
    tags: params.tags,
    cursor: (data.pageParams[index] as string | null | undefined) ?? null,
  }));
}

function mergePostsWithMeta(
  data: InfiniteData<PostListResponseDataType, unknown> | undefined,
  metaPages: Array<PostListMetaDataType | null | undefined>,
) {
  if (!data) return data;

  return {
    ...data,
    pages: data.pages.map((page, index) => {
      const metaPage = metaPages[index];

      if (!metaPage?.posts.length) {
        return page;
      }

      const metaMap = new Map(metaPage.posts.map((meta) => [meta.postId, meta]));

      return {
        ...page,
        posts: page.posts.map((post) => {
          const meta = metaMap.get(post.postId);

          if (!meta) {
            return post;
          }

          return {
            ...post,
            likeCount: meta.likeCount,
            isLiked: meta.isLiked,
          };
        }),
      };
    }),
  };
}

export function useMomentsFeedQuery(
  params: MomentsListQueryParams,
  options?: MomentsFeedQueryOptions,
) {
  const isLoggedIn = options?.isLoggedIn ?? false;
  const shouldUseInitialData =
    !!options?.initialPageData && areMomentsListParamsEqual(params, options.initialListParams);

  const baseQuery = usePostsInfiniteQuery(params, {
    initialData: shouldUseInitialData
      ? buildInitialInfiniteData(options?.initialPageData)
      : undefined,
    refetchOnMount: shouldUseInitialData ? false : undefined,
  });

  const metaPageParams = useMemo(
    () => (isLoggedIn ? buildMetaPageParams(baseQuery.data, params) : []),
    [baseQuery.data, isLoggedIn, params],
  );

  const metaQueries = useQueries({
    queries: metaPageParams.map((metaParams) => ({
      ...postListMetaPageQueryOptions(metaParams),
      enabled: isLoggedIn,
    })),
  });

  const mergedData = useMemo(
    () =>
      mergePostsWithMeta(
        baseQuery.data,
        metaQueries.map((query) => query.data),
      ),
    [baseQuery.data, metaQueries],
  );

  return {
    ...baseQuery,
    data: mergedData,
  };
}
