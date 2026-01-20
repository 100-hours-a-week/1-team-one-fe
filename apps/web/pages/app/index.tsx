import { AppMainPage } from '@/src/pages/app-main';
import { withMobileLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = AppMainPage;
Page.getLayout = withMobileLayout;

export default Page;
