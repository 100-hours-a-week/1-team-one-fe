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
import { useEffect, useMemo, useRef, useState } from 'react';

import { buildImageUrl } from '@/src/shared/lib/image';
import type { MomentsPostImageItem } from '@/src/shared/types';
import { IMAGE_UPLOAD_MESSAGES } from '@/src/shared/ui/image-upload/config/messages';
import { IMAGE_UPLOAD_VALIDATION } from '@/src/shared/ui/image-upload/config/validation';

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

export interface MomentsPostImageFieldProps {
  images: MomentsPostImageItem[];
  onImagesChange: (images: MomentsPostImageItem[]) => void;
  maxImages?: number;
  disabled?: boolean;
  variant?: 'default' | 'borderless';
}

export function MomentsPostImageField({
  images,
  onImagesChange,
  maxImages = IMAGE_UPLOAD_VALIDATION.MAX_IMAGES,
  disabled,
  variant = 'default',
}: MomentsPostImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const nextIdRef = useRef(0);
  const previewUrlsRef = useRef(new Map<string, string>());
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const activeIds = new Set<string>();

    images.forEach((image) => {
      if (image.type !== 'new') return;
      activeIds.add(image.id);
      if (previewUrlsRef.current.has(image.id)) return;
      previewUrlsRef.current.set(image.id, URL.createObjectURL(image.file));
    });

    previewUrlsRef.current.forEach((url, id) => {
      if (activeIds.has(id)) return;
      URL.revokeObjectURL(url);
      previewUrlsRef.current.delete(id);
    });

    setPreviewUrls(Object.fromEntries(previewUrlsRef.current));
  }, [images]);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      previewUrlsRef.current.clear();
    };
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const previewItems = useMemo(
    () =>
      images.map((image) => ({
        id: image.id,
        src: image.type === 'existing' ? buildImageUrl(image.path) : (previewUrls[image.id] ?? ''),
      })),
    [images, previewUrls],
  );

  function handleAddClick() {
    if (disabled) return;
    inputRef.current?.click();
  }

  function createNewImageId() {
    const nextId = nextIdRef.current;
    nextIdRef.current += 1;
    return `new-${Date.now()}-${nextId}`;
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

    const nextItems = validFiles.map<MomentsPostImageItem>((file) => ({
      id: createNewImageId(),
      type: 'new',
      file,
    }));

    onImagesChange([...images, ...nextItems]);
  }

  function handleRemove(id: string) {
    onImagesChange(images.filter((image) => image.id !== id));
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;

    const oldIdx = images.findIndex((image) => image.id === active.id);
    const newIdx = images.findIndex((image) => image.id === over.id);
    if (oldIdx < 0 || newIdx < 0) return;

    onImagesChange(arrayMove(images, oldIdx, newIdx));
  }

  const ids = images.map((image) => image.id);
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
            {previewItems.map((item, index) => (
              <SortableImageItem
                key={item.id}
                id={item.id}
                src={item.src}
                isThumbnail={index === 0}
                disabled={disabled}
                onRemove={() => handleRemove(item.id)}
              />
            ))}
          </ImageUploadContainer>
        </SortableContext>
      </DndContext>
    </div>
  );
}

MomentsPostImageField.displayName = 'MomentsPostImageField';
