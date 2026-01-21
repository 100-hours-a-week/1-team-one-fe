import { OnboardingSurveyPage } from '@/src/pages/onboarding';
import { withPublicLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = OnboardingSurveyPage;
Page.getLayout = withPublicLayout;

export default Page;
