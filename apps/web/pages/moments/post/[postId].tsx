import type { GetStaticPaths, GetStaticProps } from 'next';

import type { PostDetailDataType } from '@/src/entities/post';
import { fetchPublicPostDetailFn } from '@/src/entities/post';
import { MomentsDetailPage } from '@/src/pages/moments-detail';
import { isApiError } from '@/src/shared/api';
import { CACHE_STRATEGIES } from '@/src/shared/config/cache-strategies';
import { createPublicLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

interface PageProps {
  initialData: PostDetailDataType;
}

const Page: NextPageWithLayout<PageProps> = ({ initialData }) => (
  <MomentsDetailPage initialData={initialData} />
);

Page.getLayout = createPublicLayout({
  headerConfig: {
    variant: 'sub',
    title: '게시글 상세보기',
    back: true,
  },
});

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: 'blocking', // 첫 요청에 서버 생성 → 이후 캐시 제공
});

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const postId = Number(params?.postId);

  if (Number.isNaN(postId) || postId <= 0) {
    return { notFound: true };
  }

  try {
    const initialData = await fetchPublicPostDetailFn(postId);
    return {
      props: { initialData },
      ...CACHE_STRATEGIES.MOMENTS_DETAIL,
    };
  } catch (err) {
    //게시글이 존재하지 않음 → 404 페이지
    if (isApiError(err) && err.status === 404) {
      return { notFound: true };
    }
    // 그 외 서버 에러 - throw → Next가 이전 캐시 유지, 다음 요청에 재시도
    throw err;
  }
};

export default Page;
