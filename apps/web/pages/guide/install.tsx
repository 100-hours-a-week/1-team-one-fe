import { GuideInstallPage } from '@/src/pages/guide';
import { createPublicLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = GuideInstallPage;
Page.getLayout = createPublicLayout();

export default Page;
