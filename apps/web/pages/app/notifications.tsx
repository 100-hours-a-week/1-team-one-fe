import { AppSettingsNotificationsPage } from '@/src/pages/app-settings';
import { createAuthenticatedLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = AppSettingsNotificationsPage;
Page.getLayout = createAuthenticatedLayout({
  showFooter: false,
  headerConfig: {
    variant: 'sub',
    title: '알림 로그',
  },
});

export default Page;
