export type LeaderboardRankItemType = {
  rank: number;
  userId: number;
  nickname: string;
  profileImageUrl: string;
  level: number;
  exp: number;
  statusScore: number;
  streak: number;
};

export type LeaderboardCursorDirectionType = 'NEXT' | 'PREV';

export type LeaderboardPagingType = {
  prevCursor: string | null;
  nextCursor: string | null;
  hasPrev: boolean;
  hasNext: boolean;
};

export type LeaderboardDataType = {
  podium: LeaderboardRankItemType[];
  ranks: LeaderboardRankItemType[];
  myRank: LeaderboardRankItemType | null;
  paging: LeaderboardPagingType;
  lastUpdatedAt: string;
};

export type LeaderboardListQueryParamsType = {
  limit?: number;
};

export type LeaderboardRequestParamsType = LeaderboardListQueryParamsType & {
  cursor?: string;
  direction?: LeaderboardCursorDirectionType;
};
