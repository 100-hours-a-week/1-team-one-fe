import type { InfiniteData } from '@tanstack/react-query';

import type { PostListItemType, PostListResponseDataType } from '@/src/entities/post';

//페이지네이션된 데이터에서 좋아요 상태를 불변하게 업데이트하기 위함
export function updatePostLikeInInfiniteData(
  data: InfiniteData<PostListResponseDataType> | undefined,
  postId: number,
  update: { isLiked: boolean; likeCount: number },
): InfiniteData<PostListResponseDataType> | undefined {
  if (!data) return data;

  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      posts: page.posts.map((post) =>
        post.postId === postId
          ? {
              ...post,
              isLiked: update.isLiked,
              likeCount: update.likeCount,
            }
          : post,
      ),
    })),
  };
}

//모든 페이지에서 특정 게시물 찾음
export function findPostInInfiniteData(
  data: InfiniteData<PostListResponseDataType> | undefined,
  postId: number,
): PostListItemType | null {
  if (!data) return null;

  for (const page of data.pages) {
    const post = page.posts.find((p) => p.postId === postId);
    if (post) return post;
  }

  return null;
}
