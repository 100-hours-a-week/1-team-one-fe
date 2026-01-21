import { AppPlanPage } from '@/src/pages/app-plan';
import { withAppLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = AppPlanPage;
Page.getLayout = withAppLayout;

export default Page;
