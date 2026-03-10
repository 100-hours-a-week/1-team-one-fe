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

export type LeaderboardPagingType = {
  nextCursor: string | null;
  hasNext: boolean;
};

export type LeaderboardDataType = {
  podium: LeaderboardRankItemType[];
  ranks: LeaderboardRankItemType[];
  myRank: LeaderboardRankItemType | null;
  paging: LeaderboardPagingType;
};

export type LeaderboardListQueryParamsType = {
  limit?: number;
};

export type LeaderboardRequestParamsType = LeaderboardListQueryParamsType & {
  cursor?: string;
};
