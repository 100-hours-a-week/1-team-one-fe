import { AppPlanPage } from '@/src/pages/app-plan';
import { createAuthenticatedLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = AppPlanPage;
Page.getLayout = createAuthenticatedLayout({ showFooter: false });
export default Page;
