import { MomentsNewPage } from '@/src/pages/moments-new';
import { createPublicLayout } from '@/src/shared/lib/layout/layout';
import { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = MomentsNewPage;
Page.getLayout = createPublicLayout();
export default Page;
