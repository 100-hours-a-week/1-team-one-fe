import { AppReportDetailPage } from '@/src/pages/app-report-detail';
import { createAuthenticatedLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = AppReportDetailPage;
Page.getLayout = createAuthenticatedLayout({
  showFooter: false,
  headerConfig: {
    variant: 'sub',
    title: '리포트 상세',
    back: true,
  },
});

export default Page;
