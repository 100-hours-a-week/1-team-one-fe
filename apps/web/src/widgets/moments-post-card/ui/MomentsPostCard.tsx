import { Card, CardContent, CardFooter, CardHeader } from '@repo/ui/card';
import { Chip } from '@repo/ui/chip';
import Link from 'next/link';
import { useRouter } from 'next/router';

import type { PostListItemType } from '@/src/entities/post';
import {
  MomentsLikeButton,
  useLikePostMutation,
  useLikePostMutationOptions,
} from '@/src/features/moments-like';
import { MOMENTS_LIST_CONFIG } from '@/src/features/moments-list';
import { IMAGE_LCP_CANDIDATE } from '@/src/shared/config/image';
import { buildImageUrl } from '@/src/shared/lib/image';
import { buildMomentsDetailPath, buildMomentsUserFeedPath } from '@/src/shared/routes';
import { OptimizedImage } from '@/src/shared/ui/optimized-image';
import { PostAuthorInfo } from '@/src/widgets/post-author-info';

interface MomentsPostCardItemProps {
  post: PostListItemType;
  isLoggedIn: boolean;
  isLcpCandidate: boolean;
}

export function MomentsPostCardItem({
  post,
  isLoggedIn,
  isLcpCandidate,
}: MomentsPostCardItemProps) {
  const router = useRouter();
  const detailHref = buildMomentsDetailPath(post.postId);
  const resolvedImageUrl = buildImageUrl(post.imageUrl);
  const optimisticHandlers = useLikePostMutationOptions();
  const { mutate: likePost } = useLikePostMutation(optimisticHandlers);
  const imageLcpCandidate = isLcpCandidate
    ? IMAGE_LCP_CANDIDATE.CANDIDATE
    : IMAGE_LCP_CANDIDATE.NON_CANDIDATE;

  const handleLike = () => {
    likePost({ postId: post.postId, isLiked: post.isLiked });
  };

  const handleAuthorClick = () => {
    void router.push(buildMomentsUserFeedPath(post.author.userId));
  };

  return (
    <Card padding="none" variant="elevated" className="flex flex-col gap-3 overflow-hidden">
      <CardHeader className="px-4 pt-4">
        <PostAuthorInfo
          author={post.author}
          createdAt={post.createdAt}
          onAuthorClick={handleAuthorClick}
        />
      </CardHeader>

      <CardContent className="px-4 pb-4">
        <Link href={detailHref} className="flex flex-col gap-2">
          {resolvedImageUrl && (
            <div className="overflow-hidden">
              <div className="relative h-48 w-full">
                <OptimizedImage
                  src={resolvedImageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  lcpCandidate={imageLcpCandidate}
                  sizes={MOMENTS_LIST_CONFIG.CARD_IMAGE_SIZES}
                />
              </div>
            </div>
          )}
          <h2 className="text-text text-lg font-semibold">{post.title}</h2>
          <p className="text-text-muted line-clamp-3 text-sm">{post.content}</p>
        </Link>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-3 px-4 pb-4">
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Chip
                key={tag.tagId}
                label={`${MOMENTS_LIST_CONFIG.TAG_PREFIX}${tag.name}`}
                variant="default"
                size="sm"
              />
            ))}
          </div>
        )}
        <div className="flex items-center justify-end">
          <MomentsLikeButton
            likeCount={post.likeCount}
            isLiked={post.isLiked}
            isLoggedIn={isLoggedIn}
            onLike={handleLike}
          />
        </div>
      </CardFooter>
    </Card>
  );
}

MomentsPostCardItem.displayName = 'MomentsPostCardItem';
