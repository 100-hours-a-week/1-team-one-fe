import { AppPlanPage } from '@/src/pages/app-plan';
import { withAuthenticatedLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = AppPlanPage;
Page.getLayout = withAuthenticatedLayout;

export default Page;
