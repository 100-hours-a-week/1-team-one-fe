import { cn } from '@repo/ui/lib/utils';

import { IMAGE_LCP_CANDIDATE } from '@/src/shared/config/image';
import { OptimizedImage } from '@/src/shared/ui/optimized-image';

const GALLERY_ITEM_SIZES = '(min-width: 768px) 240px, calc((100vw - 2rem - 1rem) / 3)';

interface PostDetailImageGalleryProps {
  images: string[];
  onImageClick?: (index: number) => void;
  className?: string;
}

interface PostDetailImageGalleryItemProps {
  src: string;
  alt: string;
  isThumbnail?: boolean;
  onClick?: () => void;
}

function PostDetailImageGalleryItem({
  src,
  alt,
  isThumbnail,
  onClick,
}: PostDetailImageGalleryItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'focus-visible:ring-focus-ring relative aspect-square h-auto w-[calc(33.333%-0.5rem)] shrink-0 overflow-hidden rounded-lg focus-visible:ring-2 focus-visible:outline-none',
        onClick ? 'cursor-pointer' : '',
      )}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        sizes={GALLERY_ITEM_SIZES}
        className="object-cover"
        lcpCandidate={IMAGE_LCP_CANDIDATE.NON_CANDIDATE}
      />

      {isThumbnail ? (
        <span className="absolute right-2 bottom-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
          대표
        </span>
      ) : null}
    </button>
  );
}

export function PostDetailImageGallery({
  images,
  onImageClick,
  className,
}: PostDetailImageGalleryProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className={cn('relative w-full', className)} role="region" aria-label="이미지 갤러리">
      <div className="scrollbar-hide w-full overflow-x-auto scroll-smooth">
        <div className="flex gap-2 py-5">
          {images.map((src, index) => (
            <PostDetailImageGalleryItem
              key={`${src}-${index}`}
              src={src}
              alt={`이미지 ${index + 1}`}
              isThumbnail={index === 0}
              onClick={() => onImageClick?.(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
