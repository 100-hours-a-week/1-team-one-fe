import { SurveyEditPage } from '@/src/pages/survey-edit';
import { withAuthenticatedLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = SurveyEditPage;
Page.getLayout = withAuthenticatedLayout;

export default Page;
