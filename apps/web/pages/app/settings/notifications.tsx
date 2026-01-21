import { AppSettingsNotificationsPage } from '@/src/pages/app-settings';
import { withAuthenticatedLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = AppSettingsNotificationsPage;
Page.getLayout = withAuthenticatedLayout;

export default Page;
