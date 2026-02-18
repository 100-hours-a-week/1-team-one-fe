import { MomentsNewPage } from '@/src/pages/moments-new';
import { createAuthenticatedLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = MomentsNewPage;
Page.getLayout = createAuthenticatedLayout({
  headerConfig: {
    variant: 'sub',
    title: '새로운 모먼트',
    back: true,
  },
});

export default Page;
