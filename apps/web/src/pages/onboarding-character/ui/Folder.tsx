import { cn } from '@repo/ui/lib/utils';
import type { ReactNode } from 'react';
import { useState } from 'react';

type FolderSize = 'sm' | 'md' | 'lg';

type FolderProps = {
  size?: FolderSize;
  items?: ReactNode[];
  className?: string;
};

const MAX_ITEMS = 3;

type PaperStyle = {
  base: string;
  open: string;
};

const PAPER_STYLES: PaperStyle[] = [
  {
    base: 'bg-neutral-200 h-4/5 w-3/4',
    open: '-translate-x-full -translate-y-2/3 -rotate-12',
  },
  {
    base: 'bg-neutral-100 h-3/4 w-4/5',
    open: 'translate-x-1/12 -translate-y-2/3 rotate-12 h-4/5',
  },
  {
    base: 'bg-neutral-0 h-3/5 w-11/12',
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

export function Folder({ size = 'md', items = [], className }: FolderProps) {
  const [open, setOpen] = useState(false);
  const papers = items.slice(0, MAX_ITEMS);

  while (papers.length < MAX_ITEMS) {
    papers.push(null);
  }

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const sizeStyle = SIZE_STYLES[size];

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          'group relative cursor-pointer transition-transform duration-200 ease-in',
          open ? '-translate-y-2' : 'hover:-translate-y-2',
        )}
        aria-pressed={open}
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

            return (
              <div
                key={index}
                className={cn(
                  'absolute bottom-2 left-1/2 rounded-lg transition-all duration-300 ease-in-out',
                  '-translate-x-1/2 translate-y-2',
                  paperStyle?.base,
                  open ? paperStyle?.open : 'group-hover:translate-y-0',
                  open && 'hover:scale-110',
                )}
              >
                {item}
              </div>
            );
          })}

          <div
            className={cn(
              'bg-brand-500 absolute inset-0 origin-bottom rounded-tr-lg rounded-br-lg rounded-bl-lg transition-all duration-300 ease-in-out',
              open ? 'scale-y-75 skew-x-12' : 'group-hover:scale-y-75 group-hover:skew-x-12',
            )}
          />
          <div
            className={cn(
              'bg-brand-500 absolute inset-0 origin-bottom rounded-tr-lg rounded-br-lg rounded-bl-lg transition-all duration-300 ease-in-out',
              open ? 'scale-y-75 -skew-x-12' : 'group-hover:scale-y-75 group-hover:-skew-x-12',
            )}
          />
        </div>
      </button>
    </div>
  );
}
