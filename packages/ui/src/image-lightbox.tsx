import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Dialog } from 'radix-ui';

export interface ImageLightboxProps {
  images: string[];
  initialIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImageLightbox({
  images,
  initialIndex = 0,
  open,
  onOpenChange,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, open]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      }
      if (e.key === 'ArrowRight') {
        handleNext();
      }
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, handleNext, handlePrevious, onOpenChange]);

  if (images.length === 0) {
    return null;
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/90" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 닫기 */}
          <Dialog.Close
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            aria-label="닫기"
          >
            <X className="h-6 w-6" />
          </Dialog.Close>

          {/* 이미지 인덱스 */}
          <div className="absolute top-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-sm text-white">
            {currentIndex + 1} / {images.length}
          </div>

          {/* 이전 버튼 */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              aria-label="이전 이미지"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}

          {/* 이미지 */}
          <img
            src={images[currentIndex]}
            alt={`이미지 ${currentIndex + 1}`}
            className="max-h-full max-w-full object-contain"
          />

          {/* 다음 버튼 */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              aria-label="다음 이미지"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
