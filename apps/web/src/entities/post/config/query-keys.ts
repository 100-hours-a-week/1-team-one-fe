export type PostListQueryParams = {
  limit: number;
  authorId?: number;
  tags?: string[];
};

export const POST_QUERY_KEYS = {
  root: () => ['post'] as const,
  detail: (postId: number) => [...POST_QUERY_KEYS.root(), 'detail', postId] as const,
  meta: (postId: number) => [...POST_QUERY_KEYS.root(), 'meta', postId] as const,
  listRoot: () => [...POST_QUERY_KEYS.root(), 'list'] as const,
  list: (params: PostListQueryParams, isLoggedIn?: boolean) =>
    [...POST_QUERY_KEYS.listRoot(), params, { isLoggedIn: !!isLoggedIn }] as const,
} as const;
