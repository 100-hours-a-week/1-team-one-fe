import type { LikeableDataType } from './types';

/**
 * 좋아요 토글 시 새로운 상태 계산
 * @param currentIsLiked 현재 좋아요 상태
 * @param currentLikeCount 현재 좋아요 수
 * @returns 새로운 좋아요 상태와 개수
 */
function calculateLikeUpdate(
  currentIsLiked: boolean,
  currentLikeCount: number,
): { isLiked: boolean; likeCount: number } {
  const newIsLiked = !currentIsLiked;
  const newLikeCount = newIsLiked ? currentLikeCount + 1 : Math.max(0, currentLikeCount - 1);

  return { isLiked: newIsLiked, likeCount: newLikeCount };
}

/**
 * 좋아요 updater 생성
 * @returns OptimisticUpdater 함수
 */
export function createLikeUpdater<TData extends LikeableDataType>() {
  return (data: TData | undefined): TData | undefined => {
    if (!data) return data;
    const { isLiked, likeCount } = calculateLikeUpdate(data.isLiked, data.likeCount);
    return { ...data, isLiked, likeCount };
  };
}
