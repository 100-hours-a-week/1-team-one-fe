import { LoginPage } from '@/src/pages/login';
import { createPublicLayout } from '@/src/shared/lib/layout/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = LoginPage;
Page.getLayout = createPublicLayout({ showFooter: false });

export default Page;
