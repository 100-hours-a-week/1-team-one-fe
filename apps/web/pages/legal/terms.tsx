import { LegalTermsPage } from '@/src/pages/legal';
import { createPublicLayout } from '@/src/shared/lib/layout/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = LegalTermsPage;
Page.getLayout = createPublicLayout();

export default Page;
