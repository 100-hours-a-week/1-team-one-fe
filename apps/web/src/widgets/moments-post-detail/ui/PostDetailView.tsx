import { type ReactNode, useState } from 'react';

import type { PostDetailDataType } from '@/src/entities/post';
import { buildImageUrls } from '@/src/shared/lib/image';
import { Divider } from '@/src/shared/ui/divider';

import { PostDetailHeader } from './PostDetailHeader';
import { PostDetailImageGallery } from './PostDetailImageGallery';
import { PostDetailImageLightbox } from './PostDetailImageLightbox';
import { PostDetailTags } from './PostDetailTags';

interface PostDetailViewProps {
  data: PostDetailDataType;
  footer?: ReactNode;
}

export function PostDetailView({ data, footer }: PostDetailViewProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  const imageUrls = buildImageUrls(data.images);

  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col px-4 py-6">
      <PostDetailHeader author={data.author} createdAt={data.createdAt} />
      <h1 className="px-2 py-4 text-2xl font-bold">{data.title}</h1>
      <Divider />

      <div className="min-h-44 px-2 py-4 whitespace-pre-wrap">{data.content}</div>
      <Divider />

      {imageUrls.length > 0 ? (
        <>
          <PostDetailImageGallery images={imageUrls} onImageClick={handleImageClick} />
          <PostDetailImageLightbox
            images={imageUrls}
            initialIndex={selectedImageIndex}
            open={lightboxOpen}
            onOpenChange={setLightboxOpen}
          />
          <Divider />
        </>
      ) : null}

      {data.tags.length > 0 ? (
        <>
          <PostDetailTags tags={data.tags} />
          <Divider />
        </>
      ) : null}

      {footer ? <div className="flex items-center py-4">{footer}</div> : null}
    </article>
  );
}
