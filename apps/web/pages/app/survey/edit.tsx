import { SurveyEditPage } from '@/src/pages/survey-edit';
import { createAuthenticatedLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = SurveyEditPage;
Page.getLayout = createAuthenticatedLayout({ showFooter: false });

export default Page;
