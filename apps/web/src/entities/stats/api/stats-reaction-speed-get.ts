import { getHttpClient } from '@/src/shared/api';

import type { StatsReactionSpeedDataType, StatsReactionSpeedQueryParamsType } from '../model/types';
import type { GetStatsReactionSpeedResponseDTO } from './dto/stats-reaction-speed-get.dto';

export async function fetchStatsReactionSpeedFn(
  params: StatsReactionSpeedQueryParamsType,
): Promise<StatsReactionSpeedDataType> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.get<GetStatsReactionSpeedResponseDTO>('/me/stats/reaction-speed', {
    params: {
      view: params.view,
    },
  });

  return response.data.data;
}
