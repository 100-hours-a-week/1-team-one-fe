import { GuideInstallPage } from '@/src/pages/guide';
import { withPublicLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = GuideInstallPage;
Page.getLayout = withPublicLayout;

export default Page;
