import { StretchSessionPage } from '@/src/pages/stretch-session';
import { createAuthenticatedLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = StretchSessionPage;
Page.getLayout = createAuthenticatedLayout({ showFooter: false });
export default Page;
