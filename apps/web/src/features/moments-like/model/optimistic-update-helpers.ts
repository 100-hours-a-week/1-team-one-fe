import type { InfiniteData, QueryClient, QueryKey } from '@tanstack/react-query';

import type {
  PostListItemType,
  PostListMetaDataType,
  PostListMetaItemType,
  PostListResponseDataType,
} from '@/src/entities/post';

import { MOMENTS_LIKE_CACHE_TARGETS } from './query-options';

interface MomentsListQuerySnapshot {
  queryKey: QueryKey;
  data: InfiniteData<PostListResponseDataType> | undefined;
}

interface MomentsListQueryUpdate {
  queryKey: QueryKey;
  previousData: InfiniteData<PostListResponseDataType> | undefined;
  nextData: InfiniteData<PostListResponseDataType>;
}

interface MomentsListMetaPageQuerySnapshot {
  queryKey: QueryKey;
  data: PostListMetaDataType | null | undefined;
}

interface MomentsListMetaPageQueryUpdate {
  queryKey: QueryKey;
  previousData: PostListMetaDataType | null | undefined;
  nextData: PostListMetaDataType;
}

type LikePatch = { type: 'toggle' } | { type: 'sync'; isLiked: boolean };

function resolveLikeCount(
  current: Pick<PostListItemType, 'isLiked' | 'likeCount'>,
  patch: LikePatch,
) {
  if (patch.type === 'toggle') {
    if (current.isLiked) {
      return Math.max(0, current.likeCount - 1);
    }
    return current.likeCount + 1;
  }

  if (current.isLiked === patch.isLiked) {
    return current.likeCount;
  }

  if (patch.isLiked) {
    return current.likeCount + 1;
  }

  return Math.max(0, current.likeCount - 1);
}

function resolveLikeState(current: Pick<PostListItemType, 'isLiked'>, patch: LikePatch) {
  if (patch.type === 'toggle') {
    return !current.isLiked;
  }

  return patch.isLiked;
}

function patchMetaItemLikeState(current: PostListMetaItemType, patch: LikePatch) {
  const nextIsLiked = resolveLikeState(current, patch);
  const nextLikeCount = resolveLikeCount(current, patch);

  if (current.isLiked === nextIsLiked && current.likeCount === nextLikeCount) {
    return current;
  }

  return {
    ...current,
    isLiked: nextIsLiked,
    likeCount: nextLikeCount,
  };
}

//리스트에서 좋아요 누를 때
function patchPostLikeInInfiniteData(
  data: InfiniteData<PostListResponseDataType> | undefined,
  postId: number,
  patch: LikePatch,
) {
  if (!data) return data;
  if (!Array.isArray(data.pages)) return data;

  let nextPages: PostListResponseDataType[] | null = null;

  data.pages.forEach((page, pageIndex) => {
    let nextPosts: PostListItemType[] | null = null;

    page.posts.forEach((post, postIndex) => {
      if (post.postId !== postId) return;

      const nextIsLiked = resolveLikeState(post, patch);
      const nextLikeCount = resolveLikeCount(post, patch);

      if (post.isLiked === nextIsLiked && post.likeCount === nextLikeCount) return;

      if (!nextPosts) {
        nextPosts = [...page.posts];
      }

      nextPosts[postIndex] = {
        ...post,
        isLiked: nextIsLiked,
        likeCount: nextLikeCount,
      };
    });

    if (!nextPosts) return;

    if (!nextPages) {
      nextPages = [...data.pages];
    }

    nextPages[pageIndex] = {
      ...page,
      posts: nextPosts,
    };
  });

  if (!nextPages) return data;

  return {
    ...data,
    pages: nextPages,
  };
}

export function getMomentsListQuerySnapshots(queryClient: QueryClient): MomentsListQuerySnapshot[] {
  const listRootOptions = MOMENTS_LIKE_CACHE_TARGETS.momentsListRoot();
  return queryClient
    .getQueriesData<InfiniteData<PostListResponseDataType>>(listRootOptions)
    .map(([queryKey, data]) => ({ queryKey, data }));
}

export function getMomentsListMetaPageQuerySnapshots(
  queryClient: QueryClient,
): MomentsListMetaPageQuerySnapshot[] {
  const metaPageRootOptions = MOMENTS_LIKE_CACHE_TARGETS.momentsListMetaPageRoot();

  return queryClient
    .getQueriesData<PostListMetaDataType | null>(metaPageRootOptions)
    .map(([queryKey, data]) => ({ queryKey, data }));
}

function createMomentsListQueryUpdates(
  snapshots: MomentsListQuerySnapshot[],
  postId: number,
  patch: LikePatch,
): MomentsListQueryUpdate[] {
  const updates: MomentsListQueryUpdate[] = [];

  snapshots.forEach(({ queryKey, data }) => {
    const nextData = patchPostLikeInInfiniteData(data, postId, patch);
    if (!nextData) return;
    if (nextData === data) return;

    updates.push({
      queryKey,
      previousData: data,
      nextData,
    });
  });

  return updates;
}

export function getToggleMomentsListQueryUpdates(
  snapshots: MomentsListQuerySnapshot[],
  postId: number,
): MomentsListQueryUpdate[] {
  return createMomentsListQueryUpdates(snapshots, postId, { type: 'toggle' });
}

export function getSyncMomentsListQueryUpdates(
  snapshots: MomentsListQuerySnapshot[],
  postId: number,
  nextIsLiked: boolean,
): MomentsListQueryUpdate[] {
  return createMomentsListQueryUpdates(snapshots, postId, { type: 'sync', isLiked: nextIsLiked });
}

export function applyMomentsListQueryUpdates(
  queryClient: QueryClient,
  updates: MomentsListQueryUpdate[],
) {
  updates.forEach(({ queryKey, nextData }) => {
    queryClient.setQueryData<InfiniteData<PostListResponseDataType>>(queryKey, nextData);
  });
}

function createMomentsListMetaPageQueryUpdates(
  snapshots: MomentsListMetaPageQuerySnapshot[],
  postId: number,
  patch: LikePatch,
): MomentsListMetaPageQueryUpdate[] {
  const updates: MomentsListMetaPageQueryUpdate[] = [];

  snapshots.forEach(({ queryKey, data }) => {
    if (!data) return;

    let nextPosts: PostListMetaItemType[] | null = null;

    data.posts.forEach((post, index) => {
      if (post.postId !== postId) return;

      const nextPost = patchMetaItemLikeState(post, patch);
      if (nextPost === post) return;

      if (!nextPosts) {
        nextPosts = [...data.posts];
      }

      nextPosts[index] = nextPost;
    });

    if (!nextPosts) return;

    updates.push({
      queryKey,
      previousData: data,
      nextData: {
        ...data,
        posts: nextPosts,
      },
    });
  });

  return updates;
}

export function getToggleMomentsListMetaPageQueryUpdates(
  snapshots: MomentsListMetaPageQuerySnapshot[],
  postId: number,
): MomentsListMetaPageQueryUpdate[] {
  return createMomentsListMetaPageQueryUpdates(snapshots, postId, { type: 'toggle' });
}

export function getSyncMomentsListMetaPageQueryUpdates(
  snapshots: MomentsListMetaPageQuerySnapshot[],
  postId: number,
  nextIsLiked: boolean,
): MomentsListMetaPageQueryUpdate[] {
  return createMomentsListMetaPageQueryUpdates(snapshots, postId, {
    type: 'sync',
    isLiked: nextIsLiked,
  });
}

export function applyMomentsListMetaPageQueryUpdates(
  queryClient: QueryClient,
  updates: MomentsListMetaPageQueryUpdate[],
) {
  updates.forEach(({ queryKey, nextData }) => {
    queryClient.setQueryData<PostListMetaDataType | null>(queryKey, nextData);
  });
}

export function togglePostLikeInAllMomentsListQueries(queryClient: QueryClient, postId: number) {
  const baseSnapshots = getMomentsListQuerySnapshots(queryClient);
  const baseUpdates = getToggleMomentsListQueryUpdates(baseSnapshots, postId);
  const metaSnapshots = getMomentsListMetaPageQuerySnapshots(queryClient);
  const metaUpdates = getToggleMomentsListMetaPageQueryUpdates(metaSnapshots, postId);

  applyMomentsListQueryUpdates(queryClient, baseUpdates);
  applyMomentsListMetaPageQueryUpdates(queryClient, metaUpdates);
}

export function syncPostLikeInAllMomentsListQueries(
  queryClient: QueryClient,
  postId: number,
  nextIsLiked: boolean,
) {
  const baseSnapshots = getMomentsListQuerySnapshots(queryClient);
  const baseUpdates = getSyncMomentsListQueryUpdates(baseSnapshots, postId, nextIsLiked);
  const metaSnapshots = getMomentsListMetaPageQuerySnapshots(queryClient);
  const metaUpdates = getSyncMomentsListMetaPageQueryUpdates(metaSnapshots, postId, nextIsLiked);

  applyMomentsListQueryUpdates(queryClient, baseUpdates);
  applyMomentsListMetaPageQueryUpdates(queryClient, metaUpdates);
}
