export { createInfiniteItemUpdater, createInfiniteOptimisticHandlers } from './infinite';
export { createSingleOptimisticHandlers } from './single';
export type {
  InfiniteOptimisticConfig,
  InfiniteOptimisticContext,
  OptimisticUpdater,
  SingleOptimisticConfig,
  SingleOptimisticContext,
} from './types';
export { isInfiniteOptimisticContext, isSingleOptimisticContext } from './types';

// like updater helper
export { createLikeUpdater } from './like-updater';
export type { LikeableDataType } from './likeable-types';
