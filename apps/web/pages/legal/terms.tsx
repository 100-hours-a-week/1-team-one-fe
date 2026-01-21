import { LegalTermsPage } from '@/src/pages/legal';
import { withPublicLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = LegalTermsPage;
Page.getLayout = withPublicLayout;

export default Page;
