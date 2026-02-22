// Optimistic update helpers
export type {
  InfiniteOptimisticConfig,
  InfiniteOptimisticContext,
  LikeableDataType,
  OptimisticUpdater,
  SingleOptimisticConfig,
  SingleOptimisticContext,
} from './optimistic';
export {
  createInfiniteItemUpdater,
  createInfiniteOptimisticHandlers,
  createLikeUpdater,
  createSingleOptimisticHandlers,
  isInfiniteOptimisticContext,
  isSingleOptimisticContext,
} from './optimistic';

// Error handling
export { shouldThrowQueryError } from './error-handling';
