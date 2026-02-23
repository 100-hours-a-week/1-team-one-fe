import { MomentsDetailPage } from '@/src/pages/moments-detail';
import { createPublicLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = MomentsDetailPage;
Page.getLayout = createPublicLayout({
  headerConfig: {
    variant: 'sub',
    title: '게시글 상세보기',
    back: true,
  },
});

export default Page;
