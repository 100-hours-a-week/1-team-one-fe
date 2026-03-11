export const LEADERBOARD_ASSET_PATHS = {
  CHAMPION_CROWN: '/images/leaderboard/crown.png',
} as const;

export const LEADERBOARD_PODIUM_RANKS = [1, 2, 3] as const;
export type LeaderboardPodiumRankType = (typeof LEADERBOARD_PODIUM_RANKS)[number];

export const LEADERBOARD_PODIUM_LAYOUT_ORDER: readonly LeaderboardPodiumRankType[] = [2, 1, 3];
