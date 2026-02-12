import { SurveyEditPage } from '@/src/pages/survey-edit';
import { createAuthenticatedLayout } from '@/src/shared/lib/layout/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = SurveyEditPage;
Page.getLayout = createAuthenticatedLayout({
  showFooter: false,
  headerConfig: {
    variant: 'sub',
    title: '설문 수정',
  },
});

export default Page;
