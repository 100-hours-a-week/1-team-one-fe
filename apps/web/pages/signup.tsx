import { SignupPage } from '@/src/pages/signup';
import { createPublicLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = SignupPage;
Page.getLayout = createPublicLayout({ showFooter: false });

export default Page;
