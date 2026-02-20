import { Chip } from '@repo/ui/chip';

import type { PostTag } from '@/src/entities/post';

interface PostDetailTagsProps {
  tags: PostTag[];
}

export function PostDetailTags({ tags }: PostDetailTagsProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 py-4">
      {tags.map((tag) => {
        const tagNameWithSharp = `#${tag.name}`;
        return <Chip key={tag.tagId} label={tagNameWithSharp} variant="default" size="sm" />;
      })}
    </div>
  );
}
