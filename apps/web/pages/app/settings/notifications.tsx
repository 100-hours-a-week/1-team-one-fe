import { AppSettingsNotificationsPage } from '@/src/pages/app-settings';
import { withAppLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = AppSettingsNotificationsPage;
Page.getLayout = withAppLayout;

export default Page;
