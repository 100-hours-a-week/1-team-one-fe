import { cn } from '@repo/ui/lib/utils';
import type { ReactNode } from 'react';
import { useState } from 'react';

type FolderSize = 'sm' | 'md' | 'lg';

type FolderProps = {
  size?: FolderSize;
  items?: ReactNode[];
  selectedIndex?: number | null;
  onItemSelect?: (index: number) => void;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onToggle?: (nextOpen: boolean) => void;
  enableToggle?: boolean;
  className?: string;
};

const MAX_ITEMS = 3;

type PaperStyle = {
  surface: string;
  size: string;
  open: string;
};

const PAPER_STYLES: PaperStyle[] = [
  {
    surface: 'bg-neutral-200',
    size: 'h-4/5 w-3/4',
    open: '-translate-x-full -translate-y-2/3 -rotate-12',
  },
  {
    surface: 'bg-neutral-100',
    size: 'h-3/4 w-4/5',
    open: 'translate-x-1/12 -translate-y-2/3 rotate-12 h-4/5',
  },
  {
    surface: 'bg-neutral-0',
    size: 'h-3/5 w-11/12',
    open: '-translate-x-1/2 -translate-y-full rotate-6 h-4/5',
  },
];

const SIZE_STYLES: Record<FolderSize, { container: string; tab: string }> = {
  sm: {
    container: 'h-24 w-28',
    tab: 'h-3 w-11',
  },
  md: {
    container: 'h-28 w-32',
    tab: 'h-3.5 w-12',
  },
  lg: {
    container: 'h-32 w-36',
    tab: 'h-4 w-14',
  },
};

export function Folder({
  size = 'md',
  items = [],
  selectedIndex,
  onItemSelect,
  isOpen,
  defaultOpen = false,
  onToggle,
  enableToggle = true,
  className,
}: FolderProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const papers = items.slice(0, MAX_ITEMS);

  while (papers.length < MAX_ITEMS) {
    papers.push(null);
  }

  const open = isOpen ?? internalOpen;
  const canToggle = enableToggle && isOpen === undefined;
  const hasSelection = selectedIndex != null;

  const handleClick = () => {
    if (!enableToggle) {
      return;
    }

    if (isOpen !== undefined) {
      onToggle?.(!open);
      return;
    }

    if (!canToggle) {
      return;
    }

    setInternalOpen((prev) => !prev);
  };

  const sizeStyle = SIZE_STYLES[size];
  const wrapperClassName = cn(
    'group relative transition-transform duration-200 ease-in',
    enableToggle && 'cursor-pointer',
    open ? '-translate-y-2' : 'hover:-translate-y-2',
  );
  const selectedPaperClassName =
    'top-1/2 bottom-auto left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rotate-0 z-40';
  const selectedSurfaceClassName = 'scale-x-300 scale-y-400 shadow-xl';

  return (
    <div className={className}>
      <div
        className={wrapperClassName}
        onClick={handleClick}
        role="button"
        tabIndex={enableToggle ? 0 : -1}
        aria-pressed={open}
        onKeyDown={(event) => {
          if (!enableToggle) {
            return;
          }

          if (event.key !== 'Enter' && event.key !== ' ') {
            return;
          }

          event.preventDefault();
          handleClick();
        }}
      >
        <div
          className={cn(
            'bg-brand-400 relative rounded-tr-lg rounded-br-lg rounded-bl-lg',
            sizeStyle.container,
          )}
        >
          <div className={cn('bg-brand-400 absolute -top-2 left-0 rounded-t-md', sizeStyle.tab)} />

          {papers.map((item, index) => {
            const paperStyle = PAPER_STYLES[index];
            const isSelected = selectedIndex === index;
            const isSelectable = Boolean(onItemSelect) && !hasSelection;

            return (
              <button
                key={index}
                type="button"
                onClick={() => onItemSelect?.(index)}
                disabled={!isSelectable}
                aria-pressed={isSelected}
                className={cn(
                  'absolute bottom-2 left-1/2 rounded-lg transition-all duration-300 ease-in-out motion-reduce:transition-none',
                  'flex flex-col items-center justify-center gap-1 px-2 py-2 text-center',
                  '-translate-x-1/2 translate-y-0',
                  'z-10',
                  paperStyle?.size,
                  open && paperStyle?.open,
                  !hasSelection && open && 'hover:scale-110',
                  !isSelectable && 'cursor-default',
                  isSelectable && 'cursor-pointer',
                  hasSelection && 'rotate-0',
                  isSelected && selectedPaperClassName,
                )}
              >
                <div className="relative h-full w-full rounded-lg">
                  <div
                    className={cn(
                      'absolute inset-0 rounded-lg transition-transform duration-300 ease-in-out',
                      paperStyle?.surface,
                      isSelected && selectedSurfaceClassName,
                    )}
                  />
                  <div className="relative z-10 flex h-full min-h-full w-full flex-col items-center justify-center gap-1 px-2 py-2 text-center">
                    {item}
                  </div>
                </div>
              </button>
            );
          })}

          <div
            className={cn(
              'bg-brand-500 absolute inset-0 origin-bottom rounded-tr-lg rounded-br-lg rounded-bl-lg transition-all duration-300 ease-in-out',
              'z-20',
              open ? 'scale-y-75 skew-x-12' : 'group-hover:scale-y-75 group-hover:skew-x-12',
            )}
          />
          <div
            className={cn(
              'bg-brand-500 absolute inset-0 origin-bottom rounded-tr-lg rounded-br-lg rounded-bl-lg transition-all duration-300 ease-in-out',
              'z-20',
              open ? 'scale-y-75 -skew-x-12' : 'group-hover:scale-y-75 group-hover:-skew-x-12',
            )}
          />
        </div>
      </div>
    </div>
  );
}
