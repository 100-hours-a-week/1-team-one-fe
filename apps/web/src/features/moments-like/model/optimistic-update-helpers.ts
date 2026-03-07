import type { InfiniteData, QueryClient, QueryKey } from '@tanstack/react-query';

import type { PostListItemType, PostListResponseDataType } from '@/src/entities/post';

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

type LikePatch = { type: 'toggle' } | { type: 'sync'; isLiked: boolean };

function resolveLikeCount(current: PostListItemType, patch: LikePatch) {
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

function resolveLikeState(current: PostListItemType, patch: LikePatch) {
  if (patch.type === 'toggle') {
    return !current.isLiked;
  }

  return patch.isLiked;
}

function patchPostLikeInInfiniteData(
  data: InfiniteData<PostListResponseDataType> | undefined,
  postId: number,
  patch: LikePatch,
) {
  if (!data) return data;

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

export function togglePostLikeInAllMomentsListQueries(queryClient: QueryClient, postId: number) {
  const snapshots = getMomentsListQuerySnapshots(queryClient);
  const updates = getToggleMomentsListQueryUpdates(snapshots, postId);
  applyMomentsListQueryUpdates(queryClient, updates);
}

export function syncPostLikeInAllMomentsListQueries(
  queryClient: QueryClient,
  postId: number,
  nextIsLiked: boolean,
) {
  const snapshots = getMomentsListQuerySnapshots(queryClient);
  const updates = getSyncMomentsListQueryUpdates(snapshots, postId, nextIsLiked);
  applyMomentsListQueryUpdates(queryClient, updates);
}
