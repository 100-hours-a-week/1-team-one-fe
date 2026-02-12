import { createAuthenticatedLayout } from '@/src/shared/lib/layout/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = function AppCommunityPage() {
  return <div>App community Page</div>;
};

Page.getLayout = createAuthenticatedLayout({
  showFooter: true,
  headerConfig: {
    variant: 'sub',
    title: '커뮤니티',
  },
});

export default Page;
