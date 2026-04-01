import type { ApiResponse } from '@/src/shared/api';

import type { LeaderboardDataType } from '../../model/types';

export type GetUsersRankResponseDTO = ApiResponse<LeaderboardDataType>;
