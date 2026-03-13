import type { ApiResponse } from '@/src/shared/api';

import type { StatsSummaryDataType } from '../../model/types';

export type GetStatsSummaryResponseDTO = ApiResponse<StatsSummaryDataType>;
