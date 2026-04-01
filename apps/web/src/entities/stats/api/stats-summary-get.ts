import { getHttpClient } from '@/src/shared/api';

import type { StatsSummaryDataType } from '../model/types';
import type { GetStatsSummaryResponseDTO } from './dto/stats-summary-get.dto';

export async function fetchStatsSummaryFn(): Promise<StatsSummaryDataType> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.get<GetStatsSummaryResponseDTO>('/me/stats/summary');

  return response.data.data;
}
