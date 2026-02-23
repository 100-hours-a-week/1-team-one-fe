import type { ApiResponse } from '@/src/shared/api';

export interface DndUpdateRequestDTO {
  dndFinishedAt: string;
}

export interface DndUpdateDataType {
  dndFinishedAt: string;
}

export type DndUpdateResponseDTO = ApiResponse<DndUpdateDataType>;
