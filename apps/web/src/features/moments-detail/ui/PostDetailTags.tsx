import { Chip } from '@repo/ui/chip';

import type { PostTagType } from '@/src/entities/post';

interface PostDetailTagsProps {
  tags: PostTagType[];
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
