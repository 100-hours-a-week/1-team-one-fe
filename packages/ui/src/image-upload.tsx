import { X } from 'lucide-react';

import { cn } from './lib/utils';

export interface ImageThumbnailProps {
  src: string;
  onRemove: () => void;
  isThumbnail?: boolean;
  disabled?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export function ImageThumbnail({
  src,
  onRemove,
  isThumbnail,
  disabled,
  dragHandleProps,
}: ImageThumbnailProps) {
  return (
    <div className="relative shrink-0">
      <div
        {...dragHandleProps}
        className={cn(
          'relative h-20 w-20 overflow-hidden',
          dragHandleProps && 'cursor-grab active:cursor-grabbing',
        )}
      >
        <img src={src} alt="" className="h-full w-full object-cover" />

        {isThumbnail && (
          <span className="absolute right-0 bottom-0 left-0 bg-black/60 py-0.5 text-center text-[10px] font-medium text-white">
            대표
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        aria-label="이미지 삭제"
        className={cn(
          'bg-text text-bg absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full',
          'focus-visible:ring-focus-ring focus-visible:ring-2 focus-visible:outline-none',
          'disabled:pointer-events-none disabled:opacity-(--disabled-opacity)',
        )}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

export interface ImageAddButtonProps {
  onClick: () => void;
  disabled?: boolean;
  count: number;
  maxCount: number;
  variant?: 'default' | 'borderless';
}

export function ImageAddButton({
  onClick,
  disabled,
  count,
  maxCount,
  variant = 'default',
}: ImageAddButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="이미지 추가"
      className={cn(
        'flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-1',
        'text-text-subtle transition-colors',
        'focus-visible:ring-focus-ring focus-visible:ring-2 focus-visible:outline-none',
        'disabled:pointer-events-none disabled:opacity-(--disabled-opacity)',
        variant === 'default' && [
          'border-border border',
          'hover:border-border-strong hover:text-text',
        ],
        variant === 'borderless' && ['bg-neutral-50', 'hover:text-text hover:bg-neutral-100'],
      )}
    >
      <span className="text-xl leading-none">+</span>
      <span className="text-xs">
        {count}/{maxCount}
      </span>
    </button>
  );
}

export interface ImageUploadContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function ImageUploadContainer({ children, className }: ImageUploadContainerProps) {
  return (
    <div className={cn('w-full overflow-x-scroll pt-5', className)}>
      <div className="flex gap-2 pb-1">{children}</div>
    </div>
  );
}

ImageAddButton.displayName = 'ImageAddButton';
ImageUploadContainer.displayName = 'ImageUploadContainer';
