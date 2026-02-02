import { LOADING_CONFIG } from '@/src/shared/config/loading';

export function TopProgressBar() {
  return (
    <div
      role="progressbar"
      aria-label="Page loading"
      className="fixed top-0 right-0 left-0 overflow-hidden"
      style={{ height: `${LOADING_CONFIG.TOP_PROGRESS_HEIGHT}px`, zIndex: LOADING_CONFIG.Z_INDEX }}
    >
      <div className="animate-progress-indeterminate bg-brand-600 h-full w-full" />
    </div>
  );
}
