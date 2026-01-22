import { OnboardingSurveyPage } from '@/src/pages/onboarding-survey';
import { withAuthenticatedLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = OnboardingSurveyPage;
Page.getLayout = withAuthenticatedLayout;

export default Page;
