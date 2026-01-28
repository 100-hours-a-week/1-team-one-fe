import { AppMainPage } from '@/src/pages/app-main';
import { createAuthenticatedLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = AppMainPage;
Page.getLayout = createAuthenticatedLayout();

export default Page;
