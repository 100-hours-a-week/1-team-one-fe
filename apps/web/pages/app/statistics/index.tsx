import { createAuthenticatedLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = function AppStatisticsPage() {
  return <div>App Statistics Page</div>;
};

Page.getLayout = createAuthenticatedLayout({
  showFooter: true,
  headerConfig: {
    variant: 'sub',
    title: '통계',
  },
});

export default Page;
