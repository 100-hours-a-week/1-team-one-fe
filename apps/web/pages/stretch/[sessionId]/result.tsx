import { StretchSessionResultPage } from '@/src/pages/stretch-session-result';
import { createAuthenticatedLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = StretchSessionResultPage;
Page.getLayout = createAuthenticatedLayout({ showFooter: false, isPageScroll: true });

export default Page;
