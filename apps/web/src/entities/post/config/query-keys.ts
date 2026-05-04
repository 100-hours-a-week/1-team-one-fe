export type PostListQueryParams = {
  limit: number;
  authorId?: number;
  tags?: string[];
};

export type PostListPageQueryParams = PostListQueryParams & {
  cursor?: string | null;
};

export const POST_QUERY_KEYS = {
  root: () => ['post'] as const,
  detail: (postId: number) => [...POST_QUERY_KEYS.root(), 'detail', postId] as const,
  meta: (postId: number) => [...POST_QUERY_KEYS.root(), 'meta', postId] as const,
  listRoot: () => [...POST_QUERY_KEYS.root(), 'list'] as const,
  list: (params: PostListQueryParams) => [...POST_QUERY_KEYS.listRoot(), params] as const,
  listMetaPageRoot: () => [...POST_QUERY_KEYS.root(), 'list-meta-page'] as const,
  listMetaPage: (params: PostListPageQueryParams) =>
    [
      ...POST_QUERY_KEYS.listMetaPageRoot(),
      {
        limit: params.limit,
        authorId: params.authorId,
        tags: params.tags,
        cursor: params.cursor ?? null,
      },
    ] as const,
} as const;
