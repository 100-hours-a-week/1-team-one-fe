import { ImageGallery } from '@repo/ui/image-gallery';
import { ImageLightbox } from '@repo/ui/image-lightbox';
import { useState } from 'react';

import type { PostDetailData } from '@/src/entities/post';
import { buildImageUrls } from '@/src/shared/lib/image';
import { Divider } from '@/src/shared/ui/divider';

import { PostDetailHeader } from './PostDetailHeader';
import { PostDetailTags } from './PostDetailTags';

interface PostDetailViewProps {
  data: PostDetailData;
}

export function PostDetailView({ data }: PostDetailViewProps) {
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

      {/* 이미지 + 라이트박스 */}
      {imageUrls.length > 0 && (
        <>
          <ImageGallery images={imageUrls} onImageClick={handleImageClick} variant="carousel" />
          <ImageLightbox
            images={imageUrls}
            initialIndex={selectedImageIndex}
            open={lightboxOpen}
            onOpenChange={setLightboxOpen}
          />
          <Divider />
        </>
      )}

      {data.tags.length > 0 && (
        <>
          <PostDetailTags tags={data.tags} />
          <Divider />
        </>
      )}

      {/* 좋아요 */}
      <div className="text-text-subtle py-4 text-sm">좋아요 {data.likeCount}개</div>
    </article>
  );
}
