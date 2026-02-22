import { ImageGallery } from '@repo/ui/image-gallery';
import { ImageLightbox } from '@repo/ui/image-lightbox';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import type { PostDetailDataType, PostLikeDataType } from '@/src/entities/post';
import { createLikeUpdater, useLikePostMutation } from '@/src/features/moments-like';
import { buildImageUrls } from '@/src/shared/lib/image';
import { createSingleOptimisticHandlers } from '@/src/shared/lib/react-query';
import { Divider } from '@/src/shared/ui/divider';
import { MomentsLikeButton } from '@/src/widgets/moments-like-button';
import { PostAuthorInfo } from '@/src/widgets/post-author-info';

import { MOMENTS_DETAIL_QUERY_KEYS } from '../config/query-keys';
import { PostDetailTags } from './PostDetailTags';

interface PostDetailViewProps {
  data: PostDetailDataType;
  isLoggedIn: boolean;
}

export function PostDetailView({ data, isLoggedIn }: PostDetailViewProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const queryClient = useQueryClient();

  const optimisticHandlers = createSingleOptimisticHandlers({
    queryClient,
    queryKey: MOMENTS_DETAIL_QUERY_KEYS.detail(data.postId),
    updater: createLikeUpdater<PostDetailDataType>(),
    onSuccessCallback: (responseData, variables) => {
      const serverData = responseData as PostLikeDataType;
      const queryKey = MOMENTS_DETAIL_QUERY_KEYS.detail((variables as { postId: number }).postId);
      queryClient.setQueryData<PostDetailDataType>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          isLiked: serverData.isLiked,
          likeCount: serverData.isLiked ? old.likeCount : Math.max(0, old.likeCount),
        };
      });
    },
  });

  const { mutate: likePost } = useLikePostMutation(optimisticHandlers);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  const handleLike = useCallback(() => {
    likePost({ postId: data.postId, isLiked: data.isLiked });
  }, [likePost, data.postId, data.isLiked]);

  const imageUrls = buildImageUrls(data.images);

  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col px-4 py-6">
      <PostAuthorInfo author={data.author} createdAt={data.createdAt} />
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
      <div className="flex items-center py-4">
        <MomentsLikeButton
          likeCount={data.likeCount}
          isLiked={data.isLiked}
          isLoggedIn={isLoggedIn}
          onLike={handleLike}
        />
      </div>
    </article>
  );
}
