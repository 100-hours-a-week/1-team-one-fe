import { AppReportsPage } from '@/src/pages/app-reports';
import { createAuthenticatedLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = AppReportsPage;
Page.getLayout = createAuthenticatedLayout({
  showFooter: false,
  headerConfig: {
    variant: 'sub',
    title: '세션 리포트',
  },
});

export default Page;
