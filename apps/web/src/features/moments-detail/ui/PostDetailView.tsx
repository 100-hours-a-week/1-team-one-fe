import type { PostDetailData } from '@/src/entities/post';

import { PostDetailHeader } from './PostDetailHeader';

interface PostDetailViewProps {
  data: PostDetailData;
}

export function PostDetailView({ data }: PostDetailViewProps) {
  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col px-4 py-6">
      <PostDetailHeader author={data.author} createdAt={data.createdAt} />

      <h1 className="py-4 text-2xl font-bold">{data.title}</h1>
    </article>
  );
}
