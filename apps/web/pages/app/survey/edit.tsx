import { SurveyEditPage } from '@/src/pages/survey-edit';
import { withAppLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = SurveyEditPage;
Page.getLayout = withAppLayout;

export default Page;
