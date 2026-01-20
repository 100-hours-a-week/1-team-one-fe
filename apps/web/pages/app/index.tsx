import { AppMainPage } from '@/src/pages/app-main';
import { withAppLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = AppMainPage;
Page.getLayout = withAppLayout;

export default Page;
