import { SignupPage } from '@/src/pages/signup';
import { withPublicLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = SignupPage;
Page.getLayout = withPublicLayout;

export default Page;
