import { useRouter } from 'next/router';

import { usePostDetailQuery } from '@/src/features/moments-detail/api/usePostDetailQuery';
import { PostDetailView } from '@/src/features/moments-detail/ui/PostDetailView';

export function MomentsDetailPage() {
  const router = useRouter();
  const postId = Number(router.query.postId);

  const { data, error, isLoading } = usePostDetailQuery(postId, {
    enabled: !Number.isNaN(postId) && postId > 0,
  });

  if (!data) return <>none</>;

  return <PostDetailView data={data} />;
}
