import { ROUTINE_STATUSES, type RoutineData } from '../api/types';

export function isRoutineGenerating(routine?: RoutineData): boolean {
  if (!routine) return false;
  if (routine.status === ROUTINE_STATUSES.COMPLETED) return false;
  if (routine.status === ROUTINE_STATUSES.FAILED) return false;
  if (routine.generatingSubmissionId === null) return false;
  if (routine.status === ROUTINE_STATUSES.PENDING) return true;
  if (routine.status === ROUTINE_STATUSES.REQUESTED) return true;
  return false;
}
