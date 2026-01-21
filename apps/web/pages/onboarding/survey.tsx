import { OnboardingSurveyPage } from '@/src/pages/onboarding';
import { createPublicLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = OnboardingSurveyPage;
Page.getLayout = createPublicLayout();

export default Page;
