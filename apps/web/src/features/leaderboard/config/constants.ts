export const LEADERBOARD_CONFIG = {
  PAGE_LIMIT: 20,
  FRIENDS_TAB_ROW_LIMIT: 7,
  INFINITE_SCROLL_PREVIOUS_ROOT_MARGIN: '0px',
  INFINITE_SCROLL_NEXT_ROOT_MARGIN: '200px',
  LAST_UPDATED_AT_FORMAT: 'yyyy.MM.dd HH시 mm분',
} as const;

export const LEADERBOARD_ASSET_PATHS = {
  CHAMPION_CROWN: '/images/leaderboard/crown.png',
} as const;

export const LEADERBOARD_PODIUM_RANKS = [1, 2, 3] as const;
export type LeaderboardPodiumRankType = (typeof LEADERBOARD_PODIUM_RANKS)[number];

export const LEADERBOARD_PODIUM_LAYOUT_ORDER: readonly LeaderboardPodiumRankType[] = [2, 1, 3];
