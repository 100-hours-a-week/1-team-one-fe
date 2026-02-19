import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ImageAddButton, ImageThumbnail, ImageUploadContainer } from '@repo/ui/image-upload';
import { toast } from '@repo/ui/toast';
import { useEffect, useRef, useState } from 'react';

import { IMAGE_UPLOAD_MESSAGES } from './config/messages';
import { IMAGE_UPLOAD_VALIDATION } from './config/validation';

type ImageValidatorContext = {
  file: File;
  currentCount: number;
  maxImages: number;
};

type ImageValidator = {
  check: (ctx: ImageValidatorContext) => boolean;
  message: string;
  action: 'skip' | 'stop';
};

const IMAGE_VALIDATORS: readonly ImageValidator[] = [
  {
    check: ({ file }) => file.size > IMAGE_UPLOAD_VALIDATION.MAX_SIZE_BYTES,
    message: IMAGE_UPLOAD_MESSAGES.SIZE_EXCEEDED,
    action: 'skip',
  },
  {
    check: ({ currentCount, maxImages }) => currentCount >= maxImages,
    message: IMAGE_UPLOAD_MESSAGES.MAX_COUNT,
    action: 'stop',
  },
];

interface SortableImageItemProps {
  id: string;
  src: string;
  isThumbnail: boolean;
  disabled?: boolean;
  onRemove: () => void;
}

function SortableImageItem({ id, src, isThumbnail, disabled, onRemove }: SortableImageItemProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <ImageThumbnail
        src={src}
        isThumbnail={isThumbnail}
        disabled={disabled}
        onRemove={onRemove}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export interface ImageUploadFieldProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
  disabled?: boolean;
  variant?: 'default' | 'borderless';
}

export function ImageUploadField({
  images,
  onImagesChange,
  maxImages = IMAGE_UPLOAD_VALIDATION.MAX_IMAGES,
  disabled,
  variant = 'default',
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = images.map((f) => URL.createObjectURL(f));
    setPreviews(urls);

    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [images]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleAddClick() {
    inputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (e.target) {
      e.target.value = '';
    }

    const validFiles: File[] = [];

    for (const file of files) {
      const ctx = { file, currentCount: images.length + validFiles.length, maxImages };
      const failed = IMAGE_VALIDATORS.find(({ check }) => check(ctx));

      if (!failed) {
        validFiles.push(file);
        continue;
      }

      toast({ title: failed.message, variant: 'error' });

      if (failed.action === 'stop') break;
    }

    if (validFiles.length === 0) return;

    onImagesChange([...images, ...validFiles]);
  }

  function handleRemove(index: number) {
    onImagesChange(images.filter((_, i) => i !== index));
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;

    const oldIdx = images.findIndex((_, i) => String(i) === active.id);
    const newIdx = images.findIndex((_, i) => String(i) === over.id);

    onImagesChange(arrayMove(images, oldIdx, newIdx));
  }

  const ids = images.map((_, i) => String(i));
  const canAdd = images.length < maxImages && !disabled;

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_UPLOAD_VALIDATION.ACCEPT}
        multiple
        className="sr-only"
        onChange={handleFileChange}
        disabled={disabled}
        aria-label="이미지 파일 선택"
      />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ids} strategy={horizontalListSortingStrategy}>
          <ImageUploadContainer>
            {canAdd && (
              <ImageAddButton
                onClick={handleAddClick}
                count={images.length}
                maxCount={maxImages}
                variant={variant}
              />
            )}
            {images.map((_, index) => (
              <SortableImageItem
                key={index}
                id={String(index)}
                src={previews[index] ?? ''}
                isThumbnail={index === 0}
                disabled={disabled}
                onRemove={() => handleRemove(index)}
              />
            ))}
          </ImageUploadContainer>
        </SortableContext>
      </DndContext>
    </div>
  );
}
