import { OnboardingSurveyPage } from '@/src/pages/onboarding-survey';
import { createAuthenticatedLayout } from '@/src/shared/lib/layout/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = OnboardingSurveyPage;
Page.getLayout = createAuthenticatedLayout({ showFooter: false });
export default Page;
