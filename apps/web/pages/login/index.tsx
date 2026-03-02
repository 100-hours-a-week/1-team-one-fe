import { LoginPage } from '@/src/pages/login';
import { createPublicLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = LoginPage;
Page.getLayout = createPublicLayout({
  showFooter: false,
  headerConfig: { variant: 'sub', back: false },
});

export default Page;
