import { GuideInstallPage } from '@/src/pages/guide-install';
import { createPublicLayout } from '@/src/shared/lib/layout/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = GuideInstallPage;
Page.getLayout = createPublicLayout({ showFooter: false });

export default Page;
