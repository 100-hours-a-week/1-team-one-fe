// Optimistic update helpers
export type {
  InfiniteOptimisticConfig,
  InfiniteOptimisticContext,
  OptimisticUpdater,
  SingleOptimisticConfig,
  SingleOptimisticContext,
} from './optimistic';
export {
  createInfiniteItemUpdater,
  createInfiniteOptimisticHandlers,
  createSingleOptimisticHandlers,
  isInfiniteOptimisticContext,
  isSingleOptimisticContext,
} from './optimistic';

// Error handling
export { shouldThrowQueryError } from './error-handling';
