import { AppStatisticsPage } from '@/src/pages/app-statistics';
import { createAuthenticatedLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = AppStatisticsPage;

Page.getLayout = createAuthenticatedLayout({
  showFooter: true,
  headerConfig: {
    variant: 'sub',
    title: '통계',
  },
});

export default Page;
