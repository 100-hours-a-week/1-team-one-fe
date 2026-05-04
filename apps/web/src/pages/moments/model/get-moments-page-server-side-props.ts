import type { GetServerSideProps } from 'next';

import { fetchPublicPostListPageFn, type PostListResponseDataType } from '@/src/entities/post';
import { MOMENTS_LIST_CONFIG } from '@/src/features/moments-list';
import { normalizeStringList } from '@/src/shared/lib/list';

export interface MomentsPageProps {
  initialPageData?: PostListResponseDataType;
  initialListParams: {
    limit: number;
    tags?: string[];
  };
}

export const getMomentsPageServerSideProps: GetServerSideProps<MomentsPageProps> = async ({
  query,
}) => {
  const normalizedTags = normalizeStringList(query.tag);
  const initialListParams = {
    limit: MOMENTS_LIST_CONFIG.PAGE_LIMIT,
    tags: normalizedTags.length > 0 ? normalizedTags : undefined,
  };

  try {
    const initialPageData = await fetchPublicPostListPageFn(initialListParams);

    return {
      props: {
        initialPageData,
        initialListParams,
      },
    };
  } catch {
    return {
      props: {
        initialListParams,
      },
    };
  }
};
