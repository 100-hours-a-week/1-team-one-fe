import { LoginPage } from '@/src/pages/login';
import { withPublicLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = LoginPage;
Page.getLayout = withPublicLayout;

export default Page;
