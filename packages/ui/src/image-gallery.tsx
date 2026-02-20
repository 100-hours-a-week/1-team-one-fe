import { cn } from './lib/utils';

const VARIANT_STYLES = {
  thumbnail: {
    item: 'h-20 w-20',
    container: 'overflow-x-scroll',
    gap: 'gap-2',
    badge: 'right-0 bottom-0 left-0 py-0.5 text-center text-[10px] font-medium',
  },
  carousel: {
    item: 'h-64 w-[calc(33.333%-0.5rem)]',
    container: 'overflow-x-auto scrollbar-hide scroll-smooth',
    gap: 'gap-2',
    badge: 'right-2 bottom-2 rounded px-2 py-1 text-xs',
  },
} as const;

export interface ImageGalleryItemProps {
  src: string;
  alt?: string;
  isThumbnail?: boolean;
  onClick?: () => void;
  variant?: 'thumbnail' | 'carousel';
  urlPrefix?: string;
}

export function ImageGalleryItem({
  src,
  alt = '',
  isThumbnail,
  onClick,
  variant = 'thumbnail',
  urlPrefix,
}: ImageGalleryItemProps) {
  const styles = VARIANT_STYLES[variant];
  const imageUrl = urlPrefix ? `${urlPrefix}/${src}` : src;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative shrink-0 overflow-hidden',
        variant === 'carousel' ? 'rounded-lg' : '',
        styles.item,
        onClick && 'cursor-pointer',
        'focus-visible:ring-focus-ring aspect-square h-auto focus-visible:ring-2 focus-visible:outline-none',
      )}
    >
      <img src={imageUrl} alt={alt} className={'h-full w-full object-cover'} />

      {isThumbnail && (
        <span className={cn('absolute bg-black/60 text-white', styles.badge)}>대표</span>
      )}
    </button>
  );
}

export interface ImageGalleryProps {
  images: string[];
  onImageClick?: (index: number) => void;
  className?: string;
  variant?: 'thumbnail' | 'carousel';
  imageUrlPrefix?: string;
}

export function ImageGallery({
  images,
  onImageClick,
  className,
  variant = 'thumbnail',
  imageUrlPrefix,
}: ImageGalleryProps) {
  if (images.length === 0) {
    return null;
  }

  const styles = VARIANT_STYLES[variant];

  return (
    <div className={cn('relative w-full', className)} role="region" aria-label="이미지 갤러리">
      <div className={cn('w-full', styles.container)}>
        <div className={cn('flex py-5', styles.gap)}>
          {images.map((src, index) => (
            <ImageGalleryItem
              key={src}
              src={src}
              alt={`이미지 ${index + 1}`}
              isThumbnail={index === 0}
              onClick={() => onImageClick?.(index)}
              variant={variant}
              urlPrefix={imageUrlPrefix}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
