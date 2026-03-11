import { getHttpClient } from '@/src/shared/api';

import type { LeaderboardDataType, LeaderboardRequestParamsType } from '../model/types';
import type { GetUsersRankResponseDTO } from './dto/users-rank-get.dto';

export async function fetchUsersRankFn(
  params: LeaderboardRequestParamsType = {},
): Promise<LeaderboardDataType> {
  const client = getHttpClient({ requiresAuth: true });

  const response = await client.get<GetUsersRankResponseDTO>('/users/rank', {
    params: {
      limit: params.limit,
      cursor: params.cursor,
      direction: params.direction,
    },
  });

  return response.data.data;
}
